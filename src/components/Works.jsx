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
        className="block rounded-2xl border border-white/10 bg-black-100 overflow-hidden hover:border-peach/60 hover:shadow-glow transition-all duration-300 group h-full"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="ml-3 font-mono text-[12px] text-secondary truncate">
            {source_code_link.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
          </span>
        </div>

        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[220px] overflow-hidden bg-black-200">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-white font-bold text-[22px]">
              {name}
            </h3>
            <span className="text-peach text-[20px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
              ↗
            </span>
          </div>
          <p className="mt-3 text-secondary text-[14px] leading-6">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${name}-${tag.name}`}
                className="font-mono text-[12px] text-secondary border border-white/10 rounded-full px-3 py-1"
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
          <span className="text-secondary">{"// "}</span>projects
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>Selected work</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Real products used by real businesses — online stores, wellness
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
            className="font-mono text-[14px] border border-peach text-peach px-8 py-3 rounded-full hover:bg-peach hover:text-primary transition-colors"
          >
            load_more()
          </button>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, "project");
