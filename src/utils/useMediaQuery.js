import { useEffect, useState } from "react";

const matches = (query) =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(query).matches;

// Tracks a CSS media query from JS, for the few cases where a breakpoint has to
// change behaviour rather than styling  e.g. which way an entry animation
// travels, since framer-motion variants can't read Tailwind's `md:` prefixes.
// Same Safari < 14 fallback as useReducedMotion.
const useMediaQuery = (query) => {
  const [match, setMatch] = useState(() => matches(query));

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const media = window.matchMedia(query);
    const onChange = (event) => setMatch(event.matches);
    setMatch(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [query]);

  return match;
};

export default useMediaQuery;
