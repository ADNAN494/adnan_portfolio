import { motion } from "framer-motion";

import { socials } from "../constants";
import { SocialGlyph } from "./SocialIcons";

// The left-edge social rail: a vertical caption, the icons, and a hairline
// running down to the bottom of the screen  the pattern Brittany Chiang's v4
// portfolio made the convention for developer sites. It mirrors the theme
// switch on the right edge.
//
// Entrance, once the hero has finished its own intro: the hairline draws up
// from the bottom edge, the icons rise out of it one by one  bottom first,
// sharpening from a blur as they arrive  and the caption lands last. That
// order comes from `staggerDirection: -1` over the DOM order (caption, icons,
// line), so the sequence reads upward along the line.
//
// Under "reduce motion", <MotionConfig reducedMotion="user"> drops the y and
// scaleY travel; the fade and un-blur remain.
const rail = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.9,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const rise = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const draw = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const SocialRail = () => (
  // md and up only; phones get the inline row in About (SocialIcons.jsx).
  // left-4 keeps the 40px column inside the 64px section gutter at every
  // width up to where the centred content starts to pull away from the edge.
  <motion.nav
    aria-label="Social links"
    variants={rail}
    initial="hidden"
    animate="show"
    className="hidden md:flex fixed bottom-0 left-4 min-[1400px]:left-8 z-20 w-10 flex-col items-center gap-2"
  >
    <motion.p
      variants={rise}
      aria-hidden="true"
      className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-ink-muted [writing-mode:vertical-rl]"
    >
      {/* Rotated on an inner span: framer-motion owns the outer transform. */}
      <span className="inline-block rotate-180">Find me on</span>
    </motion.p>

    {socials.map((social) => (
      // The motion wrapper carries the entrance; the hover lift is CSS on the
      // link inside it. On one element they'd fight  framer-motion writes
      // `transform` inline, which beats the hover class.
      <motion.div key={social.id} variants={rise}>
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="group relative w-10 h-10 flex items-center justify-center rounded-lg text-ink-muted transition-all duration-200 hover:-translate-y-1 hover:text-ember focus-visible:text-ember"
        >
          <SocialGlyph id={social.id} size={26} />

          {/* Name, sliding out to the right on hover or keyboard focus. */}
          <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-full bg-ink text-canvas text-[12px] font-bold px-3 py-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
            {social.name}
          </span>
        </a>
      </motion.div>
    ))}

    <motion.span
      variants={draw}
      aria-hidden="true"
      className="mt-3 block w-px h-24 origin-bottom bg-ink-muted/40"
    />
  </motion.nav>
);

export default SocialRail;
