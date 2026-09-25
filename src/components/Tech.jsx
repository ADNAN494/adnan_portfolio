import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import {
  mernSkills,
  frontendSkills,
  aiSkill,
  paymentsSkill,
  extraTech,
} from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// None of these cards link anywhere, so none of them take a pointer cursor
// the hover lift is a response, not an invitation to click.
const SkillCard = ({
  letter,
  name,
  description,
  bullets,
  highlight,
  index,
}) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className={`group rounded-2xl border sm:p-7 p-6 bg-surface shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift ${
      highlight
        ? "border-ember/50 ring-1 ring-ember/20"
        : "border-line hover:border-ember/40"
    }`}
  >
    <span
      aria-hidden="true"
      className={`font-heading font-extrabold text-[64px] leading-none tracking-[-0.04em] transition-colors duration-300 ${
        highlight ? "text-ember" : "text-ink/10 group-hover:text-ember/60"
      }`}
    >
      {letter}
    </span>
    <h3 className="font-heading text-ink font-extrabold text-[22px] tracking-[-0.025em] mt-7">
      {name}
    </h3>
    <p className="mt-2.5 text-ink-body text-[15px] leading-[1.65]">
      {description}
    </p>
    <ul className="mt-5 space-y-2">
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="text-[14px] font-medium leading-5 text-ink-muted flex gap-2"
        >
          <span aria-hidden="true" className="text-pine shrink-0">
            ▸
          </span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// Compact sibling of SkillCard for the frontend row. Five across at lg (vs the
// MERN row's four), so the letter mark, padding and copy all step down a size
// at max-w-7xl each card is ~210px wide and a 64px letter would swamp it.
const StackCard = ({ letter, name, description, bullets, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.12, 0.6)}
    className="group rounded-2xl border border-line p-6 bg-surface shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-ember/40 hover:shadow-lift"
  >
    <span
      aria-hidden="true"
      className="font-heading font-extrabold text-[40px] leading-none tracking-[-0.04em] text-ink/10 group-hover:text-ember/60 transition-colors duration-300"
    >
      {letter}
    </span>
    <h3 className="font-heading text-ink font-extrabold text-[18px] tracking-[-0.02em] mt-5">
      {name}
    </h3>
    <p className="mt-2 text-ink-body text-[14px] leading-6">{description}</p>
    <ul className="mt-4 space-y-1.5">
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="text-[13px] font-medium leading-5 text-ink-muted flex gap-1.5"
        >
          <span aria-hidden="true" className="text-pine shrink-0">
            ▸
          </span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// Small monospace caption that names each band of cards, matching the
// "also working with:" label already used above the chips.
const RowLabel = ({ children }) => (
  <motion.p variants={fadeIn("", "", 0.1, 0.8)} className={styles.label}>
    {children}
  </motion.p>
);

const FeatureCard = ({ skill, accent, index }) => {
  const isPine = accent === "pine";

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.3 + index * 0.2, 0.7)}
      className={`group rounded-2xl border sm:p-8 p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift relative overflow-hidden bg-gradient-to-br to-surface ${
        isPine
          ? "from-pine-soft border-pine/30 hover:border-pine/60"
          : "from-ember-soft border-ember/30 hover:border-ember/60"
      }`}
    >
      <span
        className={`absolute sm:top-6 top-5 sm:right-7 right-5 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full px-3 py-1 border bg-surface ${
          isPine ? "text-pine border-pine/30" : "text-ember border-ember/30"
        }`}
      >
        featured
      </span>

      <span
        aria-hidden="true"
        className={`font-heading font-extrabold sm:text-[72px] text-[52px] leading-none tracking-[-0.04em] ${
          isPine ? "text-pine" : "text-ember"
        }`}
      >
        {skill.letter}
      </span>

      <h3 className="font-heading text-ink font-extrabold sm:text-[24px] text-[20px] tracking-[-0.025em] mt-6">
        {skill.name}
      </h3>
      <p className="mt-3 text-ink-body text-[16px] leading-[1.7]">
        {skill.description}
      </p>

      <ul className="mt-5 grid sm:grid-cols-2 grid-cols-1 gap-2">
        {skill.bullets.map((bullet) => (
          <li
            key={bullet}
            className="text-[14px] font-medium leading-5 text-ink-muted flex gap-2"
          >
            <span
              aria-hidden="true"
              className={`shrink-0 ${isPine ? "text-pine" : "text-ember"}`}
            >
              ▸
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>skills
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>
          Tech that grows your business
        </h2>
      </motion.div>

      <div className="mt-14">
        <RowLabel>The core stack</RowLabel>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mernSkills.map((skill, index) => (
            <SkillCard key={skill.name} index={index} {...skill} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <RowLabel>Frontend toolkit</RowLabel>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {frontendSkills.map((skill, index) => (
            <StackCard key={skill.name} index={index} {...skill} />
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureCard skill={aiSkill} accent="pine" index={0} />
        <FeatureCard skill={paymentsSkill} accent="ember" index={1} />
      </div>

      <motion.div
        variants={fadeIn("", "", 0.3, 1)}
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        <span className={`${styles.label} mr-2`}>Also working with</span>
        {extraTech.map((tech) => (
          <span
            key={tech.name}
            className={`text-[14px] font-semibold rounded-full px-4 py-1.5 border transition-colors ${
              tech.highlight
                ? "text-pine bg-pine-soft border-pine/25"
                : "text-ink-body bg-surface border-line hover:border-ember/40 hover:text-ember"
            }`}
          >
            {tech.name}
          </span>
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
