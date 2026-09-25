import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { stats, services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import SocialIcons from "./SocialIcons";

const StatCard = ({ value, label, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className="rounded-2xl border border-line bg-surface shadow-card sm:p-7 p-5 hover:border-ember/40 hover:shadow-lift transition-all duration-300"
  >
    <p className="font-heading text-ember font-extrabold sm:text-[44px] text-[34px] leading-none tracking-[-0.03em]">
      {value}
    </p>
    <p className="mt-3 text-ink-muted text-[14px] font-semibold leading-5">
      {label}
    </p>
  </motion.div>
);

const About = () => {
  return (
    <div className="-mt-11">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>about
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>
          What I actually build
        </h2>
      </motion.div>

      <div className="mt-12 grid lg:grid-cols-2 grid-cols-1 gap-12 items-start">
        <motion.div variants={fadeIn("", "", 0.1, 1)}>
          <p className={styles.bodyText}>
            I'm Adnan Yousaf, a full-stack developer. For{" "}
            <span className="text-ink font-semibold">three years</span> I've
            built the kind of web applications a business actually runs on
            online stores that take payments reliably, dashboards that turn
            messy data into decisions, signup flows that convert, and internal
            systems that hundreds of people use to do their jobs every day.
          </p>

          <p className={`mt-6 ${styles.bodyText}`}>
            Some of that has been work where mistakes are expensive:
            disease-tracking for the{" "}
            <span className="text-pine font-semibold">
              World Organisation for Animal Health
            </span>
            , veterinary reporting for the{" "}
            <span className="text-pine font-semibold">WHO</span>, a
            drug-management platform for{" "}
            <span className="text-pine font-semibold">
              Pakistan's medicines regulator
            </span>{" "}
            and a <span className="text-pine font-semibold">UN</span>{" "}
            energy-efficiency programme alongside consumer products handling
            live chat and real payments every day. Different worlds, one
            requirement: it has to be fast, it has to be right, and it has to
            keep working as the data grows.
          </p>

          <p className={`mt-6 ${styles.bodyText}`}>
            Most of the job is untangling complexity taking a requirement that
            isn't fully defined yet, working out what it really means, and
            building a structure that absorbs the next{" "}
            <span className="text-ink font-semibold">ten changes</span> instead
            of breaking under them. That's the difference between a site that
            looks finished and a product you can keep building on.
          </p>

          <p className={`mt-6 ${styles.bodyText}`}>
            Lately that means{" "}
            <span className="text-ember font-semibold">AI</span> in two
            directions. In the product:{" "}
            <span className="text-ember font-semibold">chatbots</span> that
            answer customers around the clock, assistants that actually know
            your documents and policies, and automation that removes hours of
            manual work a week.
          </p>

          {/* Phones only  from md up the links sit on the fixed left rail. */}
          <div className="mt-8 md:hidden">
            <SocialIcons />
          </div>
        </motion.div>

        <div>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} index={index} {...stat} />
            ))}
          </div>

          {/* Answers "can you build X?" at a glance, for the visitor who
              won't read the prose. */}
          <motion.div
            variants={fadeIn("up", "spring", 0.4, 0.7)}
            className="mt-5 rounded-2xl border border-line bg-surface shadow-card sm:p-7 p-6"
          >
            <p className={styles.label}>What I build</p>
            <ul className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-2.5">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-ink-body text-[15px] font-medium leading-6 flex gap-2.5"
                >
                  <span aria-hidden="true" className="text-pine shrink-0">
                    ▸
                  </span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Continues the essay from the left column. The text column runs far
              taller than four cards, so the last two paragraphs live here 
              otherwise the right half is ~600px of dead space on lg. On mobile
              the grid collapses to one column and the original order returns. */}
          <motion.div variants={fadeIn("", "", 0.3, 1)}>
            <p className={`mt-6 lg:mt-8 ${styles.bodyText}`}>
              And in how I work I run{" "}
              <span className="text-ember font-semibold">AI coding agents</span>{" "}
              wired directly into my editor and design tools, so the repetitive
              half of a build goes faster and more of my time goes to
              architecture, edge cases and the decisions that actually need
              judgement. It means you get the speed without the sloppiness:{" "}
              <span className="text-ink font-semibold">
                nothing ships that I haven't read, tested and understood
              </span>
              .
            </p>

            <p className={`mt-6 ${styles.bodyText}`}>
              Underneath all of it, the same standard it loads fast, it stays
              responsive as it fills with data, it works as well on a
              three-year-old phone as on a desktop, and the next developer can
              pick it up without starting over.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
