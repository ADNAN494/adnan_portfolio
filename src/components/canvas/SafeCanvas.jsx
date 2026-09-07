import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import ErrorBoundary from "../ErrorBoundary";
import { isWebGLAvailable } from "../../utils/webgl";

// How many times we silently rebuild a canvas after the browser drops its GPU
// context before handing the user a fallback. Retrying forever would thrash:
// each new context can evict another canvas's context, which then retries too.
const MAX_RETRIES = 2;

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
//   "unsupported" — the browser has no WebGL at all.
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
  const [generation, setGeneration] = useState(0);
  const [failure, setFailure] = useState(supported ? null : "unsupported");

  const retriesRef = useRef(0);
  const restoreTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(restoreTimerRef.current), []);

  // Automatic, capped rebuild after a context loss. Note we never call
  // forceContextLoss() ourselves — r3f's unmount path already does, and doing
  // it early poisons a canvas element that is about to be reused.
  const rebuild = useCallback(() => {
    clearTimeout(restoreTimerRef.current);
    if (retriesRef.current >= MAX_RETRIES) {
      setFailure("lost");
      return;
    }
    retriesRef.current += 1;
    setGeneration((g) => g + 1);
  }, []);

  // Manual retry from the fallback UI. Resets the budget, because a person
  // clicking "try again" is a fresh signal — maybe they reconnected.
  const retry = useCallback(() => {
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

  if (failure) {
    return typeof fallback === "function"
      ? fallback({ reason: failure, retry })
      : fallback;
  }

  return (
    <ErrorBoundary
      key={generation}
      fallback={null}
      onError={() => setFailure("error")}
    >
      <Canvas gl={{ ...DEFAULT_GL, ...gl }} onCreated={handleCreated} {...props}>
        {children}
      </Canvas>
    </ErrorBoundary>
  );
};

export default SafeCanvas;
