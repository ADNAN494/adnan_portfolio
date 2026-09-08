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
      contentStyle={{
        background: "#101715",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 50px -20px rgba(0, 0, 0, 0.6)",
      }}
      contentArrowStyle={{ borderRight: "7px solid #1d2926" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full cursor-pointer'>
          <a
            href={experience.link}
            target='_blank'
            rel='noopener noreferrer'
            className='flex justify-center items-center w-full h-full'
          >
            <img
              src={experience.icon}
              alt={experience.company_name}
              loading='lazy'
              decoding='async'
              className='w-[60%] h-[60%] object-contain'
            />
          </a>
        </div>

      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold cursor-pointer'
          style={{ margin: 0 }}
        >
          <a
            href={experience.link}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-peach transition-colors'
          >
            {experience.company_name}
          </a>
        </p>
      </div>

      {experience.summary && (
        <p className='mt-3 text-secondary text-[14px] leading-6'>
          {experience.summary}
        </p>
      )}

      {/* tracking-wider was fine for one-line bullets; these run to three or
          four lines, where extra letter-spacing costs more than it adds. */}
      <ul className='mt-5 list-disc ml-5 space-y-3'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] leading-[24px] pl-1'
          >
            {point}
          </li>
        ))}
      </ul>

      {/* Scannable stack per role — same chip treatment as the project cards,
          so a recruiter can read the tech without parsing eight bullets. */}
      {experience.tech && (
        <div className='mt-6 flex flex-wrap gap-2'>
          {experience.tech.map((item) => (
            <span
              key={item}
              className='font-mono text-[12px] text-secondary border border-white/10 rounded-full px-3 py-1'
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
          <span className='text-secondary'>{"// "}</span>experience
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>
          Where I've worked
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
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
