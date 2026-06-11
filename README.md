# Adnan Yousaf — Developer Portfolio

A terminal/IDE-themed portfolio built with **React + Vite**: dark charcoal design with warm peach + mint accents, monospace section labels, a code-window hero, browser-mockup project cards, and a Three.js Earth in the contact section.

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | React 18, Vite 4 |
| 3D Rendering | Three.js, @react-three/fiber, @react-three/drei (Earth model + star particles) |
| Animation | Framer Motion (scroll reveals, letter-stagger hero), react-simple-typewriter |
| Styling | Tailwind CSS, PostCSS, Autoprefixer |
| Contact Form | EmailJS Browser |
| Timeline | react-vertical-timeline-component |
| Star Particles | maath (random sphere positions) |

Fonts: **Archivo Expanded** (display headings), **Inter** (body), **JetBrains Mono** (labels, tags, code).

---

## Project Structure

```
adnan_portfolio/
├── public/
│   ├── planet/              # 3D GLTF model — rotating Earth (Contact section)
│   └── logo1.png            # Favicon
│
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Root layout — wires all sections together
│   ├── index.css            # Fonts, dot-grid bg, scrollbar, timeline overrides
│   ├── styles.js            # Shared Tailwind class strings (typography)
│   │
│   ├── assets/              # Project screenshots + company logos (only used files)
│   │   ├── company/         # Company logos for experience timeline
│   │   └── index.js         # Asset barrel export
│   │
│   ├── constants/
│   │   └── index.js         # All site data (navLinks, stats, mernSkills, aiSkill,
│   │                        #   paymentsSkill, extraTech, experiences, projects, testimonials)
│   │
│   ├── components/
│   │   ├── Navbar.jsx        # ~/adnan.dev terminal logo + Hire me pill
│   │   ├── Hero.jsx          # Letter-stagger name, rotating typewriter role, code window
│   │   ├── About.jsx         # Business-value bio + 2x2 stats grid + social icons
│   │   ├── Tech.jsx          # MERN letter cards + AI & Payments featured cards + chips
│   │   ├── Experience.jsx    # Vertical timeline of work history
│   │   ├── Works.jsx         # Browser-mockup project cards, load_more() pagination
│   │   ├── Feedbacks.jsx     # Testimonial cards
│   │   ├── Contact.jsx       # EmailJS form + EarthCanvas 3D model
│   │   ├── Loader.jsx        # Suspense fallback while 3D loads
│   │   ├── SocialIcons.jsx   # Facebook / WhatsApp / LinkedIn links
│   │   └── index.js          # Barrel export
│   │
│   ├── components/canvas/    # Lazy-loaded via React.lazy — Three.js is code-split
│   │   ├── Earth.jsx         # Rotating planet GLTF (Contact)
│   │   └── Stars.jsx         # 5,000 mint particles drifting (Contact background)
│   │
│   ├── hoc/
│   │   └── SectionWrapper.jsx  # Framer-motion stagger wrapper + anchor ids
│   │
│   └── utils/
│       └── motion.js          # Motion variant factories (fadeIn, textVariant, ...)
│
├── index.html
├── vite.config.js
├── tailwind.config.cjs      # Palette: primary #0c1110, peach #e8a76f, mint #6ee7b7
└── postcss.config.cjs
```

---

## Three.js Scenes

### `EarthCanvas` — Contact Section ([src/components/canvas/Earth.jsx](src/components/canvas/Earth.jsx))
Rotating 3D planet loaded from `public/planet/scene.gltf` via `useGLTF`, auto-rotating with constrained orbit controls. `frameloop='demand'` re-renders only when needed.

### `StarsCanvas` — Contact Background ([src/components/canvas/Stars.jsx](src/components/canvas/Stars.jsx))
5,000 mint (`#6ee7b7`) particle stars positioned randomly inside a sphere (maath), slowly rotating each frame via `useFrame`.

---

## Getting Started

### Prerequisites
- Node.js >= 16

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build / preview production

```bash
npm run build
npm run preview
```

---

## Editing Content

All portfolio content lives in [src/constants/index.js](src/constants/index.js):
- `navLinks` — navigation items
- `stats` — the About-section numbers (years, projects, clients, uptime)
- `mernSkills`, `aiSkill`, `paymentsSkill`, `extraTech` — skills section
- `experiences` — work timeline
- `projects` — project cards (name, description, tags, image, live link)
- `testimonials` — client quotes

The EmailJS credentials for the contact form are configured in [src/components/Contact.jsx](src/components/Contact.jsx) — no `.env` needed.
