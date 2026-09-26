export const textVariant = (delay) => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

export const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const zoomIn = (delay, duration) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const staggerContainer = (staggerChildren, delayChildren) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren || 0,
      },
    },
  };
};

// The reveal react-vertical-timeline-component gave the Experience section,
// kept when the section dropped the library. Same numbers as its CSS: 0.6s,
// CSS `ease` on every segment, the overshoot landing at 60%.
const BOUNCE = {
  duration: 0.6,
  times: [0, 0.6, 1],
  ease: [0.25, 0.1, 0.25, 1],
};

// cd-bounce-1: the timeline's logo pop.
export const popIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: [0, 1, 1],
    scale: [0.5, 1.2, 1],
    transition: { ...BOUNCE, delay },
  },
});

// cd-bounce-2 ("left": in from the left, overshooting 20px right) and
// cd-bounce-2-inverse ("right"). "up" is cd-bounce-2-up, the vertical swap
// index.css used to give phones: nothing may travel in past the right edge of
// a phone screen (ARCHITECTURE §6).
export const bounceIn = (direction, delay = 0) => {
  // Both variants set both axes. A variant that leaves one out hands that
  // axis back to its `hidden` value if the variant is ever swapped after the
  // entrance: swapping "right" for "up" on a resize left the Experience
  // panel parked at translateX(100px), cut off by its clip.
  if (direction === "up") {
    return {
      hidden: { opacity: 0, x: 0, y: 24 },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: BOUNCE.duration, ease: BOUNCE.ease, delay },
      },
    };
  }

  const sign = direction === "left" ? -1 : 1;
  return {
    hidden: { opacity: 0, x: sign * 100, y: 0 },
    show: {
      opacity: [0, 1, 1],
      x: [sign * 100, sign * -20, 0],
      y: 0,
      transition: { ...BOUNCE, delay },
    },
  };
};
