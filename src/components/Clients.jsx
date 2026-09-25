import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { clients } from "../constants";

// Replaces the old Feedbacks section. That one rendered three invented quotes
// over randomuser.me stock photos; this one names organisations whose systems
// are actually in production, each with the live link a visitor can open. Same
// job  credibility before the contact form  without asking anyone to take an
// unverifiable quote on trust.
const ClientCard = ({ index, org, full, kind, work, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    variants={fadeIn("up", "spring", index * 0.15, 0.6)}
    className="group rounded-2xl border border-line bg-surface shadow-card sm:p-8 p-6 flex flex-col hover:border-ember/40 hover:-translate-y-2 hover:shadow-lift transition-all duration-300"
  >
    {/* `flex-wrap` is doing real work, not tidying. The kind chip is
        `whitespace-nowrap`  it has to be, or "intergovernmental" breaks across
        two lines inside a pill  and next to an org name set in 28px expanded
        Archivo that gave the row a min-content width no phone under ~380px
        could satisfy. The row could not shrink, so it pushed the whole page
        wider than the screen. Wrapping lets the chip drop under the name
        instead, which is also where it reads better on one column. */}
    <div className="flex items-start justify-between gap-x-4 gap-y-2 flex-wrap">
      <span className="font-heading text-ember font-extrabold sm:text-[30px] text-[26px] leading-none tracking-[-0.03em]">
        {org}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted bg-surface-muted border border-line rounded-full px-3 py-1 whitespace-nowrap">
        {kind}
      </span>
    </div>

    <p className="mt-3 text-[14px] font-bold text-pine leading-5">{full}</p>

    <p className="mt-5 text-ink-body text-[15px] leading-[1.7] flex-1">
      {work}
    </p>

    <span className="mt-7 pt-5 border-t border-line font-mono text-[12px] font-medium text-ink-muted group-hover:text-ember transition-colors">
      {link.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
    </span>
  </motion.a>
);

const Clients = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          <span className="text-ink-muted">{"// "}</span>clients
        </p>
        <h2 className={`${styles.sectionHeadText} mt-2`}>Who I build for</h2>
        <p className={`mt-6 max-w-3xl ${styles.bodyText}`}>
          Intergovernmental bodies, a national regulator and consumer products
          people pay through. Every platform below is live the link on each card
          goes straight to it.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {clients.map((client, index) => (
          <ClientCard key={client.org} index={index} {...client} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Clients, "");
