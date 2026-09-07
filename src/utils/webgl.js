// WebGL capability helper.
//
// Browsers cap how many live WebGL contexts a page may hold (Chrome allows
// ~16) and force-lose the oldest past the cap — the
// "WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost" console message.
// three.js then throws "Error creating WebGL context" for the next renderer.

let supportCache;

// Cheap one-off probe: can this browser hand us a WebGL context at all?
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

    // Release the probe context immediately so it doesn't count against the cap.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    supportCache = Boolean(gl);
  } catch {
    supportCache = false;
  }

  return supportCache;
};

// Deliberately no releaseRenderer() here. @react-three/fiber already runs
// renderLists.dispose() + forceContextLoss() + dispose() in
// unmountComponentAtNode(). Calling forceContextLoss() ourselves on unmount is
// not just redundant — a canvas element whose context was explicitly lost
// hands back that same dead context from getContext() until it is restored, so
// if anything reuses the element the next renderer fails outright with
// "Error creating WebGL context". Let r3f own teardown.
