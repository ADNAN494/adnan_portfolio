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
  sont
} from "../assets";

export const navLinks = [{
    id: "about",
    title: "About Me",
  },
  {
    id: "work",
    title: "My Experience",
  },
  {
    id: "project",
    title: "My Projects",
  },
  {
    id: "contact",
    title: "Contact Me",
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

const experiences = [{
    title: "Mern Stack Developer",
    company_name: "Sysreforms International",
    icon: sys,
    iconBg: "#383E56",
    date: "Feb 2024 - Present",
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
    iconBg: "#383E56",
    date: "Jan 2022 - Jun 2022",
    points: [
      "Designed and developed user-interactive pages using Bootstrap and JavaScript.",
      "Gained hands-on experience on how websites operate within the Google search engine.",
      "Worked on different niche websites such as e-commerce, blogs, education, corporate sites, and real estate.",
      "Complete hands-on knowledge of On-Page SEO (keyword research), Technical SEO (mobile responsiveness), and Off-Page SEO (backlinks).",
    ],
    link: "https://golddetectorprice.pk/"
  },
  {
    title: "Full Stack Developer",
    company_name: "Self",
    icon: free_lan,
    iconBg: "#E6DEDD",
    date: "2023 - Present",
    points: [
      "Develope web applications using Mern Stack technologies",
      "Work with local & international client to design and develope top notch applications.",
      "Implement frontend and backend myself.",
    ],
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

const projects = [{
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
  services,
  technologies,
  experiences,
  testimonials,
  projects
};