import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { mernSkills, aiSkill, paymentsSkill, extraTech } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const SkillCard = ({ letter, name, description, bullets, highlight, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className={`group rounded-2xl border p-7 bg-black-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${
      highlight
        ? "border-mint/60 hover:border-mint"
        : "border-white/10 hover:border-peach/60"
    }`}
  >
    <span
      className={`font-heading font-extrabold text-[64px] leading-none transition-colors duration-300 ${
        highlight ? "text-peach" : "text-white/10 group-hover:text-peach/50"
      }`}
    >
      {letter}
    </span>
    <h3 className='font-heading text-white font-bold text-[24px] mt-8'>
      {name}
    </h3>
    <p className='mt-3 text-secondary text-[14px] leading-6'>{description}</p>
    <ul className='mt-5 space-y-2'>
      {bullets.map((bullet) => (
        <li key={bullet} className='font-mono text-[13px] text-secondary'>
          <span className='text-mint'>▸</span> {bullet}
        </li>
      ))}
    </ul>
  </motion.div>
);

const FeatureCard = ({ skill, accent, index }) => {
  const isMint = accent === "mint";

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.3 + index * 0.2, 0.7)}
      className={`group rounded-2xl border bg-black-100 p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
        isMint
          ? "border-mint/50 hover:border-mint hover:shadow-glow-mint"
          : "border-peach/50 hover:border-peach hover:shadow-glow"
      }`}
    >
      <span
        className={`absolute top-6 right-7 font-mono text-[12px] rounded-full px-3 py-1 border ${
          isMint ? "text-mint border-mint/50" : "text-peach border-peach/50"
        }`}
      >
        featured
      </span>

      <span
        className={`font-heading font-extrabold sm:text-[72px] text-[52px] leading-none ${
          isMint ? "text-mint" : "text-peach"
        }`}
      >
        {skill.letter}
      </span>

      <h3 className='font-heading text-white font-bold sm:text-[24px] text-[20px] mt-6'>
        {skill.name}
      </h3>
      <p className='mt-3 text-secondary text-[15px] leading-7'>
        {skill.description}
      </p>

      <ul className='mt-5 grid sm:grid-cols-2 grid-cols-1 gap-2'>
        {skill.bullets.map((bullet) => (
          <li key={bullet} className='font-mono text-[13px] text-secondary'>
            <span className={isMint ? "text-mint" : "text-peach"}>▸</span>{" "}
            {bullet}
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
          <span className='text-secondary'>{"// "}</span>skills
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>
          Tech that grows your business
        </h2>
      </motion.div>

      <div className='mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {mernSkills.map((skill, index) => (
          <SkillCard key={skill.name} index={index} {...skill} />
        ))}
      </div>

      <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <FeatureCard skill={aiSkill} accent='mint' index={0} />
        <FeatureCard skill={paymentsSkill} accent='peach' index={1} />
      </div>

      <motion.div
        variants={fadeIn("", "", 0.3, 1)}
        className='mt-10 flex flex-wrap items-center gap-2'
      >
        <span className='font-mono text-[13px] text-secondary mr-2'>
          also working with:
        </span>
        {extraTech.map((tech) => (
          <span
            key={tech.name}
            className={`font-mono text-[13px] rounded-full px-4 py-1.5 cursor-pointer transition-colors ${
              tech.highlight
                ? "text-mint border border-mint/50 hover:bg-mint/10"
                : "text-secondary border border-white/10 hover:text-peach hover:border-peach/50"
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
