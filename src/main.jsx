import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

let mounted = false;
const mount = () => {
  if (mounted) return;
  mounted = true;
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Give the browser one frame to paint the static shell in index.html before
// React replaces it — otherwise first paint waits for the full React render.
requestAnimationFrame(() => requestAnimationFrame(mount));
// rAF doesn't fire in hidden/backgrounded tabs; make sure we still mount.
setTimeout(mount, 300);
