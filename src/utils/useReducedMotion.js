import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(QUERY).matches;

// Reads the visitor's OS-level "reduce motion" setting and keeps up with it if
// they change it mid-session.
//
// Framer Motion's own variants are handled globally by <MotionConfig
// reducedMotion="user"> in App.jsx — it drops transform and layout animations
// while keeping opacity, which covers every fadeIn/slideIn/textVariant on the
// page. This hook is for the animation Framer Motion knows nothing about: the
// hero typewriter, the rotating starfield and the auto-rotating globe. Those
// are continuous rather than one-shot, which is the kind that actually makes
// people ill, so they get switched off rather than shortened.
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(prefersReduced);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);

    // Safari < 14 only has the deprecated addListener/removeListener pair.
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return reduced;
};

export default useReducedMotion;
