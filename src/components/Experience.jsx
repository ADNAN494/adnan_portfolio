import React, { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { bounceIn, fadeIn, popIn, textVariant } from "../utils/motion";
import useMediaQuery from "../utils/useMediaQuery";
import useReducedMotion from "../utils/useReducedMotion";

// A role switcher rather than a timeline. Three roles at eight bullets each ran
// the old two-column timeline to ~4,000px on desktop and ~5,700px on a phone,
// most of it half-empty. Now the roles sit in a tab list and one panel shows
// the selected role, so the section is about a screen tall.
//
// Every panel is rendered, stacked in one grid cell, with only the active one
// visible, so switching roles is a crossfade in place. The cell is sized to
// the active panel (not the tallest, which left a short role floating in a
// quarter of empty card) and eases to the new height on a switch.
//
// The entrance is the old timeline's, reproduced in utils/motion.js: logos pop
// (cd-bounce-1), the roles slide in from the left and the panel from the right
// with the same 20px overshoot (cd-bounce-2 / -inverse), and on phones the
// panel rises instead (cd-bounce-2-up).

// Bullets shown before "Show all". The full list stays in constants  this only
// decides how much a visitor reads before asking for more.
const VISIBLE_POINTS = 4;

// "July 2025 - Present" → "2025 – Now"; "Jan 2022 - Jun 2022" → "2022".
const yearSpan = (date) => {
  const [from, to = from] = date.split(" - ");
  const year = (part) =>
    /present/i.test(part) ? "Now" : part.match(/\d{4}/)?.[0];
  const [start, end] = [year(from), year(to)];
  return start === end ? start : `${start} – ${end}`;
};

const tabId = (index) => `experience-tab-${index}`;
const panelId = (index) => `experience-panel-${index}`;

const RoleTab = ({
  experience,
  index,
  active,
  onSelect,
  tabRef,
  enterFromSide,
}) => (
  <motion.button
    ref={tabRef}
    type="button"
    role="tab"
    id={tabId(index)}
    aria-selected={active}
    aria-controls={panelId(index)}
    tabIndex={active ? 0 : -1}
    onClick={() => onSelect(index)}
    variants={
      enterFromSide
        ? bounceIn("left", 0.2 + index * 0.15)
        : fadeIn("", "tween", 0.2 + index * 0.1, 0.4)
    }
    className={`group relative flex lg:flex-row flex-col items-center lg:gap-4 gap-2 lg:px-5 px-2 lg:py-4 pt-2 pb-4 lg:text-left text-center rounded-t-xl lg:rounded-t-none lg:rounded-r-xl transition-colors duration-200 ${
      active ? "" : "lg:hover:bg-surface-muted/70"
    }`}
  >
    {/* One indicator, handed between tabs by layoutId so it slides rather
        than blinking across: an ember bar with the social rail's glow, over
        the rail line, and a wash fading off it. Bottom edge on phones, left
        edge from lg. */}
    {active && (
      <motion.span
        layoutId="experience-active"
        transition={{ type: "spring", stiffness: 420, damping: 36 }}
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] bg-gradient-to-t lg:bg-gradient-to-r from-ember/10 to-transparent"
      >
        <span className="absolute bottom-0 inset-x-0 h-[2px] lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[2px] rounded-full bg-ember box-glow-ember" />
      </motion.span>
    )}

    {/* The disc stays white in both themes  the logos are drawn on white. */}
    <motion.span
      variants={popIn(0.2 + index * 0.15)}
      className={`relative shrink-0 grid place-items-center lg:w-12 lg:h-12 w-11 h-11 rounded-xl border shadow-card transition-colors duration-200 ${
        active ? "border-ember/50" : "border-line"
      }`}
      style={{ background: experience.iconBg }}
    >
      <img
        src={experience.icon}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-[62%] h-[62%] object-contain"
      />
    </motion.span>

    <span className="relative min-w-0">
      {/* Phones have room for the logo and the years only; the company name
          stays for screen readers, so every tab keeps its accessible name.
          The role title needs the width of the lg column. */}
      <span
        className={`sr-only sm:not-sr-only sm:block font-heading sm:text-[14px] lg:text-[15px] font-bold leading-snug transition-colors duration-200 ${
          active ? "text-ink" : "text-ink-muted group-hover:text-ink"
        }`}
      >
        {experience.company_name}
      </span>
      <span className="hidden lg:block mt-0.5 text-[13px] leading-snug text-ink-muted">
        {experience.title}
      </span>
      <span
        className={`block sm:mt-1.5 text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-200 ${
          active ? "text-ember" : "text-ink-muted"
        }`}
      >
        {yearSpan(experience.date)}
      </span>
    </span>
  </motion.button>
);

const Point = ({ children }) => (
  <li className="flex gap-3 text-ink-body text-[15px] leading-[1.65]">
    <span aria-hidden="true" className="text-pine shrink-0">
      ▸
    </span>
    <span>{children}</span>
  </li>
);

const RolePanel = ({
  experience,
  index,
  active,
  expanded,
  onToggle,
  panelRef,
}) => {
  const extra = experience.points.slice(VISIBLE_POINTS);
  const moreId = `${panelId(index)}-more`;

  return (
    <div
      ref={panelRef}
      role="tabpanel"
      id={panelId(index)}
      aria-labelledby={tabId(index)}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      // visibility, not display, so the outgoing panel can fade while the
      // incoming one fades in over it; hidden, it also leaves the tab order
      // and the a11y tree. self-start keeps each at its own height to measure.
      className={`col-start-1 row-start-1 self-start relative flex flex-col sm:p-8 p-5 transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transform-none ${
        active
          ? "visible opacity-100 translate-y-0"
          : "invisible opacity-0 translate-y-2"
      }`}
    >
      {/* Faint start year, the same ghosted-letter device as the skill cards.
          Not on phones, where the title runs underneath it. */}
      <span
        aria-hidden="true"
        className="hidden sm:block pointer-events-none select-none absolute top-5 right-8 font-heading font-extrabold text-[96px] leading-none tracking-[-0.05em] text-ink/[.05]"
      >
        {experience.date.match(/\d{4}/)?.[0]}
      </span>

      <p className={`relative ${styles.label}`}>
        {experience.date.replace(" - ", " – ")}
      </p>
      <h3 className="relative mt-2 font-heading text-ink sm:text-[26px] text-[21px] font-extrabold tracking-[-0.025em] leading-tight">
        {experience.title}
      </h3>
      <a
        href={experience.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-1.5 self-start font-heading text-[16px] font-bold text-ember hover:text-ember-dark hover:underline underline-offset-4 transition-colors"
      >
        {experience.company_name} <span aria-hidden="true">↗</span>
      </a>

      {experience.summary && (
        <p className="relative mt-4 max-w-[62ch] text-ink-muted text-[15px] leading-6">
          {experience.summary}
        </p>
      )}

      <ul className="relative mt-6 space-y-3">
        {experience.points.slice(0, VISIBLE_POINTS).map((point) => (
          <Point key={point}>{point}</Point>
        ))}
      </ul>

      {extra.length > 0 && (
        <>
          <div id={moreId}>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="pt-3 space-y-3">
                    {extra.map((point) => (
                      <Point key={point}>{point}</Point>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={moreId}
            className="relative mt-5 self-start inline-flex items-center gap-1.5 text-[14px] font-bold text-ember hover:text-ember-dark transition-colors"
          >
            {expanded
              ? "Show fewer"
              : `Show all ${experience.points.length} highlights`}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={`w-4 h-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            >
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {experience.tech && (
        <div className="relative pt-7">
          <div className="flex flex-wrap gap-2 border-t border-line pt-5">
            {experience.tech.map((item) => (
              <span
                key={item}
                className="text-[13px] font-semibold text-ink-muted bg-surface-muted border border-line rounded-full px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Experience = () => {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabs = useRef([]);
  const panels = useRef([]);
  const stack = useRef(null);
  const easing = useRef(0);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Which way the entrance travels is decided once, at mount. Tracking the
  // live breakpoint swapped the variants whenever the window crossed 1024px
  // (DevTools device mode does exactly that), and framer-motion re-applied
  // the new set after the entrance had played, leaving the panel offset.
  const [enterFromSide] = useState(isDesktop);

  // "Show all" belongs to the role it was opened on, so a switch collapses it.
  const select = (index) => {
    if (index === active) return;
    // Ease only a role switch. Resizes and the "Show all" reveal set the
    // height every frame, and a transition there would trail behind the
    // content and clip it. Cleared on a timer, not transitionend, which never
    // fires when two roles happen to be the same height.
    const box = stack.current;
    if (box && !reduced) {
      box.style.transition = "height 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      clearTimeout(easing.current);
      easing.current = setTimeout(() => (box.style.transition = ""), 450);
    }
    setActive(index);
    setExpanded(false);
  };

  // WAI-ARIA tabs: arrows move and select (either axis, since the list turns
  // from a row into a column at lg), Home/End jump to the ends.
  const onKeyDown = (event) => {
    const count = experiences.length;
    const target = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (target === undefined) return;

    event.preventDefault();
    const index = (target + count) % count;
    select(index);
    tabs.current[index]?.focus();
  };

  // Fit the stack to the active panel, and keep fitting it as that panel
  // changes size (the "Show all" reveal, a resize, a font swapping in). Set on
  // the element directly rather than through state, so the new height lands
  // in the same frame as the layout that caused it.
  useLayoutEffect(() => {
    const box = stack.current;
    const panel = panels.current[active];
    if (!box || !panel) return;

    const fit = () => {
      box.style.height = `${panel.offsetHeight}px`;
    };
    fit();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [active]);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>experience
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>Where I've worked</h2>
      </motion.div>

      {/* Clipped sideways here, not only at the root: the panel enters from
          100px right of where it lands (ARCHITECTURE §6). The -mx/px pair
          keeps the card's shadow and the indicator's glow inside the clip. */}
      <div className="mt-12 sm:mt-16 -mx-6 px-6 overflow-x-clip grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 gap-6 items-start">
        <div
          role="tablist"
          aria-label="Roles"
          aria-orientation={isDesktop ? "vertical" : "horizontal"}
          onKeyDown={onKeyDown}
          className="relative grid grid-flow-col auto-cols-fr lg:flex lg:flex-col lg:gap-1 lg:sticky lg:top-28"
        >
          {/* The rail the indicator rides on. */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-[2px] lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[2px] rounded-full bg-line"
          />
          {experiences.map((experience, index) => (
            <RoleTab
              key={experience.company_name}
              experience={experience}
              index={index}
              active={index === active}
              onSelect={select}
              tabRef={(el) => (tabs.current[index] = el)}
              enterFromSide={enterFromSide}
            />
          ))}
        </div>

        <motion.div
          variants={bounceIn(enterFromSide ? "right" : "up", 0.35)}
          className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
        >
          {/* A lit top edge in ember  the glow motif, kept to a hairline. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent"
          />
          <div ref={stack} className="grid overflow-hidden">
            {experiences.map((experience, index) => (
              <RolePanel
                key={experience.company_name}
                experience={experience}
                index={index}
                active={index === active}
                expanded={index === active && expanded}
                onToggle={() => setExpanded((open) => !open)}
                panelRef={(el) => (panels.current[index] = el)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
