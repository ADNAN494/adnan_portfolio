import { Suspense, lazy } from "react";
import { MotionConfig } from "framer-motion";

import { About, Clients, Contact, Experience, Hero, Navbar, Tech, Works } from "./components";
import LazyShow from "./components/LazyShow";

const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  return (
    // reducedMotion="user" makes every framer-motion animation on the page honour
    // the visitor's OS setting: transform and layout animations are dropped, opacity
    // is kept, so the section reveals, the hero letter stagger and the timeline
    // still fade in without anything flying across the screen. The animations
    // framer-motion does not own — the typewriter, the starfield, the globe —
    // are handled at their own components via utils/useReducedMotion.
    <MotionConfig reducedMotion="user">
      <div className='relative z-0 bg-primary'>
        <Navbar />
        <main>
          <div className='dot-grid'>
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Clients />
          <div className='relative z-0'>
            <Contact />
            <LazyShow className='absolute inset-0 z-[-1]'>
              <Suspense fallback={null}>
                <StarsCanvas />
              </Suspense>
            </LazyShow>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
