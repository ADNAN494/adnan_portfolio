// WebGL capability helper.
//
// "Web page caused context loss and was blocked" is Chrome's domain-level guard
// against REAL GPU resets — not against pages calling loseContext(). From
// Chromium's source (content/browser/gpu/gpu_data_manager_impl_private.cc):
//
//   - every real context loss (driver reset, GPU process crash, out of GPU
//     memory, a dual-GPU Mac switching GPUs) records the page's HOST;
//   - two or more within kBlockedDomainExpirationPeriod (2 minutes) blocks that
//     host — for every tab and every reload — until the entries expire;
//   - three separate reset events inside the window block ALL hosts.
//
// A page calling WEBGL_lose_context.loseContext() (which is what three's
// forceContextLoss() does) is a *synthetic* loss: it never reaches the browser
// process, so it can't contribute to the block. You can tell the two apart in
// the console, too — Blink only prints
//
//   WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
//
// for a real loss (kRealLostContext → kDisplayInConsole in
// webgl_rendering_context_base.cc). Seeing that line means the GPU dropped us.
//
// So the defence is to ask the GPU for less, not to avoid loseContext(). An
// earlier "fix" here replaced forceContextLoss() with a no-op on the wrong
// theory; all it did was keep every discarded context (and its drawing buffer)
// alive until GC, which on a 1.5 GB integrated GPU during a dev session full of
// HMR remounts is exactly the memory pressure that causes real resets.

// How long Chrome keeps a host blocked. Canvases that were refused a context
// may try again once this has passed. A little margin past Chrome's 2 minutes.
export const BLOCK_EXPIRY_MS = 125_000;

export const isBlockedMessage = (message = "") =>
  /blocked|caused context loss/i.test(message);

let supportCache;

// Cheap probe: can this browser hand us a WebGL context?
//
//   "ok"          — yes.
//   "blocked"     — WebGL exists, but Chrome is refusing this host for now.
//                   Not cached: the block expires, and the next probe after
//                   that should say "ok".
//   "unsupported" — no WebGL at all. Cached; that won't change mid-visit.
//
// The probe's context is released straight away. A synthetic loss is free (see
// above), and holding a context we don't need is not.
export const probeWebGL = () => {
  if (supportCache) return supportCache;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return (supportCache = "unsupported");
  }

  let blocked = false;
  try {
    const canvas = document.createElement("canvas");
    // The canvas is detached, so a window-level listener would never see this.
    canvas.addEventListener("webglcontextcreationerror", (event) => {
      if (isBlockedMessage(event.statusMessage)) blocked = true;
    });
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (gl) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return (supportCache = "ok");
    }
  } catch {
    // fall through
  }

  if (blocked) return "blocked";
  return (supportCache = "unsupported");
};
