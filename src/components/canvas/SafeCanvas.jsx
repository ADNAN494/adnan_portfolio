import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import ErrorBoundary from "../ErrorBoundary";
import { BLOCK_EXPIRY_MS, isBlockedMessage, probeWebGL } from "../../utils/webgl";

// ---------------------------------------------------------------------------
// Chrome's domain block — the failure this file has to ride out.
//
//   THREE.WebGLRenderer: A WebGL context could not be created.
//   Reason: Web page caused context loss and was blocked
//
// Chrome raises it after two REAL GPU context losses from one host inside two
// minutes (driver reset, GPU process crash, out of GPU memory, a dual-GPU Mac
// switching GPUs). It refuses new contexts to that host — across tabs and
// reloads — until the two minutes are up. Page-initiated loseContext() calls do
// not count. Full reasoning, with the Chromium source, in utils/webgl.js and
// ARCHITECTURE §3.2.
//
// So there are two jobs here:
//
//   1. Don't cause real losses. DEFAULT_GL asks for as little of the GPU as a
//      decorative background needs; each canvas trims further (Stars.jsx turns
//      off MSAA, Earth.jsx caps its dpr).
//   2. When the block happens anyway, wait it out. A blocked attempt fails
//      without costing anything, but it can't succeed either, so canvases still
//      waiting for a context stand down until BLOCK_EXPIRY_MS has passed and
//      then try once more. Canvases that already have a context keep it — the
//      block only refuses new ones.
// ---------------------------------------------------------------------------
let creationBlocked = false;
let blockWaits = 0;
const subscribers = new Set();

// After this many blocks in one visit the GPU is clearly unhappy; stop asking.
const MAX_BLOCK_WAITS = 3;

const notifyAll = () =>
  // Deferred: markBlocked() can run during a render (from the probe), and
  // setting another component's state mid-render is an error.
  queueMicrotask(() => subscribers.forEach((notify) => notify()));

const markBlocked = () => {
  if (creationBlocked) return;
  creationBlocked = true;
  notifyAll();

  blockWaits += 1;
  if (blockWaits > MAX_BLOCK_WAITS) return;
  setTimeout(() => {
    creationBlocked = false;
    notifyAll();
  }, BLOCK_EXPIRY_MS);
};

if (typeof window !== "undefined") {
  // `webglcontextcreationerror` is dispatched at the canvas and does not bubble,
  // so listen in the capture phase — that still reaches us on the way down.
  // This fires before three.js throws, which is how we tell "blocked" apart
  // from an ordinary construction failure.
  window.addEventListener(
    "webglcontextcreationerror",
    (event) => {
      if (isBlockedMessage(event.statusMessage)) markBlocked();
    },
    true
  );
}

// One silent rebuild after the browser drops our context, then we stop — a
// canvas that has failed twice is failing for a reason retrying won't change.
const MAX_RETRIES = 1;

// Wait this long after a context loss for the browser to restore it on its own.
// If webglcontextrestored never fires (the usual case when the context was
// evicted rather than reset), rebuild the canvas ourselves.
const RESTORE_GRACE_MS = 1500;

const DEFAULT_GL = {
  antialias: true,
  alpha: true,
  // r3f defaults to "high-performance", which on a dual-GPU Mac powers up the
  // discrete GPU — and switching GPUs is itself a real context loss. A
  // decorative background has no business asking for the big GPU.
  powerPreference: "low-power",
  // Never keep a second copy of the framebuffer around — it doubles GPU memory
  // per canvas and is only needed for canvas.toDataURL() screenshots.
  preserveDrawingBuffer: false,
  // Without this, a machine on software rendering (or a laptop that just
  // switched GPUs) gets a null context and three.js throws outright.
  failIfMajorPerformanceCaveat: false,
};

// A drop-in <Canvas> that degrades instead of crashing. Failure reasons:
//
//   "unsupported" — the browser has no WebGL at all.
//   "blocked"     — Chrome is refusing this host new contexts for now. Clears
//                   itself when the block expires; no manual retry needed.
//   "lost"        — the GPU context was dropped mid-session and didn't come back.
//   "error"       — anything thrown out of the canvas tree: renderer construction,
//                   or a model that failed to load (r3f rethrows those outward).
//
// `fallback` is a node, or a function ({ reason, retry }) => node so the caller
// can word the message and offer a retry. `onRetry` runs just before a manual
// retry — the hook for clearing a cached failed asset (useGLTF.clear).
const SafeCanvas = ({
  children,
  fallback = null,
  onRetry,
  gl,
  onCreated,
  ...props
}) => {
  const [supported] = useState(() => {
    const result = probeWebGL();
    if (result === "blocked") markBlocked();
    return result !== "unsupported";
  });
  const [blocked, setBlocked] = useState(creationBlocked);
  const [generation, setGeneration] = useState(0);
  const [failure, setFailure] = useState(supported ? null : "unsupported");
  // Whether the CURRENT canvas has been handed a working context. Decides
  // whether a block applies to us — see `reason` below.
  const [hasContext, setHasContext] = useState(false);

  const retriesRef = useRef(0);
  const restoreTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(restoreTimerRef.current), []);

  // Follow the page-wide block in both directions: stand down when another
  // canvas hits it, and come back when it expires.
  useEffect(() => {
    const notify = () => setBlocked(creationBlocked);
    subscribers.add(notify);
    // It may have changed between our first render and this subscription.
    notify();
    return () => subscribers.delete(notify);
  }, []);

  // Automatic, capped rebuild after a context loss.
  const rebuild = useCallback(() => {
    clearTimeout(restoreTimerRef.current);
    // Blocked: the new canvas can't get a context yet. Drop back to waiting;
    // the block's expiry brings us back.
    if (creationBlocked) {
      setHasContext(false);
      setGeneration((g) => g + 1);
      return;
    }
    if (retriesRef.current >= MAX_RETRIES) {
      setFailure("lost");
      return;
    }
    retriesRef.current += 1;
    setHasContext(false);
    setGeneration((g) => g + 1);
  }, []);

  // Manual retry from the fallback UI. Resets the budget, because a person
  // clicking "try again" is a fresh signal — maybe they reconnected.
  const retry = useCallback(() => {
    clearTimeout(restoreTimerRef.current);
    retriesRef.current = 0;
    onRetry?.();
    setFailure(null);
    setHasContext(false);
    setGeneration((g) => g + 1);
  }, [onRetry]);

  const handleCreated = useCallback(
    (state) => {
      const canvas = state.gl.domElement;

      // preventDefault() is what marks the context as restorable; skip it and
      // the browser never fires webglcontextrestored.
      const onLost = (event) => {
        event.preventDefault();
        clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = setTimeout(rebuild, RESTORE_GRACE_MS);
      };

      // The context came back, but every buffer, texture and shader on it is
      // gone, so the scene has to be built again from scratch.
      const onRestored = () => rebuild();

      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestored);

      setHasContext(true);
      onCreated?.(state);
    },
    [onCreated, rebuild]
  );

  // A live canvas carries on through a block — it says nothing about contexts
  // that already exist. Only a canvas still waiting for one stands down.
  const reason = failure ?? (blocked && !hasContext ? "blocked" : null);

  if (reason) {
    return typeof fallback === "function"
      ? fallback({ reason, retry })
      : fallback;
  }

  return (
    <ErrorBoundary
      key={generation}
      fallback={null}
      onError={(error) => {
        // A failed creation is treated as a block: markBlocked() parks this
        // canvas on "blocked" (the boundary shows nothing meanwhile) and the
        // expiry mounts it afresh. Don't remount here — that would just spend
        // attempts before the block state lands. Anything else is a real error.
        if (/creating webgl context/i.test(error?.message ?? "")) {
          markBlocked();
          return;
        }
        setFailure("error");
      }}
    >
      <Canvas gl={{ ...DEFAULT_GL, ...gl }} onCreated={handleCreated} {...props}>
        {children}
      </Canvas>
    </ErrorBoundary>
  );
};

export default SafeCanvas;
