import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({ index, testimonial, name, image }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.2, 0.6)}
    className='rounded-2xl border border-white/10 bg-black-100 p-8 flex flex-col cursor-default hover:border-peach/50 hover:-translate-y-2 hover:shadow-glow transition-all duration-300'
  >
    <div className='flex items-start justify-between'>
      <span className='font-heading text-peach font-extrabold text-[44px] leading-none'>
        "
      </span>
      <span className='font-mono text-[12px] text-secondary border border-white/10 rounded-full px-3 py-1'>
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>

    <p className='mt-4 text-white-100 text-[16px] leading-7 flex-1'>
      {testimonial}
    </p>

    <div className='mt-7 pt-6 border-t border-white/10 flex items-center gap-3'>
      <img
        src={image}
        alt={`feedback by ${name}`}
        loading='lazy'
        decoding='async'
        className='w-11 h-11 rounded-full object-cover border-2 border-peach/60'
      />
      <div>
        <p className='text-white text-[15px] font-medium'>{name}</p>
        <p className='font-mono text-[12px] text-mint'>verified_client</p>
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className='text-secondary'>{"// "}</span>testimonials
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>What clients say</h2>
      </motion.div>

      <div className='mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Feedbacks, "");
