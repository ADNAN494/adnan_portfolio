import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  sys,
  tesla,
  shopify,
  ikonic,
  carrent,
  pvs,
  immi,
  sys1,
  jobit,
  tripguide,
  threejs,
  boostrap,
  mui,
  mssql,
  mysql,
  undp,
  pak_det,
  free_lan,
  drap,
  tech_pedia,
  sont,
  psy,
  wello,
  trueClosure,
  opy
} from "../assets";

export const navLinks = [{
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

const stats = [{
    value: "3+",
    label: "Years experience",
  },
  {
    value: "10+",
    label: "Projects shipped",
  },
  {
    value: "12+",
    label: "Happy clients",
  },
  {
    value: "99.9%",
    label: "Uptime maintained",
  },
];

const mernSkills = [{
    letter: "M",
    name: "MongoDB",
    highlight: false,
    description: "Your business data — customers, orders, content — organised, safe and fast to search, ready to scale as you grow.",
    bullets: ["Mongoose ODM", "Aggregation", "Indexing & perf", "Atlas / Replica sets"],
  },
  {
    letter: "E",
    name: "Express",
    highlight: false,
    description: "The engine room — secure connections between your website, payments, logins and data. Nothing leaks, nothing breaks.",
    bullets: ["JWT / OAuth", "Middleware design", "Validation (Yup/Joi)", "Error handling"],
  },
  {
    letter: "R",
    name: "React",
    highlight: true,
    description: "The part your customers see — fast, polished pages that feel great on every phone, tablet and desktop.",
    bullets: ["Next.js / SSR", "Redux Toolkit", "Framer Motion", "Tailwind CSS"],
  },
  {
    letter: "N",
    name: "Node.js",
    highlight: false,
    description: "Features that feel instant — live chat, notifications, online payments and automation running behind the scenes.",
    bullets: ["Socket.io / PubNub", "Firebase", "Stripe payments", "Docker & CI/CD"],
  },
];

const aiSkill = {
  letter: "AI",
  name: "AI Integration & Chatbots",
  description: "I plug AI into your business: chatbots that answer your customers 24/7 in any language, smart search that understands what people mean, and automation that saves hours of manual work every week.",
  bullets: [
    "Customer support chatbots",
    "WhatsApp & web bots",
    "OpenAI / Claude APIs",
    "Workflow automation",
  ],
};

const paymentsSkill = {
  letter: "$",
  name: "Payments & Online Checkout",
  description: "Get paid online without the headache — secure checkout your customers already trust. I integrate Stripe, Apple Pay and PayPal so money flows in safely, whether it's one-off sales, subscriptions or in-app purchases.",
  bullets: [
    "Stripe checkout",
    "Apple Pay & PayPal",
    "Subscriptions & billing",
    "Secure transactions",
  ],
};

const extraTech = [{
    name: "Next.js",
    highlight: true,
  },
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
    name: "TypeScript",
    highlight: false,
  },
  {
    name: "Bootstrap",
    highlight: false,
  },
  {
    name: "MUI",
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

const services = [{
    title: "Frontend Developer",
    icon: web,
  },
  {
    title: "Backend Developer",
    icon: mobile,
  },
  {
    title: "3rd Party Apis Integration",
    icon: backend,
  },
  {
    title: "Mobile Reponsiveness",
    icon: creator,
  },
];

const technologies = [{
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "Boostrap 5",
    icon: boostrap,
  },
  {
    name: "MUI 5",
    icon: mui,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Mysql",
    icon: mysql,
  },
  {
    name: "git",
    icon: git,
  },
];

const experiences = [
  {
    title: "Frontend Developer",
    company_name: "Optymyze Technologies",
    icon: opy,
    iconBg: "#141b19",
    date: "July 2025 - Present",
    points: [
      "Develop frontend web applications by converting Figma designs into Next.js and React projects using Bootstrap and Tailwind CSS.",
      "Improve workflow efficiency by integrating Figma MCP Server with Claude AI agents in VS Code.",
      "Design pixel-perfect, mobile-responsive web applications optimized for Android and iOS, ensuring cross-browser compatibility across Firefox, Safari, and other major browsers.",
      "Develop real-time chat functionality using Firebase and PubNub, enabling instant messaging, live updates, image sharing, and emoji support.",
      "Implement authentication (Google, Apple, phone number) using Firebase, and integrate payment gateways (Apple Pay, PayPal) through Stripe.",
      "Collaborate with backend developers to integrate REST APIs using Next.js SSR, CSR, ISR, and RTK Query."
    ],
    link: "https://optymyzetech.com/",
  },
  
  {
    title: "Mern Stack Developer",
    company_name: "Sysreforms International",
    icon: sys,
    iconBg: "#141b19",
    date: "Nov 2023 - June 2025",
    points: [
      "Design responsive UIs using Material UI, Tailwind CSS, and Bootstrap 5, ensuring cross-browser compatibility.",
      "Developed and optimized high-performance web applications using Next.js and React.js, leveraging SSR, SSG, hooks, code splitting, lazy loading, and React virtualization.",
      "Develop RESTful APIs using Node.js and Express.js; integrated data flows in the frontend with Axios, Redux, and Formik/Yup for schema-based form validation.",
      "Implemented Git-based version control workflows (feature branching, pull requests, code reviews) using GitHub, enabling smooth team collaboration.",
    ],
    link: "https://www.sysreforms.com/",

  },
  {
    title: "WEB Designer & SEO",
    company_name: "Pakistan Detector Technologies",
    icon: pak_det,
    iconBg: "#141b19",
    date: "Jan 2022 - Jun 2022",
    points: [
      "Designed and developed user-interactive pages using Bootstrap and JavaScript.",
      "Gained hands-on experience on how websites operate within the Google search engine.",
      "Worked on different niche websites such as e-commerce, blogs, education, corporate sites, and real estate.",
      "Complete hands-on knowledge of On-Page SEO (keyword research), Technical SEO (mobile responsiveness), and Off-Page SEO (backlinks).",
    ],
    link: "https://golddetectorprice.pk/"
  },


];

const testimonials = [{
    testimonial: "I thought it was impossible to make a website as beautiful as our product, but Adnan proved me wrong.",
    name: "Sara Lee",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial: "I've never met a web developer who truly cares about their clients' success like Adnan does.",
    name: "Chris Brown",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial: "After Adnan optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Psychic Txt",
    description: "PsychicTxt is an online platform offering live psychic chat and text-based readings, connecting clients with professional psychics for real-time guidance on relationships, personal growth, and future insights.",

    tags: [{
        name: "next",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
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
    name: "Wello Move",
    description: "Wello is a wellness platform that connects users with health experts and resources to improve their overall well-being. It offers personalized wellness plans, expert consultations, and community support.",

    tags: [{
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
    description: "Sont is a web-based tool platform for the WOAH organization to manage animal diseases and their complete history across the world.",

    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
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
    description: "A UK-based digital solutions company where I designed and developed all web pages using Next.js and Bootstrap. Focused on building responsive and seamless user experience.",

    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
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
    name: "MDMC (DRAP Project)",
    description: "A project for DRAP to streamline medical drug management.Handled end-to-end frontend development including UI/UX design, API integration, and website optimization.",

    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
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
    source_code_link: "https://drap.sysreformsint.com/login",
  },

  {
    name: "PVSIS",
    description: "It is a project of the World Health Organization about their missions to other countries related to the sustainable improvement of national Veterinary and Aquatic Animal Health Services.",
    tags: [{
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
    description: "TrueClosure is a modern platform designed to offer meaningful closure and emotional support for individuals navigating loss and healing. With an intuitive interface, it provides users access to guided resource...",

    tags: [{
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
    name: "Immigra Conslutant",
    description: "This web application provides student advisory services for education abroad in countries like Canada, the USA, France, and various locations in Europe.",
    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "redux",
        color: "green-text-gradient",
      },
      {
        name: "boostrap",
        color: "pink-text-gradient",
      },
    ],
    image: immi,
    source_code_link: "https://www.immigraconsultants.com/",
  },

  {
    name: "Sysreform's International",
    description: "Sysrefrom is a leading software company that provides a comprehensive suite of IT and software services worldwide. Our offerings include custom software development, mobile app development, web development and managed IT services.",
    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
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
    description: "It is a United Nations project focusing on home energy efficiency. By empowering homeowners with energy-efficient solutions, the project aims to construct residences that harmonize with the environment while maximizing energy savings. It comprises three modules: CMS, LMS, and Energy Module.",
    tags: [{
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "boostrap",
        color: "green-text-gradient",
      },
      {
        name: "redux",
        color: "pink-text-gradient",
      },
    ],
    image: undp,
    source_code_link: "https://drcundp.sysreformsint.com/",
  },
];

export {
  stats,
  mernSkills,
  aiSkill,
  paymentsSkill,
  extraTech,
  services,
  technologies,
  experiences,
  testimonials,
  projects
};