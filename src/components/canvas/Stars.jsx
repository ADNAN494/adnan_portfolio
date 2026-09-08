import { useState, useRef, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import SafeCanvas from "./SafeCanvas";

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => {
    // Length must be a multiple of 3 (x, y, z per point). maath's inSphere can
    // also emit the odd NaN, so scrub them — otherwise Three.js warns about a
    // NaN bounding sphere.
    const positions = random.inSphere(new Float32Array(5001), { radius: 1.2 });
    for (let i = 0; i < positions.length; i++) {
      if (Number.isNaN(positions[i])) positions[i] = 0;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Clamp delta so resuming after the frameloop was paused (off-screen)
    // doesn't produce a sudden rotation jump.
    const d = Math.min(delta, 0.05);
    ref.current.rotation.x -= d / 10;
    ref.current.rotation.y -= d / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#6ee7b7'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Restarts the render loop when the starfield scrolls back into view.
//
// r3f's rAF loop is global across every canvas on the page, and it cancels
// itself the moment no root asks for a frame ("if (repeat === 0) { running =
// false; cancelAnimationFrame(frame) }"). Flipping the frameloop prop back to
// "always" only writes to the store — configure() calls setFrameloop(), which
// never restarts the loop. invalidate() is the only thing that does, and it
// refuses to run while frameloop is still "never", so it has to happen from
// inside the canvas after the store has been updated. Without this the stars
// freeze for good the first time every canvas goes idle at once.
const ResumeOnVisible = ({ active }) => {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  return null;
};

const StarsCanvas = ({ className = "w-full h-full absolute inset-0" }) => {
  const containerRef = useRef(null);

  // The canvas is built once and kept for the life of the page. When it scrolls
  // out of view we PAUSE the render loop rather than unmounting it.
  //
  // This used to unmount after 1.5 s off screen, to hand the WebGL context back
  // and stay under Chrome's ~16 live-context cap. That was the wrong trade. Two
  // idle contexts were never close to the cap, but every unmount makes r3f call
  // forceContextLoss() — and Chrome counts a page's forced context losses and
  // permanently blocks it from creating any more once the count gets high
  // ("Web page caused context loss and was blocked"; see SafeCanvas). Scrolling
  // the hero and contact sections in and out a handful of times was enough to
  // burn through the budget and kill every canvas on the page until a reload.
  //
  // frameloop="never" costs nothing while off screen — no rAF, no draw calls,
  // no GPU work — and keeps the context alive, so nothing ever has to be
  // recreated. Cheaper than the old scheme and it can't trip the guard.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // A little margin so the stars are already turning by the time they scroll in.
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <SafeCanvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
      >
        <ResumeOnVisible active={active} />

        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </SafeCanvas>
    </div>
  );
};

export default StarsCanvas;
