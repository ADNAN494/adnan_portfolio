import { useState, useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import SafeCanvas from "./SafeCanvas";
import { ResumeOnVisible, useNearViewport } from "./visibility";
import useReducedMotion from "../../utils/useReducedMotion";
import { useTheme } from "../../utils/theme";

const Stars = ({ animate = true, color, opacity, ...props }) => {
  const ref = useRef();
  const [sphere] = useState(() => {
    // Length must be a multiple of 3 (x, y, z per point). maath's inSphere can
    // also emit the odd NaN, so scrub them  otherwise Three.js warns about a
    // NaN bounding sphere.
    const positions = random.inSphere(new Float32Array(5001), { radius: 1.2 });
    for (let i = 0; i < positions.length; i++) {
      if (Number.isNaN(positions[i])) positions[i] = 0;
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (!ref.current || !animate) return;
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
          opacity={opacity}
          color={color}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = ({ className = "w-full h-full absolute inset-0" }) => {
  // The canvas is built once and kept for the life of the page. When it scrolls
  // out of view we PAUSE the render loop rather than unmounting it:
  // frameloop="never" costs nothing while off screen  no rAF, no draw calls,
  // no GPU work  and there is no context to rebuild when it comes back.
  const [containerRef, visible] = useNearViewport();

  // A slowly rotating starfield behind the whole page is exactly the kind of
  // continuous background motion "reduce motion" exists to stop. "demand"
  // paints the field once and then leaves it there  the visual stays, the
  // movement goes.
  const reduced = useReducedMotion();
  const frameloop = reduced ? "demand" : visible ? "always" : "never";

  // Mint at full strength on the dark theme, as it always was. On the light
  // canvas mint is invisible, and full-strength dark points read as dust on a
  // screen rather than a field of stars  so pine, at partial opacity.
  const dark = useTheme() === "dark";
  const starColor = dark ? "#6ee7b7" : "#0b7152";
  const starOpacity = dark ? 1 : 0.55;

  return (
    <div ref={containerRef} className={className}>
      {/* antialias off: this canvas is full-viewport, and 4x MSAA multiplies
          its drawing buffer  ~90 MB at 1.5 dpr on a laptop screen, twice
          over with the contact backdrop. PointMaterial already draws soft
          round points, so MSAA bought nothing visible. On a small integrated
          GPU that memory pressure is what triggers real context losses. */}
      <SafeCanvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
      >
        <ResumeOnVisible active={visible} />

        <Suspense fallback={null}>
          <Stars animate={!reduced} color={starColor} opacity={starOpacity} />
        </Suspense>

        <Preload all />
      </SafeCanvas>
    </div>
  );
};

export default StarsCanvas;
