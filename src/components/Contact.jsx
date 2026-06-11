import React, { Suspense, lazy, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import LazyShow from "./LazyShow";

const EarthCanvas = lazy(() => import("./canvas/Earth"));
// 
// 
// 
// 7lWL2GUOhoPuvPumyTuPQ
const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        "service_9f24tvg",
        "template_28wreop",
        {
          from_name: form.name,
          to_name: "Adnan Yousaf",
          from_email: form.email,
          to_email: "yousafadnan998@gmail.com",
          message: form.message,
        },
        "U3qABvJ4-H4JbjcKl"
      )
      .then(
        () => {
          setLoading(false);
          setStatus({
            type: "success",
            text: "Message sent — thank you! I'll get back to you as soon as possible.",
          });

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          setStatus({
            type: "error",
            text: "Something went wrong — your message was not sent. Please try again, or reach me on WhatsApp.",
          });
        }
      );
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>
          <span className='text-secondary'>{"// "}</span>contact
        </p>
        <h3 className={`${styles.sectionHeadText} mt-2`}>Get in touch</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              required
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              required
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              required
              placeholder='What you want to say?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='bg-peach py-3 px-10 rounded-full outline-none w-fit text-primary font-semibold hover:bg-peach-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {status && (
            <p
              className={`font-mono text-[14px] leading-6 ${
                status.type === "success" ? "text-mint" : "text-red-400"
              }`}
            >
              {status.type === "success" ? "✓ " : "✗ "}
              {status.text}
            </p>
          )}
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <LazyShow className='w-full h-full'>
          <Suspense fallback={null}>
            <EarthCanvas />
          </Suspense>
        </LazyShow>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
