import React, { Suspense } from "react";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import SafeCanvas from "./SafeCanvas";

const MODEL_PATH = "./planet/scene.gltf";

const Earth = () => {
  const earth = useGLTF(MODEL_PATH);

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const MESSAGES = {
  unsupported: "This browser can't render 3D graphics.",
  lost: "The 3D view lost its graphics context.",
  error: "The 3D model couldn't be loaded.",
};

// Shown when the globe can't render — no WebGL, a context that never came back,
// or a model that failed to download. The contact section still has to look
// finished next to the form, so this is a styled placeholder rather than a gap.
// Retrying only helps the last two cases; a browser without WebGL won't change
// its mind.
const EarthFallback = ({ reason, retry }) => (
  <div className='w-full h-full flex items-center justify-center'>
    <div className='w-56 h-56 rounded-full border border-white/10 bg-black-100 flex flex-col items-center justify-center gap-3 px-8 text-center'>
      <span className='font-mono text-[12px] text-secondary leading-5'>
        {MESSAGES[reason] ?? MESSAGES.error}
      </span>
      {reason !== "unsupported" && (
        <button
          type='button'
          onClick={retry}
          className='font-mono text-[12px] text-peach hover:text-peach-dark transition-colors underline underline-offset-4'
        >
          try again
        </button>
      )}
    </div>
  </div>
);

const EarthCanvas = () => {
  return (
    <SafeCanvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      fallback={EarthFallback}
      // drei caches the rejected promise, so without clearing it a retry would
      // fail instantly with the same error instead of refetching the model.
      onRetry={() => useGLTF.clear(MODEL_PATH)}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.0}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </SafeCanvas>
  );
};

export default EarthCanvas;
