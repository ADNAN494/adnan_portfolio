import {
  sys,
  pvs,
  immi,
  sys1,
  undp,
  pak_det,
  drap,
  tech_pedia,
  sont,
  psy,
  wello,
  trueClosure,
  psyTry,
  psychicVision,
  resetHypnosis,
  miVidente,
  opy,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "project",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

// Keep these honest — every one of them is checkable against the page itself or
// a two-minute search, and a visitor who catches one wrong discounts the rest.
// `Projects shipped` must match the length of `projects` below.
const stats = [
  {
    value: "3+",
    label: "Years experience",
  },
  {
    value: "14",
    label: "Projects shipped",
  },
  {
    value: "4",
    label: "Gov & UN platforms",
  },
  {
    value: "12+",
    label: "Clients served",
  },
];

// Plain-language answer to "can you build X?" — rendered next to the About
// stats. Deliberately outcome-shaped, not tool-shaped: the stack lives in the
// Skills section, this is for a visitor deciding whether to get in touch.
const services = [
  "Custom web apps & dashboards",
  "E-commerce & online payments",
  "AI chatbots & assistants",
  "API & third-party integrations",
  "Complex frontend architecture",
  "Performance & speed optimisation",
];

const mernSkills = [
  {
    letter: "M",
    name: "MongoDB",
    highlight: false,
    description:
      "Your business data — customers, orders, content — organised, safe and fast to search, ready to scale as you grow.",
    bullets: [
      "Mongoose ODM",
      "Aggregation",
      "Indexing & perf",
      "Atlas / Replica sets",
    ],
  },
  {
    letter: "E",
    name: "Express",
    highlight: false,
    description:
      "The engine room — secure connections between your website, payments, logins and data. Nothing leaks, nothing breaks.",
    bullets: [
      "JWT / OAuth",
      "Middleware design",
      "Validation (Yup/Joi)",
      "Error handling",
    ],
  },
  {
    letter: "R",
    name: "React",
    highlight: true,
    description:
      "The part your customers see — fast, polished pages that feel great on every phone, tablet and desktop.",
    bullets: [
      "Next.js / SSR",
      "Redux Toolkit",
      "Framer Motion",
      "Tailwind CSS",
    ],
  },
  {
    letter: "N",
    name: "Node.js",
    highlight: false,
    description:
      "Features that feel instant — live chat, notifications, online payments and automation running behind the scenes.",
    bullets: [
      "Socket.io / PubNub",
      "Firebase",
      "Stripe payments",
      "Docker & CI/CD",
    ],
  },
];

// The frontend toolkit. Deliberately NOT part of mernSkills: those four letters
// spell MERN and the grid is built around exactly four cards. These render as a
// second, more compact row (see Tech.jsx › StackCard). Anything promoted to a
// card here must come OUT of extraTech below, or it shows up twice.
const frontendSkills = [
  {
    letter: "N",
    name: "Next.js",
    description:
      "Pages that arrive already rendered — quick to load and easy for Google to read, which is what gets you found.",
    bullets: ["App & Pages Router", "SSR / SSG / ISR", "SEO & metadata"],
  },
  {
    letter: "JS",
    name: "JavaScript",
    description:
      "The language everything here runs on. Modern, clean and written so the next developer can pick it up.",
    bullets: ["ES2023+", "Async & APIs", "Performance tuning"],
  },
  {
    letter: "TS",
    name: "TypeScript",
    description:
      "Catches whole classes of bug before your visitors ever see them, and keeps a growing codebase safe to change.",
    bullets: ["Typed API contracts", "Generics & utilities", "Safe refactors"],
  },
  {
    letter: "TW",
    name: "Tailwind CSS",
    description:
      "One consistent design system across every page, so the site looks deliberate on any screen size.",
    bullets: ["Design tokens", "Responsive layouts", "Dark UI systems"],
  },
  {
    letter: "MUI",
    name: "Material UI",
    description:
      "Battle-tested, accessible components — the fastest route to a polished admin panel or dashboard.",
    bullets: ["Theming", "Data grids & tables", "Accessible forms"],
  },
];

const aiSkill = {
  letter: "AI",
  name: "AI Integration & Chatbots",
  description:
    "I plug AI into your business: chatbots that answer your customers 24/7 in any language, assistants that actually know your products and policies, search that understands what people mean rather than what they typed, and automation that saves hours of manual work every week.",
  bullets: [
    "Customer support chatbots",
    "WhatsApp & web bots",
    "OpenAI / Claude APIs",
    "Answers from your own docs",
    "Smart search & recommendations",
    "Lead capture & qualification",
    "Summaries & content drafting",
    "Workflow automation",
  ],
};

const paymentsSkill = {
  letter: "$",
  name: "Payments & Online Checkout",
  description:
    "Get paid online without the headache — secure checkout your customers already trust. I integrate Stripe, Apple Pay and PayPal so money flows in safely, whether it's one-off sales, subscriptions or in-app purchases.",
  bullets: [
    "Stripe checkout",
    "Apple Pay & PayPal",
    "Subscriptions & billing",
    "Webhooks & refunds",
    "Multi-currency",
    "Secure transactions",
  ],
};

const extraTech = [
  {
    name: "Stripe",
    highlight: true,
  },
  {
    name: "Apple Pay",
    highlight: true,
  },
  {
    name: "PayPal",
    highlight: true,
  },
  {
    name: "AI Chatbots",
    highlight: true,
  },
  {
    name: "OpenAI API",
    highlight: true,
  },
  {
    name: "Claude API",
    highlight: true,
  },
  {
    name: "Bootstrap",
    highlight: false,
  },
  {
    name: "MySQL",
    highlight: false,
  },
  {
    name: "MSSQL",
    highlight: false,
  },
  {
    name: "Firebase",
    highlight: false,
  },
  {
    name: "Git & GitHub",
    highlight: false,
  },
  {
    name: "Figma",
    highlight: false,
  },
];

const experiences = [
  {
    title: "Frontend Developer",
    company_name: "Optymyze Technologies",
    icon: opy,
    iconBg: "#141b19",
    date: "July 2025 - Present",
    summary:
      "Consumer platforms built on Next.js — live advisor chat, wallet payments and multi-step acquisition funnels across four brands.",
    points: [
      "Build the frontend for live psychic chat products (Psychic Txt, Psychic Vision, Mi Vidente) in Next.js — advisor discovery, real-time conversations, credit balances and checkout — choosing SSR, ISR or client rendering per route depending on whether the content is shared, personalised, or changes by the second.",
      "Own the real-time layer over PubNub and Firebase: instant messaging, live advisor availability, image sharing and emoji, with connection state and optimistic updates handled so a flaky mobile network doesn't drop a paid conversation.",
      "Integrate Stripe end to end — Apple Pay and PayPal wallets, one-off credit purchases and recurring subscriptions — reconciling client state against webhook-driven server state so a balance is never stale after a refresh.",
      "Implement multi-provider authentication on Firebase (Google, Apple and phone/OTP), including the routing and guard logic that decides what an anonymous, half-onboarded or paying user is allowed to reach.",
      "Design acquisition funnels (try.psychictxt.com, quiz.resethypnosis.com) as data-driven step machines — branching questions, progress state and validation defined as configuration — so marketing can reorder or add steps without a component rewrite.",
      "Maintain a shared component layer of typed, reusable primitives on Tailwind design tokens, reused across sibling brands so each stays visually distinct without forking the codebase.",
      "Wire the Figma MCP server to Claude agents in VS Code to generate first-pass component scaffolds straight from design files, then refactor them to the project's conventions — cutting the mechanical part of design-to-code without shipping generated code unreviewed.",
      "Ship for real mobile traffic: responsive to 320px, cross-browser fixes for Safari's stricter handling of dates, scrolling and payment sheets, verified on iOS and Android rather than in a desktop emulator.",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "RTK Query", "Firebase", "PubNub", "Stripe", "Node.js"],
    link: "https://optymyzetech.com/",
  },

  {
    title: "MERN Stack Developer",
    company_name: "Sysreforms International",
    icon: sys,
    iconBg: "#141b19",
    date: "Nov 2023 - June 2025",
    summary:
      "Enterprise and public-sector systems for the World Organisation for Animal Health, WHO, UNDP and Pakistan's drug regulator (DRAP).",
    points: [
      "Built data-heavy operational systems for international bodies — WOAH's animal-disease tracking (Sont), WHO/WOAH veterinary mission reporting (PVSIS) and DRAP's drug-management platform — where one screen can carry multi-step forms, approval workflows and thousands of records.",
      "Architected the frontend around schema-driven components: form, table and filter primitives configured by data instead of copied per screen, so adding a module to a system with dozens of near-identical CRUD views became a config change rather than a new component tree.",
      "Kept those screens responsive under real data volumes with code splitting, lazy loading, memoisation and list virtualisation, so render cost stayed flat as record counts grew instead of degrading with the dataset.",
      "Modelled application state deliberately — Redux for what genuinely crosses modules (permissions, lookups, in-progress submissions), local state for the rest — with Formik and Yup schemas keeping validation rules in one place and matched to the API contract.",
      "Wrote the Node and Express REST APIs behind several of these modules against MSSQL, so I owned both sides of the contract and could shape endpoints and payloads around how the UI actually consumes them, rather than reshaping data in the browser.",
      "Built to the role-based access rules these systems require: what a user may view, edit or approve differs by role, enforced consistently across routing, component rendering and API calls.",
      "Delivered the UNDP home energy-efficiency platform across three distinct modules (CMS, LMS and an energy calculator), plus the public-facing Techypedia and Immigra Consultants sites.",
      "Worked the team's Git flow day to day — feature branches, pull requests and review — on a codebase several developers touched at once.",
    ],
    tech: ["React", "Redux", "Node.js", "Express", "MSSQL", "Material UI", "Bootstrap", "Formik / Yup"],
    link: "https://www.sysreforms.com/",
  },
  {
    title: "Web Designer & SEO",
    company_name: "Pakistan Detector Technologies",
    icon: pak_det,
    iconBg: "#141b19",
    date: "Jan 2022 - Jun 2022",
    summary:
      "First professional role — building and ranking client sites across e-commerce, education, real estate and corporate niches.",
    points: [
      "Built and shipped responsive marketing and e-commerce sites in JavaScript and Bootstrap for clients across several niches, from product catalogues to lead-capture and content sites.",
      "Owned technical SEO on those builds — semantic markup, crawlable structure, mobile responsiveness and page-speed work — which meant treating HTML structure and load time as build requirements, not post-launch cleanup.",
      "Ran on-page work end to end (keyword research, metadata, internal linking and content structure) and measured it in Google Search Console, iterating on what actually moved positions rather than what was supposed to.",
      "This is where performance and markup stopped being an afterthought for me: I still pick rendering strategy, image formats and component structure with crawlability and load time in mind.",
    ],
    tech: ["JavaScript", "Bootstrap", "HTML / CSS", "Technical SEO", "Search Console"],
    link: "https://golddetectorprice.pk/",
  },
];

// Replaces the old `testimonials` array, which put invented names (Sara Lee,
// Chris Brown, Lisa Wang) over randomuser.me stock photos. Anyone who has seen
// randomuser.me recognises those faces, and one card read as fake discounts
// every other claim on the page — the exact opposite of what a testimonial
// section is for.
//
// These are organisations whose systems I actually worked on. Every row is
// checkable: against the Experience timeline above, the Projects grid below,
// and the live link on the card itself. No quotes are attributed to anyone who
// did not say them, and no faces are borrowed. If real client quotes arrive
// later, they belong here as a separate array — not as a replacement for this
// one, which stands on its own.
const clients = [
  {
    org: "WOAH",
    full: "World Organisation for Animal Health",
    kind: "intergovernmental",
    work: "Sont — animal-disease tracking and case history across member countries. Screens carrying multi-step forms, approval workflows and thousands of records at a time.",
    link: "https://sont-uat.woah.org/",
  },
  {
    org: "WHO",
    full: "World Health Organization",
    kind: "intergovernmental",
    work: "PVSIS — reporting for veterinary and aquatic animal health missions, built with WOAH to support national services improvement programmes.",
    link: "https://pvs-preprod.woah.org/",
  },
  {
    org: "UNDP",
    full: "United Nations Development Programme",
    kind: "united nations",
    work: "Home energy-efficiency platform across three modules — a CMS, an LMS and an energy calculator — for homeowners planning efficient builds.",
    link: "https://www.undp.org/",
  },
  {
    org: "DRAP",
    full: "Drug Regulatory Authority of Pakistan",
    kind: "national regulator",
    work: "MDMC — the drug-management platform, where I owned frontend end to end: interface, API integration and page-speed work on a regulator-facing system.",
    link: "https://e.dra.gov.pk/login",
  },
  {
    org: "Psychic Txt",
    full: "Live advisor platform, four brands",
    kind: "consumer product",
    work: "Next.js frontends for live chat and reading products — advisor discovery, real-time conversations, credit balances and Stripe checkout across Psychic Txt, Psychic Vision and Mi Vidente.",
    link: "https://www.psychictxt.com/",
  },
  {
    org: "Techypedia",
    full: "UK digital solutions company",
    kind: "agency client",
    work: "Full marketing site in Next.js and Bootstrap — every page designed and built for a responsive, fast experience on a lead-generating site.",
    link: "https://techypedia.co.uk/",
  },
];


const projects = [
  {
    name: "Psychic Txt",
    description:
      "PsychicTxt is an online platform offering live psychic chat and text-based readings, connecting clients with professional psychics for real-time guidance on relationships, personal growth, and future insights.",

    tags: [
      {
        name: "next",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: psy,
    source_code_link: "https://www.psychictxt.com/",
  },
  {
    name: "MDMC (DRAP Project)",
    description:
      "A project for DRAP to streamline medical drug management.Handled end-to-end frontend development including UI/UX design, API integration, and website optimization.",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: drap,
    source_code_link: "https://e.dra.gov.pk/login",
  },
  {
    name: "Psychic Txt — Advisor Match Funnel",
    description:
      "A guided onboarding funnel for PsychicTxt that matches visitors to the right advisor. Step-by-step topic intake with a live progress bar, a real-time advisor rail showing ratings and online status, and a hand-off straight into live chat or a scheduled session.",

    tags: [
      {
        name: "next",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: psyTry,
    source_code_link: "https://try.psychictxt.com/",
  },
  {
    name: "Psychic Vision",
    description:
      "Marketing and acquisition site for a live psychic reading app, built to turn visitors into paying users. Advisor discovery, live chat and video reading flows, a credit-purchase checkout and app-store download funnels, all in a fully responsive layout.",

    tags: [
      {
        name: "next",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "stripe",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: psychicVision,
    source_code_link: "https://www.psychicvisionapp.com/",
  },
  {
    name: "Mi Vidente",
    description:
      "Spanish-language platform connecting users with verified tarot readers, astrologers and psychics. I built the marketing site and mobile-app landing experience — expert profiles, testimonials, a blog, an expert sign-up flow and App Store / Google Play conversion paths.",

    tags: [
      {
        name: "next",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "stripe",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: miVidente,
    source_code_link: "https://mividenteapp.com/",
  },
  {
    name: "Reset Hypnosis",
    description:
      "A quit-vaping quiz funnel for a guided hypnosis programme. Visitors answer a short branching questionnaire that profiles their craving triggers and builds a personalised plan, ending in a tailored programme recommendation and sign-up.",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mysql",
        color: "blue-text-gradient",
      },
    ],
    image: resetHypnosis,
    source_code_link: "https://quiz.resethypnosis.com/welcome",
  },
  {
    name: "Wello Move",
    description:
      "Wello is a wellness platform that connects users with health experts and resources to improve their overall well-being. It offers personalized wellness plans, expert consultations, and community support.",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "mysql",
        color: "blue-text-gradient",
      },
    ],
    image: wello,
    source_code_link: "https://quiz.joinwello.com/landing",
  },
  {
    name: "Sont (WOAH)",
    description:
      "Sont is a web-based tool platform for the WOAH organization to manage animal diseases and their complete history across the world.",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: sont,
    source_code_link: "https://sont-uat.woah.org/",
  },
  {
    name: "Techypedia",
    description:
      "A UK-based digital solutions company where I designed and developed all web pages using Next.js and Bootstrap. Focused on building responsive and seamless user experience.",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: tech_pedia,
    source_code_link: "https://techypedia.co.uk/",
  },
  {
    name: "PVSIS",
    description:
      "It is a project of the World Health Organization about their missions to other countries related to the sustainable improvement of national Veterinary and Aquatic Animal Health Services.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "mssql",
        color: "blue-text-gradient",
      },
    ],
    image: pvs,
    source_code_link: "https://pvs-preprod.woah.org/",
  },
  {
    name: "True Closure",
    description:
      "TrueClosure is a modern platform designed to offer meaningful closure and emotional support for individuals navigating loss and healing. With an intuitive interface, it provides users access to guided resource...",

    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind css",
        color: "pink-text-gradient",
      },
      {
        name: "php",
        color: "green-text-gradient",
      },

      {
        name: "mysql",
        color: "blue-text-gradient",
      },
    ],
    image: trueClosure,
    source_code_link: "https://join.trueclosureapp.com/landing",
  },
  {
    name: "Sysreforms International",
    description:
      "Sysreforms is a leading software company that provides a comprehensive suite of IT and software services worldwide. Our offerings include custom software development, mobile app development, web development and managed IT services.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "green-text-gradient",
      },
      {
        name: "redux",
        color: "pink-text-gradient",
      },
    ],
    image: sys1,
    source_code_link: "https://www.sysreforms.com/",
  },
  {
    name: "UNDP",
    description:
      "It is a United Nations project focusing on home energy efficiency. By empowering homeowners with energy-efficient solutions, the project aims to construct residences that harmonize with the environment while maximizing energy savings. It comprises three modules: CMS, LMS, and Energy Module.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootstrap",
        color: "green-text-gradient",
      },
      {
        name: "redux",
        color: "pink-text-gradient",
      },
    ],
    image: undp,
    source_code_link: "https://www.undp.org/",
  },
  {
    name: "Immigra Consultants",
    description:
      "This web application provides student advisory services for education abroad in countries like Canada, the USA, France, and various locations in Europe.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "redux",
        color: "green-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
    ],
    image: immi,
    source_code_link: "https://www.immigraconsultants.com/",
  },
];

export {
  stats,
  services,
  mernSkills,
  frontendSkills,
  aiSkill,
  paymentsSkill,
  extraTech,
  experiences,
  clients,
  projects,
};
