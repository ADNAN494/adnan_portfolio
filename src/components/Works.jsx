import React, { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", (index % 3) * 0.25, 0.6)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <a
        href={source_code_link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-2xl border border-line bg-surface shadow-card overflow-hidden hover:-translate-y-1 hover:border-ember/40 hover:shadow-lift transition-all duration-300 group h-full"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line bg-surface-muted">
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full bg-line-strong/50"
          />
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full bg-line-strong/50"
          />
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-full bg-line-strong/50"
          />
          <span className="ml-3 min-w-0 font-mono text-[12px] text-ink-muted bg-surface border border-line rounded-md px-2.5 py-0.5 truncate">
            {source_code_link.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
          </span>
        </div>

        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[220px] overflow-hidden bg-surface-muted border-b border-line">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>

        <div className="sm:p-7 p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-ink font-extrabold sm:text-[22px] text-[20px] leading-snug tracking-[-0.025em]">
              {name}
            </h3>
            <span
              aria-hidden="true"
              className="shrink-0 w-9 h-9 rounded-full bg-ember-soft text-ember text-[17px] flex items-center justify-center group-hover:bg-ember group-hover:text-canvas transition-colors"
            >
              ↗
            </span>
          </div>
          <p className="mt-3 text-ink-body text-[15px] leading-[1.65] flex-1">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${name}-${tag.name}`}
                className="text-[13px] font-semibold text-ink-muted bg-surface-muted border border-line rounded-full px-3 py-1"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

const Works = () => {
  const [visibleProjects, setVisibleProjects] = useState(4);

  const loadMoreProjects = () => {
    setVisibleProjects((prevVisible) => prevVisible + 4);
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>projects
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>Selected work</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className={`mt-6 max-w-3xl ${styles.bodyText}`}
        >
          Real products used by real businesses online stores, wellness
          platforms, government systems and international organisations. Every
          card links to the live website, so you can click around and see the
          quality for yourself.
        </motion.p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-7">
        {projects.slice(0, visibleProjects).map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      {visibleProjects < projects.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMoreProjects}
            className="font-heading text-[15px] font-bold bg-surface border border-line-strong text-ink px-8 py-3.5 rounded-full hover:border-ember hover:bg-ember hover:text-canvas transition-colors"
          >
            Load more projects
          </button>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, "project");
