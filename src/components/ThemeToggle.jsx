import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { getTheme, setTheme, useTheme } from "../utils/theme";
import useReducedMotion from "../utils/useReducedMotion";

// How far the page has to scroll before the switch shows. The hero is a clean
// first screen; the switch arrives once the visitor starts reading.
const SHOW_AFTER = 120;

// Thumb travel: one 32px icon slot plus the 4px gap between the two.
const THUMB_TRAVEL = 36;

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z"
      fill="currentColor"
    />
  </svg>
);

// Switches the page between the light theme and the original dark one.
//
// The new theme is revealed as a circle growing out of the switch, using the
// View Transitions API: the browser snapshots the page, the theme flips, and
// ::view-transition-new(root) is clipped from a 0px circle at the button to one
// that covers the viewport. Browsers without the API get a short colour ease
// instead (`theme-fading` in index.css), and "reduce motion" gets an instant
// switch.
const switchTheme = (origin, reduced) => {
  const next = getTheme() === "dark" ? "light" : "dark";
  const root = document.documentElement;

  if (reduced) {
    setTheme(next);
    return;
  }

  if (typeof document.startViewTransition === "function") {
    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Distance to the farthest corner, so the circle ends up covering it all.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // flushSync so the switch's own icon re-renders inside the snapshot,
    // rather than a frame after the reveal has started.
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    return;
  }

  root.classList.add("theme-fading");
  setTheme(next);
  window.setTimeout(() => root.classList.remove("theme-fading"), 400);
};

const ThemeToggle = () => {
  const dark = useTheme() === "dark";
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // setState with the same boolean is a no-op render, so this is cheap even
    // though it fires on every scroll event.
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Positioning lives on this plain wrapper, animation on the motion.div
    // inside it: framer-motion writes `transform` inline, which would wipe out
    // the -translate-y-1/2 that centres the switch on the right edge.
    //
    // Right edge, vertically centred, from md up. On phones it drops to the
    // bottom-right corner, where a thumb can reach it and it covers less of
    // the reading column.
    //
    // 40px wide at right-4, the mirror of SocialRail on the left: that leaves
    // 8px between the switch and content, which stops 64px from the edge
    // (the section gutter) at every width until the centred column pulls
    // away around 1400px. At 50px / right-6 it overlapped card edges by 10px
    // from 768 to ~1340px.
    <div className="fixed z-30 right-4 bottom-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 min-[1400px]:right-8">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="theme-toggle"
            initial={{ opacity: 0, x: 24, scale: 0.6 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="relative"
          >
            {/* One ring pulse each time the switch arrives, so the eye finds
                it, then nothing. Scaled 1.35x it still stays inside the 16px
                gutter to the right edge. */}
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.35 }}
              transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-ember"
            />

            <button
              type="button"
              role="switch"
              aria-checked={dark}
              aria-label="Dark theme"
              onClick={(event) => switchTheme(event.currentTarget, reduced)}
              className="group relative flex flex-col gap-1 p-[3px] rounded-full border border-line bg-surface/85 backdrop-blur-md shadow-lift transition-colors hover:border-ember/50"
            >
              {/* The thumb marks the active theme; it slides between the two
                  icon slots. Its fill is ember in both themes, so the active
                  icon sits on it in `text-canvas`. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ y: dark ? THUMB_TRAVEL : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="absolute left-[3px] top-[3px] w-8 h-8 rounded-full bg-ember shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45)]"
              />

              <span
                className={`relative z-10 w-8 h-8 flex items-center justify-center transition-colors duration-300 ${
                  dark ? "text-ink-muted group-hover:text-ink" : "text-canvas"
                }`}
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: dark ? -90 : 0, scale: dark ? 0.8 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex"
                >
                  <SunIcon />
                </motion.span>
              </span>

              <span
                className={`relative z-10 w-8 h-8 flex items-center justify-center transition-colors duration-300 ${
                  dark ? "text-canvas" : "text-ink-muted group-hover:text-ink"
                }`}
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: dark ? 0 : 40, scale: dark ? 1 : 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex"
                >
                  <MoonIcon />
                </motion.span>
              </span>

              {/* Hover / keyboard-focus label, sliding out to the left. Not on
                  phones  there's no hover, and the switch is self-evident. */}
              <span className="hidden md:block pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full bg-ink text-canvas text-[12px] font-bold px-3 py-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
                {dark ? "Light mode" : "Dark mode"}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
