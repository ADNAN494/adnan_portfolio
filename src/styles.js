const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-20 py-12",

  heroHeadText:
    "font-heading font-extrabold text-ink lg:text-[80px] md:text-[64px] sm:text-[52px] text-[42px] leading-[1.02] tracking-[-0.035em] mt-2",
  heroSubText:
    "text-ink-body lg:text-[19px] sm:text-[18px] text-[16px] leading-[1.7]",

  sectionHeadText:
    "font-heading text-ink font-extrabold md:text-[52px] sm:text-[42px] text-[32px] leading-[1.1] tracking-[-0.03em]",
  sectionSubText:
    "font-mono text-pine font-medium sm:text-[14px] text-[13px] tracking-wide",

  // Small uppercase caption for bands and groups inside a section ("The core
  // stack", "What I build"). Sans, not mono: mono is kept for the section
  // eyebrows above, so the two label levels don't look alike.
  label:
    "text-[12px] font-bold uppercase tracking-[0.12em] text-ink-muted",

  // Running prose. 17px on a 1.75 line keeps a ~70-character measure readable
  // on a light ground; 16px on phones, where the column is already narrow.
  bodyText: "text-ink-body sm:text-[17px] text-[16px] leading-[1.75]",
};

export { styles };
