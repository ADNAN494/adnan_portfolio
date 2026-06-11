import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { stats } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import SocialIcons from "./SocialIcons";

const StatCard = ({ value, label, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className='rounded-2xl border border-white/10 bg-black-100 p-7 hover:border-peach/50 transition-colors'
  >
    <p className='font-heading text-peach font-extrabold sm:text-[40px] text-[32px] leading-none'>
      {value}
    </p>
    <p className='mt-3 text-secondary text-[14px]'>{label}</p>
  </motion.div>
);

const About = () => {
  return (
    <div className='-mt-11'>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className='text-secondary'>{"// "}</span>about
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>
          The person behind the commits
        </h2>
      </motion.div>

      <div className='mt-12 grid lg:grid-cols-2 grid-cols-1 gap-12 items-start'>
        <motion.div variants={fadeIn("", "", 0.1, 1)}>
          <p className='text-secondary text-[17px] leading-[30px]'>
            I'm Adnan Yousaf, a full-stack developer who has spent the last{" "}
            <span className='text-white'>three years</span> helping businesses
            turn ideas into digital products that earn — online stores,
            booking systems, health platforms and government portals used by
            real people every day.
          </p>

          <p className='mt-6 text-secondary text-[17px] leading-[30px]'>
            I handle the full journey: your data lives safely in{" "}
            <span className='text-mint'>MongoDB</span>, secure{" "}
            <span className='text-mint'>Express</span> APIs connect everything
            together, fast <span className='text-mint'>React</span> pages win
            your customers over, and <span className='text-mint'>Node</span>{" "}
            keeps it all running smoothly — payments, logins, live chat and
            all.
          </p>

          <p className='mt-6 text-secondary text-[17px] leading-[30px]'>
            Lately I've been adding <span className='text-peach'>AI</span> to
            the mix — <span className='text-peach'>chatbots</span> that answer
            your customers 24/7, smart automation that saves hours of manual
            work, and AI features built right into your website.
          </p>

          <div className='mt-8'>
            <SocialIcons />
          </div>
        </motion.div>

        <div className='grid grid-cols-2 gap-5'>
          {stats.map((stat, index) => (
            <StatCard key={stat.label} index={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
