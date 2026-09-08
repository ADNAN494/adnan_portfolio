// WebGL capability helper.
//
// Chrome charges a page every time it *forcibly* loses a WebGL context — any
// call to the WEBGL_lose_context extension. Cross the threshold and the GPU
// process refuses to give the page another context for the rest of its life:
//
//   THREE.WebGLRenderer: A WebGL context could not be created.
//   Reason: Web page caused context loss and was blocked
//
// So this probe must never call loseContext(). It used to, on the theory that
// releasing the probe context kept us under the ~16 live-context cap — but that
// traded a cap we were nowhere near for the one guard that is unrecoverable.
// The throwaway canvas is unreachable the moment this function returns, and the
// browser reclaims its context when the canvas is garbage collected.

let supportCache;

// Cheap one-off probe: can this browser hand us a WebGL context at all?
// Cached, so the context is created at most once per page load.
export const isWebGLAvailable = () => {
  if (supportCache !== undefined) return supportCache;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return (supportCache = false);
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    supportCache = Boolean(gl);
  } catch {
    supportCache = false;
  }

  return supportCache;
};

// Stops @react-three/fiber spending one of Chrome's forced-context-loss
// allowance every time a <Canvas> unmounts.
//
// r3f's teardown runs, in this order (index-*.esm.js:1947, inside a 500 ms
// setTimeout):
//
//   state.events.disconnect()
//   state.gl.renderLists.dispose()
//   state.gl.forceContextLoss()     <- the problem
//   dispose(state)
//
// three's forceContextLoss() is exactly WEBGL_lose_context.loseContext(), the
// call Chrome counts and, past a threshold, permanently blocks the page for:
//
//   THREE.WebGLRenderer: A WebGL context could not be created.
//   Reason: Web page caused context loss and was blocked
//
// So every canvas unmount — an HMR update in dev, a StrictMode double-mount, a
// rebuild after a lost context, a fallback swap — used to cost a guilty loss.
// That is the leak the earlier fixes kept missing: they stopped the unmounts
// they knew about (scrolling) and left the rest.
//
// Overriding the method is safe and total. It is a plain function property on
// a renderer we own; r3f calls it optionally, so a no-op is a valid answer; and
// it is the LAST thing teardown touches, so renderLists, geometries, materials
// and textures are already disposed. Only the context itself outlives the call,
// and the browser reclaims that when the canvas element is garbage collected —
// the same reclamation isWebGLAvailable() above relies on.
//
// The trade: a context may linger until GC rather than dying on command.
// Chrome's live-context cap (~16) is far away with three canvases, and reaching
// it evicts the oldest context recoverably. The guilty-loss guard is
// unrecoverable without a reload. Lingering is strictly the better failure.
export const preventForcedContextLoss = (renderer) => {
  if (renderer && typeof renderer.forceContextLoss === "function") {
    renderer.forceContextLoss = () => {};
  }
  return renderer;
};
