import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

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

const StarsCanvas = ({ className = "w-full h-full absolute inset-0" }) => {
  const containerRef = useRef(null);
  // Only animate while the canvas is on screen. Two starfields (Hero + Contact)
  // are never visible at once on a tall page, so the off-screen one stays idle.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
