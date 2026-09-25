import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";

import { styles } from "../styles";
import useReducedMotion from "../utils/useReducedMotion";

const StarsCanvas = lazy(() => import("./canvas/Stars"));

const letterContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 14, stiffness: 200 },
  },
};

const AnimatedWord = ({ word, className = "" }) => (
  <span className={className}>
    {word.split("").map((char, i) => (
      <motion.span key={i} variants={letterVariant} className="inline-block">
        {char}
      </motion.span>
    ))}
  </span>
);

// The role line cycles forever, which is exactly the motion a visitor with
// "reduce motion" set has asked not to see. Isolating the typewriter in its own
// component means the hook is not even called when it is switched off  no
// timers left running behind a static string. ROLES[0] renders instead, and it
// matches the static shell in index.html so nothing swaps on mount.
const ROLES = [
  "Full Stack Developer",
  "AI Chatbot Builder",
  "E-commerce Expert",
  "Your Digital Partner",
];

const TypedRole = () => {
  const [text] = useTypewriter({
    words: ROLES,
    loop: {},
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1800,
  });

  return (
    <>
      {text}
      <Cursor cursorColor="rgb(var(--ember))" />
    </>
  );
};

// The one dark surface on the page, on purpose: an editor window reads as an
// editor window, and it gives the light hero a single strong focal point. It
// keeps the old dark palette (`code.*` in tailwind.config.cjs), where the peach
// and mint that were too pale for text on the light ground still read clearly.
const CodeWindow = () => (
  <div className="rounded-2xl border border-ink/10 bg-code-bg shadow-float overflow-hidden w-full">
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-code-bar">
      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      <span className="ml-3 font-mono text-[13px] text-code-text">
        db.developers.findOne()
      </span>
    </div>
    <pre className="sm:p-6 p-4 font-mono sm:text-[15px] text-[12px] leading-7 overflow-x-auto text-code-text">
      <code>
        {`{\n`}
        {`  `}
        <span className="text-code-key">"_id"</span>
        {`: `}
        <span className="text-code-string">"dev_adnan"</span>
        {`,\n`}
        {`  `}
        <span className="text-code-key">"role"</span>
        {`: `}
        <span className="text-code-string">"Full Stack Developer"</span>
        {`,\n`}
        {`  `}
        <span className="text-code-key">"experience"</span>
        {`: `}
        <span className="text-code-string">"3+ years"</span>
        {`,\n`}
        {`  `}
        <span className="text-code-key">"stack"</span>
        {`: [`}
        <span className="text-code-string">"Mongo"</span>
        {`, `}
        <span className="text-code-string">"Express"</span>
        {`, `}
        <span className="text-code-string">"React"</span>
        {`, `}
        <span className="text-code-string">"Node"</span>
        {`],\n`}
        {`  `}
        <span className="text-code-key">"ai_chatbots"</span>
        {`: `}
        <span className="text-code-bool">true</span>
        {`,\n`}
        {`  `}
        <span className="text-code-key">"open_to_work"</span>
        {`: `}
        <span className="text-code-bool">true</span>
        {`,\n`}
        {`  `}
        <span className="text-code-key">"coffee_consumed"</span>
        {`: `}
        <span className="text-code-num">Infinity</span>
        {`\n`}
        {`}`}
      </code>
    </pre>
  </div>
);

const Hero = () => {
  const reduced = useReducedMotion();

  // Defer loading the Three.js starfield until the browser is idle so it
  // never blocks the hero's first paint (LCP). It fades in a moment later.
  const [showStars, setShowStars] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback;
    if (ric) {
      // timeout guarantees it fires even if the main thread never goes idle.
      const id = ric(() => setShowStars(true), { timeout: 600 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = setTimeout(() => setShowStars(true), 200);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate w-full min-h-screen mx-auto flex items-center">
      {showStars && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </motion.div>
      )}

      <div
        className={`relative z-10 max-w-7xl mx-auto ${styles.paddingX} w-full flex lg:flex-row flex-col items-center lg:gap-16 gap-12 pt-32 pb-20`}
      >
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 shadow-card pl-3 pr-4 py-1.5 font-mono font-medium text-pine sm:text-[14px] text-[13px]"
          >
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-pine" />
            {/* Sized for the longest role plus the cursor, so the pill holds
                its width while the typewriter deletes and retypes. */}
            <span className="inline-block min-w-[23ch]">
              <span className="text-ink-muted">{"// "}</span>
              {reduced ? ROLES[0] : <TypedRole />}
            </span>
          </motion.p>

          <motion.h1
            variants={letterContainer}
            initial="hidden"
            animate="show"
            className={`${styles.heroHeadText} mt-6`}
          >
            <AnimatedWord word="Adnan" />
            <br />
            <AnimatedWord word="Yousaf." className="text-ember" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0.01, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className={`${styles.heroSubText} mt-8 max-w-xl`}
          >
            {/* Duplicated verbatim in index.html's static shell  keep the two
                in sync or the copy visibly swaps when React mounts. */}
            Every project starts with two questions: what does the business
            need, and what do its users actually want? Then I build it
            high-performance e-commerce, real-time dashboards, enterprise-grade
            platforms and AI-powered features using AI in my own workflow to
            move faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#project"
              className="font-heading bg-ember text-canvas text-[15px] font-bold py-3.5 sm:px-8 px-6 rounded-full shadow-[0_8px_20px_-8px_rgba(176,74,20,0.6)] hover:bg-ember-dark transition-colors"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="font-heading bg-surface border border-line-strong text-ink text-[15px] font-bold py-3.5 sm:px-8 px-6 rounded-full hover:border-ink transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="flex-1 w-full max-w-[560px]"
        >
          <CodeWindow />
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono text-ink-muted text-[14px] hover:text-ember transition-colors"
      >
        scroll ↓
      </a>
    </section>
  );
};

export default Hero;
