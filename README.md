# Adnan Yousaf — 3D Portfolio

A visually immersive personal portfolio built with **React + Vite**, featuring interactive **Three.js** 3D models, smooth **Framer Motion** animations, and a fully responsive layout powered by **Tailwind CSS**.

---

## Live Preview

> Run locally with `npm run dev` — see setup below.

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | React 18, Vite 4 |
| 3D Rendering | Three.js, @react-three/fiber, @react-three/drei |
| Animation | Framer Motion |
| Styling | Tailwind CSS, PostCSS, Autoprefixer |
| Routing | React Router DOM v6 |
| Contact Form | EmailJS Browser |
| UI Effects | react-tilt, react-simple-typewriter |
| Timeline | react-vertical-timeline-component |
| Star Particles | maath (random sphere positions) |

---

## Project Structure

```
adnan_portfolio/
├── public/
│   ├── desktop_pc/          # 3D GLTF model — animated desktop PC (Hero section)
│   │   ├── scene.gltf
│   │   ├── scene.bin
│   │   └── textures/        # 40+ PBR texture maps for the PC model
│   ├── planet/              # 3D GLTF model — rotating Earth (Contact section)
│   │   ├── scene.gltf
│   │   ├── scene.bin
│   │   └── textures/
│   ├── adnan-fr.pdf         # Downloadable CV/resume
│   └── logo.svg / logo1.png
│
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Root layout — wires all sections together
│   ├── index.css            # Global styles + Tailwind directives
│   ├── styles.js            # Shared Tailwind class strings (responsive typography)
│   │
│   ├── assets/              # Static images (project screenshots, tech icons, company logos)
│   │   ├── tech/            # Technology icon PNGs (React, Node, MongoDB, etc.)
│   │   ├── company/         # Company logo images (Sysreforms, Optymyze, IKONIC, etc.)
│   │   └── index.js         # Central asset barrel export
│   │
│   ├── constants/
│   │   └── index.js         # All site data (navLinks, services, technologies, experiences, projects, testimonials)
│   │
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky nav — transparent → solid on scroll, mobile hamburger menu
│   │   ├── Hero.jsx          # Full-screen hero — typewriter heading + ComputersCanvas 3D model
│   │   ├── About.jsx         # Overview bio + tilt service cards + social icons + CV download
│   │   ├── Experience.jsx    # Vertical timeline of work history (Optymyze → Sysreforms → Pakistan Detector)
│   │   ├── Tech.jsx          # Technology stack — 3D floating balls on desktop, icon grid on mobile
│   │   ├── Works.jsx         # Project cards grid with "Load More" pagination (10 projects total)
│   │   ├── Feedbacks.jsx     # Testimonial cards
│   │   ├── Contact.jsx       # EmailJS contact form + EarthCanvas 3D model
│   │   ├── Loader.jsx        # Suspense fallback shown while 3D models load
│   │   ├── SocialIcons.jsx   # LinkedIn / GitHub / other social links
│   │   ├── Checkout.jsx      # CV / resume download button
│   │   └── index.js          # Barrel export for all components
│   │
│   ├── components/canvas/   # All Three.js / React Three Fiber scenes
│   │   ├── Computers.jsx     # Hero 3D scene — desktop PC GLTF with orbit controls & auto-rotate
│   │   ├── Earth.jsx         # Contact 3D scene — rotating planet GLTF
│   │   ├── Ball.jsx          # Tech section — icosahedron ball with tech icon decal, floating animation
│   │   ├── Stars.jsx         # Background particle field — 5 000 pink points rotating in 3D
│   │   └── index.js          # Barrel export (ComputersCanvas, EarthCanvas, BallCanvas, StarsCanvas)
│   │
│   ├── hoc/
│   │   ├── SectionWrapper.jsx  # HOC that wraps every section in a framer-motion stagger container
│   │   └── index.js
│   │
│   └── utils/
│       └── motion.js          # Framer Motion variant factories (textVariant, fadeIn, zoomIn, slideIn, staggerContainer)
│
├── index.html               # Vite HTML entry
├── vite.config.js           # Vite config — React plugin
├── tailwind.config.cjs      # Tailwind config
├── postcss.config.cjs       # PostCSS config
└── package.json
```

---

## Three.js Models Explained

### 1. `ComputersCanvas` — Hero Section

File: [src/components/canvas/Computers.jsx](src/components/canvas/Computers.jsx)

Renders a **detailed 3D desktop PC** loaded from `public/desktop_pc/scene.gltf`.

- Uses `useGLTF` (Drei) to load the GLTF model at runtime.
- `OrbitControls` with `autoRotate` lets the camera spin around the model hands-free.
- Responsive: detects `(max-width: 500px)` via `matchMedia` — adjusts scale, position, DPR, and disables antialiasing on mobile for performance.
- `hemisphereLight` + `spotLight` + `pointLight` illuminate the model realistically.
- Hidden entirely on screens narrower than 640px; replaced with a static tech illustration.
- WebGL availability is checked before mounting — alerts the user if unsupported.

```
Camera: position [20, 3, 5], fov 25
Model scale: 0.75 desktop / 0.7 mobile
Auto-rotate speed: 2.0
```

### 2. `EarthCanvas` — Contact Section

File: [src/components/canvas/Earth.jsx](src/components/canvas/Earth.jsx)

Renders a **rotating 3D planet** from `public/planet/scene.gltf`.

- Simple setup: `useGLTF` + `primitive` + `OrbitControls` with `autoRotate`.
- Scale 2.5, constrained polar angle so the planet stays "upright".
- `frameloop='demand'` — only re-renders when something changes (performance optimization).

```
Camera: fov 45, near 0.1, far 200, position [-4, 3, 6]
Auto-rotate speed: 1.0
```

### 3. `BallCanvas` — Tech Section

File: [src/components/canvas/Ball.jsx](src/components/canvas/Ball.jsx)

Renders a **floating icosahedron ball** with a tech-icon texture decal for each technology.

- `useTexture` loads the icon image as a texture.
- `<Decal>` (Drei) projects the icon onto the mesh surface.
- `<Float>` (Drei) adds a gentle floating/bobbing animation.
- One `BallCanvas` per technology — 12 balls total on desktop.
- Hidden on mobile; replaced with a flat icon grid.

### 4. `StarsCanvas` — Contact Section Background

File: [src/components/canvas/Stars.jsx](src/components/canvas/Stars.jsx)

Renders **5 000 particle stars** as a full-screen background overlay.

- `maath/random` generates random positions inside a sphere of radius 1.2.
- `useFrame` rotates the point cloud every frame (x ÷10, y ÷15) for a slow drift.
- `PointMaterial` — pink `#f272c8`, size 0.002, transparent, depth write off.
- Positioned `z-[-1]` so it sits behind all other content.

---

## Sections

| Section | Component | Description |
|---|---|---|
| Hero | `Hero.jsx` | Typewriter heading cycling "Adnan Yousaf / Web Designer / Web Developer" over the 3D PC model |
| About | `About.jsx` | Bio paragraph, tilt service cards, social icons, CV download |
| Experience | `Experience.jsx` | Vertical timeline — Optymyze Technologies, Sysreforms International, Pakistan Detector Technologies |
| Tech | `Tech.jsx` | 12 tech balls (HTML, CSS, Bootstrap, MUI, JS, React, Redux, Tailwind, Node, MongoDB, MySQL, Git) |
| Projects | `Works.jsx` | 10 real-world projects with image, description, tech tags, and live links. Paginated (3 at a time) |
| Testimonials | `Feedbacks.jsx` | 3 client testimonials |
| Contact | `Contact.jsx` | EmailJS-powered contact form + rotating Earth 3D model |

---

## Getting Started

### Prerequisites

- Node.js >= 16
- npm >= 8

### Install

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because `react-tilt@0.1.4` declares a peer dep on React 15/16, but the project runs React 18. The package still works correctly at runtime.

### Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Environment / Configuration

The **EmailJS** credentials in [src/components/Contact.jsx](src/components/Contact.jsx) are already set up (service ID, template ID, public key). No `.env` file is needed to run the project locally — the contact form will work out of the box.

---

## Key Architectural Patterns

### `SectionWrapper` HOC

File: [src/hoc/SectionWrapper.jsx](src/hoc/SectionWrapper.jsx)

Every page section is wrapped with this Higher-Order Component. It:
- Wraps the section in a `motion.section` with a `staggerContainer` variant
- Triggers the entrance animation `whileInView` (fires once, at 25% visibility)
- Adds the anchor `id` used by navbar hash links

### Motion Variants

File: [src/utils/motion.js](src/utils/motion.js)

All animations use Framer Motion variants with a `hidden` → `show` pattern:
- `textVariant` — slides in from top with spring
- `fadeIn(direction, type, delay, duration)` — directional fade
- `zoomIn(delay, duration)` — scale from 0 → 1
- `slideIn(direction, ...)` — slides from off-screen edges
- `staggerContainer` — parent variant that staggers children

### Constants Data Layer

File: [src/constants/index.js](src/constants/index.js)

All content (nav links, services, technologies, work experiences, projects, testimonials) lives in one file. To update portfolio content, only this file needs editing.
