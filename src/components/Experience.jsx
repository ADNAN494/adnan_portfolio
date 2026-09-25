import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      // Inline styles are the library's API, so they take the theme's CSS
      // variables directly rather than Tailwind classes.
      contentStyle={{
        background: "rgb(var(--surface))",
        color: "rgb(var(--ink-body))",
        border: "1px solid rgb(var(--line))",
        borderRadius: "16px",
        boxShadow: "var(--shadow-card)",
      }}
      contentArrowStyle={{ borderRight: "7px solid rgb(var(--line))" }}
      date={experience.date}
      // The library's own ring is `0 0 0 4px #fff`, which vanishes on the light
      // page. A canvas-coloured gap plus a hairline keeps the logo disc
      // separated from the rail. The disc stays white in both themes  the
      // company logos are drawn on white.
      iconStyle={{
        background: experience.iconBg,
        boxShadow: "0 0 0 4px rgb(var(--canvas)), 0 0 0 5px rgb(var(--line))",
      }}
      icon={
        <div className="flex justify-center items-center w-full h-full cursor-pointer">
          <a
            href={experience.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center w-full h-full"
          >
            <img
              src={experience.icon}
              alt={experience.company_name}
              loading="lazy"
              decoding="async"
              className="w-[60%] h-[60%] object-contain"
            />
          </a>
        </div>
      }
    >
      <div>
        <h3 className="font-heading text-ink sm:text-[23px] text-[20px] font-extrabold tracking-[-0.025em] leading-tight">
          {experience.title}
        </h3>
        {/* div, not p: the library styles `.vertical-timeline-element-content p`
            (13px, weight 500, a forced 1em top margin) at a specificity no
            single Tailwind class can beat, so on a <p> the sizes here were
            silently ignored. */}
        <div className="mt-1.5 font-heading text-[16px] font-bold">
          <a
            href={experience.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember hover:text-ember-dark hover:underline underline-offset-4 transition-colors"
          >
            {experience.company_name}
          </a>
        </div>
      </div>

      {experience.summary && (
        <div className="mt-3 text-ink-muted text-[15px] leading-6">
          {experience.summary}
        </div>
      )}

      {/* tracking-wider was fine for one-line bullets; these run to three or
          four lines, where extra letter-spacing costs more than it adds. */}
      <ul className="mt-5 list-disc sm:ml-5 ml-4 space-y-3 marker:text-ember/60">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-ink-body text-[15px] leading-[1.65] pl-1"
          >
            {point}
          </li>
        ))}
      </ul>

      {/* Scannable stack per role  same chip treatment as the project cards,
          so a recruiter can read the tech without parsing eight bullets. */}
      {experience.tech && (
        <div className="mt-6 flex flex-wrap gap-2">
          {experience.tech.map((item) => (
            <span
              key={item}
              className="text-[13px] font-semibold text-ink-muted bg-surface-muted border border-line rounded-full px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>experience
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>Where I've worked</h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
