import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

// Shared frameloop plumbing for every canvas on the page.
//
// The rule this file exists to enforce: NEVER unmount a <Canvas> to free its
// WebGL context. @react-three/fiber's unmount path calls forceContextLoss(),
// Chrome counts those, and past a threshold it refuses the page any further
// context for the rest of its life (see SafeCanvas.jsx and ARCHITECTURE §3.2).
// A canvas that is off screen costs nothing as long as its render loop is
// stopped, so pause instead: keep the context, drop the frames.

// Tracks whether the element is anywhere near the viewport. Unlike LazyShow
// this observer is never disconnected — it has to keep reporting, because the
// canvas is paused on the way out as well as resumed on the way in.
export const useNearViewport = ({ rootMargin = "200px" } = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, visible];
};

// Restarts the render loop when a paused canvas comes back into view.
//
// This is load-bearing, and it has to live INSIDE the canvas. r3f's rAF loop is
// global across every root on the page and cancels itself the moment nothing
// wants a frame ("if (repeat === 0) { running = false; cancelAnimationFrame(
// frame) }"). Flipping the frameloop prop back to "always" only writes to the
// store — configure() calls setFrameloop(), which never restarts the loop.
// invalidate() is the only thing that does, and it refuses to run while
// frameloop is still "never", so it must fire after the store has updated.
// Without this every canvas freezes for good the first time they all go idle
// at once.
//
// `active` is whatever the canvas's frameloop prop was derived from, so the
// effect re-runs on the same tick the prop changes.
export const ResumeOnVisible = ({ active }) => {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  return null;
};
