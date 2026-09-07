import { useState, useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import SafeCanvas from "./SafeCanvas";

// Once the starfield has been off screen this long, tear the canvas down and
// give its WebGL context back to the browser. Debounced so scrolling past the
// boundary doesn't thrash contexts.
const UNMOUNT_DELAY_MS = 1500;

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
  // Two starfields (Hero + Contact) live on the page but are never both in view
  // on a tall screen. Keeping only the visible one mounted means one WebGL
  // context instead of two, which keeps us well clear of the browser's cap.
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // A little margin so the canvas is already built by the time it scrolls in.
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      return;
    }
    const id = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <div ref={containerRef} className={className}>
      {mounted && (
        <SafeCanvas
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Stars />
          </Suspense>

          <Preload all />
        </SafeCanvas>
      )}
    </div>
  );
};

export default StarsCanvas;
