import { Suspense, lazy } from "react";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works } from "./components";
import LazyShow from "./components/LazyShow";

const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const App = () => {
  return (
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
        <Feedbacks />
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
  );
}

export default App;
