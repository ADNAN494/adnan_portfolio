import { motion } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";

import { styles } from "../styles";

const letterContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 14, stiffness: 200 },
  },
};

const AnimatedWord = ({ word, className = "" }) => (
  <span className={className}>
    {word.split("").map((char, i) => (
      <motion.span key={i} variants={letterVariant} className='inline-block'>
        {char}
      </motion.span>
    ))}
  </span>
);

const CodeWindow = () => (
  <div className='rounded-2xl border border-white/10 bg-black-100 shadow-card overflow-hidden w-full'>
    <div className='flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]'>
      <span className='w-3 h-3 rounded-full bg-[#ff5f57]' />
      <span className='w-3 h-3 rounded-full bg-[#febc2e]' />
      <span className='w-3 h-3 rounded-full bg-[#28c840]' />
      <span className='ml-3 font-mono text-[13px] text-secondary'>
        db.developers.findOne()
      </span>
    </div>
    <pre className='p-6 font-mono sm:text-[15px] text-[12px] leading-7 overflow-x-auto text-secondary'>
      <code>
        {`{\n`}
        {`  `}<span className='text-white-100'>"_id"</span>{`: `}<span className='text-peach'>"dev_adnan"</span>{`,\n`}
        {`  `}<span className='text-white-100'>"role"</span>{`: `}<span className='text-peach'>"Full Stack Developer"</span>{`,\n`}
        {`  `}<span className='text-white-100'>"experience"</span>{`: `}<span className='text-peach'>"3+ years"</span>{`,\n`}
        {`  `}<span className='text-white-100'>"stack"</span>{`: [`}<span className='text-peach'>"Mongo"</span>{`, `}<span className='text-peach'>"Express"</span>{`, `}<span className='text-peach'>"React"</span>{`, `}<span className='text-peach'>"Node"</span>{`],\n`}
        {`  `}<span className='text-white-100'>"ai_chatbots"</span>{`: `}<span className='text-mint'>true</span>{`,\n`}
        {`  `}<span className='text-white-100'>"open_to_work"</span>{`: `}<span className='text-mint'>true</span>{`,\n`}
        {`  `}<span className='text-white-100'>"coffee_consumed"</span>{`: `}<span className='text-[#a78bfa]'>Infinity</span>{`\n`}
        {`}`}
      </code>
    </pre>
  </div>
);

const Hero = () => {
  const [text] = useTypewriter({
    words: [
      "Full Stack Developer",
      "AI Chatbot Builder",
      "E-commerce Expert",
      "Your Digital Partner",
    ],
    loop: {},
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1800,
  });

  return (
    <section className='relative w-full min-h-screen mx-auto flex items-center'>
      <div
        className={`max-w-7xl mx-auto ${styles.paddingX} w-full flex lg:flex-row flex-col items-center lg:gap-16 gap-12 pt-32 pb-20`}
      >
        <div className='flex-1'>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='font-mono text-mint sm:text-[16px] text-[13px] tracking-wide'
          >
            <span className='text-secondary'>{"// "}</span>
            {text}
            <Cursor cursorColor='#e8a76f' />
          </motion.p>

          <motion.h1
            variants={letterContainer}
            initial='hidden'
            animate='show'
            className={`${styles.heroHeadText} mt-6`}
          >
            <AnimatedWord word='Adnan' />
            <br />
            <AnimatedWord word='Yousaf.' className='text-peach' />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={`${styles.heroSubText} mt-8 max-w-xl`}
          >
            I help businesses grow online — fast websites, online stores,
            dashboards and AI chatbots that turn visitors into customers.
            Built with modern tech (MERN stack), designed for real people.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className='mt-10 flex flex-wrap gap-4'
          >
            <a
              href='#project'
              className='bg-peach text-primary font-semibold py-3.5 px-8 rounded-full hover:bg-peach-dark transition-colors'
            >
              View my work
            </a>
            <a
              href='#contact'
              className='border border-white/20 text-white font-medium py-3.5 px-8 rounded-full hover:border-peach hover:text-peach transition-colors'
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className='flex-1 w-full max-w-[560px]'
        >
          <CodeWindow />
        </motion.div>
      </div>

      <a
        href='#about'
        className='absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-secondary text-[14px] hover:text-peach transition-colors'
      >
        scroll ↓
      </a>
    </section>
  );
};

export default Hero;
