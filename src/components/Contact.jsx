import React, { Suspense, lazy, useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import LazyShow from "./LazyShow";

const EarthCanvas = lazy(() => import("./canvas/Earth"));

// Where the form delivers, and the address the fallback link opens.
const CONTACT_EMAIL = "yousafadnan998@gmail.com";

// EmailJS identifiers, env-first. The public key is public by design  it ships
// in the bundle whatever we do  so this isn't about hiding it. It's so that
// rotating a key, or pointing the form at a test template, is a config change
// instead of a code edit. `.env` is gitignored; see `.env.example` for the
// variable names. The literals are the current production values, kept as
// defaults so a checkout with no `.env` still has a working form.
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_9f24tvg";
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_28wreop";
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "U3qABvJ4-H4JbjcKl";

if (
  import.meta.env.DEV &&
  !import.meta.env.VITE_EMAILJS_SERVICE_ID &&
  !import.meta.env.VITE_EMAILJS_TEMPLATE_ID
) {
  console.warn(
    "[Contact] VITE_EMAILJS_* not set  falling back to the built-in production IDs. Copy .env.example to .env to point the form somewhere else.",
  );
}

// Pre-fills the visitor's own mail client with everything they just typed, so a
// failed send costs them a click rather than the whole message.
const mailtoHref = ({ name, email, message }) => {
  const subject = `Portfolio enquiry${name ? ` from ${name}` : ""}`;
  const body = [message, "", ` ${name}`, email].filter(Boolean).join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
};

// Shared by all three fields. The border is `line.strong` (3.2:1 or better) so
// the field reads as a field, not as a gap in the card. 16px text keeps iOS
// Safari from zooming the page when a field takes focus. Focus draws its own
// ring here, so the global :focus-visible outline is switched off for inputs.
const fieldClass =
  "w-full bg-surface border border-line-strong rounded-xl py-3.5 px-4 text-ink text-[16px] placeholder:text-ink-muted/80 transition-shadow focus:outline-none focus:border-ember focus:ring-4 focus:ring-ember/20";

const labelClass = "font-heading text-ink text-[15px] font-semibold mb-2.5";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const { default: emailjs } = await import("@emailjs/browser");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Adnan Yousaf",
          from_email: form.email,
          to_email: CONTACT_EMAIL,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setLoading(false);
      setStatus({
        type: "success",
        text: "Message sent  thank you! I'll get back to you as soon as possible.",
      });

      // Only clear on an actual send. See the catch below.
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setLoading(false);
      console.error(error);

      // This used to report success and clear the form, which meant a visitor
      // whose message never left the browser was told it had arrived  and the
      // text they'd written was gone with it. Keep every field exactly as typed
      // so they can retry or hand it to their own mail client.
      setStatus({
        type: "error",
        text: "That didn't send  something went wrong on the way out.",
      });
    }
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-surface border border-line shadow-lift sm:p-10 p-6 rounded-3xl"
      >
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>contact
        </p>
        <h3 className={`${styles.sectionHeadText} mt-2`}>Get in touch</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-6"
        >
          <label className="flex flex-col">
            <span className={labelClass}>Your name</span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col">
            <span className={labelClass}>Your email</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col">
            <span className={labelClass}>Your message</span>
            <textarea
              rows={7}
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="What you want to say?"
              className={fieldClass}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="font-heading bg-ember py-3.5 px-10 rounded-full w-fit text-canvas text-[15px] font-bold shadow-[0_8px_20px_-8px_rgba(176,74,20,0.6)] hover:bg-ember-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {status && (
            <div role="status" aria-live="polite">
              <p
                className={`text-[15px] font-semibold leading-6 ${
                  status.type === "success" ? "text-pine" : "text-red-700"
                }`}
              >
                {status.type === "success" ? "✓ " : "✗ "}
                {status.text}
              </p>

              {status.type === "error" && (
                <p className="text-[15px] leading-6 text-ink-muted mt-2">
                  Your message is still in the form press Send to try again, or{" "}
                  <a
                    href={mailtoHref(form)}
                    className="text-ember underline underline-offset-4 hover:text-ember-dark transition-colors"
                  >
                    email it to me directly
                  </a>
                  .
                </p>
              )}
            </div>
          )}
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <LazyShow className="w-full h-full">
          <Suspense fallback={null}>
            <EarthCanvas />
          </Suspense>
        </LazyShow>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
