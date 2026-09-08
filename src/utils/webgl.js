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

// Deliberately no releaseRenderer() here. @react-three/fiber already runs
// renderLists.dispose() + forceContextLoss() + dispose() in
// unmountComponentAtNode() (index-*.esm.js:1947, inside a setTimeout(…, 500)).
// Calling forceContextLoss() ourselves is not just redundant — it doubles the
// page's guilty-loss count, and a canvas element whose context was explicitly
// lost hands back that same dead context from getContext() until it is
// restored, so if anything reuses the element the next renderer fails outright
// with "Error creating WebGL context". Let r3f own teardown, and mount canvases
// so rarely that its teardown almost never runs (see Stars.jsx).
