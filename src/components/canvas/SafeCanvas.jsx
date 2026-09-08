import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import ErrorBoundary from "../ErrorBoundary";
import { isWebGLAvailable } from "../../utils/webgl";

// ---------------------------------------------------------------------------
// Chrome's "guilty page" guard — the failure this file exists to survive.
//
// Chrome counts how many times a page forcibly loses a WebGL context (any call
// to the WEBGL_lose_context extension — which is exactly what three.js's
// renderer.forceContextLoss() does, and what @react-three/fiber runs on EVERY
// canvas unmount). Past the threshold the GPU process stops handing the page
// contexts entirely, for the rest of the page's life:
//
//   THREE.WebGLRenderer: A WebGL context could not be created.
//   Reason: Web page caused context loss and was blocked
//   ...
//   THREE.WebGLRenderer: Error creating WebGL context.
//
// Nothing recovers from that except a reload — and every further attempt fails
// *and* counts against the page again, so a retry loop turns one bad canvas
// into a page-wide outage. The moment we see it, every canvas on the page stops
// trying and shows its fallback.
//
// The real cure is upstream: don't churn canvases. See Stars.jsx — canvases are
// created once and paused, never unmounted, so forceContextLoss() effectively
// never runs. This flag is the safety net for the cases we don't control (a
// GPU driver reset, a laptop switching GPUs, dev-server hot reloads).
// ---------------------------------------------------------------------------
let creationBlocked = false;
const subscribers = new Set();

const markBlocked = () => {
  if (creationBlocked) return;
  creationBlocked = true;
  subscribers.forEach((notify) => notify());
};

if (typeof window !== "undefined") {
  // `webglcontextcreationerror` is dispatched at the canvas and does not bubble,
  // so listen in the capture phase — that still reaches us on the way down.
  // This fires before three.js throws, which is how we tell "blocked" apart
  // from an ordinary construction failure.
  window.addEventListener(
    "webglcontextcreationerror",
    (event) => {
      if (/blocked|context loss/i.test(event.statusMessage || "")) markBlocked();
    },
    true
  );
}

// One silent rebuild after the browser drops our context, then we stop. Each
// rebuild unmounts a canvas, and every unmount costs a forceContextLoss() —
// retrying harder is how a page gets itself blocked in the first place.
const MAX_RETRIES = 1;

// Wait this long after a context loss for the browser to restore it on its own.
// If webglcontextrestored never fires (the usual case when the context was
// evicted rather than reset), rebuild the canvas ourselves.
const RESTORE_GRACE_MS = 1500;

const DEFAULT_GL = {
  antialias: true,
  alpha: true,
  // Never keep a second copy of the framebuffer around — it doubles GPU memory
  // per canvas and is only needed for canvas.toDataURL() screenshots.
  preserveDrawingBuffer: false,
  // Without this, a machine on software rendering (or a laptop that just
  // switched GPUs) gets a null context and three.js throws outright.
  failIfMajorPerformanceCaveat: false,
};

// A drop-in <Canvas> that degrades instead of crashing. Three failure modes:
//
//   "unsupported" — the browser has no WebGL at all, or has blocked this page.
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
  const [supported] = useState(isWebGLAvailable);
  const [blocked, setBlocked] = useState(creationBlocked);
  const [generation, setGeneration] = useState(0);
  const [failure, setFailure] = useState(supported ? null : "unsupported");

  const retriesRef = useRef(0);
  const restoreTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(restoreTimerRef.current), []);

  // Another canvas on the page hit the block — stand down too, rather than
  // spending our own attempts discovering the same thing.
  useEffect(() => {
    const notify = () => setBlocked(true);
    subscribers.add(notify);
    return () => subscribers.delete(notify);
  }, []);

  // Automatic, capped rebuild after a context loss. Note we never call
  // forceContextLoss() ourselves — r3f's unmount path already does, and doing
  // it early poisons a canvas element that is about to be reused.
  const rebuild = useCallback(() => {
    clearTimeout(restoreTimerRef.current);
    if (creationBlocked || retriesRef.current >= MAX_RETRIES) {
      setFailure("lost");
      return;
    }
    retriesRef.current += 1;
    setGeneration((g) => g + 1);
  }, []);

  // Manual retry from the fallback UI. Resets the budget, because a person
  // clicking "try again" is a fresh signal — maybe they reconnected. Pointless
  // once the page is blocked, so the fallback hides the link in that case.
  const retry = useCallback(() => {
    if (creationBlocked) return;
    clearTimeout(restoreTimerRef.current);
    retriesRef.current = 0;
    onRetry?.();
    setFailure(null);
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

      onCreated?.(state);
    },
    [onCreated, rebuild]
  );

  // A blocked page can't produce a context no matter what we do, so report it
  // as "unsupported" — the one reason for which the fallback hides its retry.
  const reason = blocked ? "unsupported" : failure;

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
        // Belt and braces: if the creation-error event didn't reach us, the
        // thrown message still identifies a construction failure.
        if (/creating webgl context/i.test(error?.message ?? "")) markBlocked();
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
