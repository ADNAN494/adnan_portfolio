import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

let mounted = false;
const mount = () => {
  if (mounted) return;
  mounted = true;
  // NOTE: deliberately not wrapped in <React.StrictMode>.
  //
  // @react-three/fiber 8.x is not compatible with React 18's StrictMode
  // double-mount. Its <Canvas> keeps the renderer root in a ref, so the
  // simulated remount reuses the live renderer — but the simulated unmount has
  // already queued unmountComponentAtNode(), which calls forceContextLoss()
  // from inside a setTimeout(..., 500). Half a second after load that teardown
  // kills the context of a canvas that is actively rendering:
  //   WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
  //   THREE.WebGLRenderer: Context Lost.
  // StrictMode is dev-only, so this costs nothing in production. Revisit if we
  // ever move to r3f 9 / React 19, which fixes the remount handling.
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
};

// Give the browser one frame to paint the static shell in index.html before
// React replaces it — otherwise first paint waits for the full React render.
requestAnimationFrame(() => requestAnimationFrame(mount));
// rAF doesn't fire in hidden/backgrounded tabs; make sure we still mount.
setTimeout(mount, 300);
