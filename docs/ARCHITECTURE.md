# Architecture — Adnan Yousaf Portfolio

A single-page React + Vite portfolio. Everything renders from one route; the
"pages" are scroll sections wired together in [`src/App.jsx`](../src/App.jsx).
Content is data-driven — almost every section maps over an array exported from
[`src/constants/index.js`](../src/constants/index.js), so adding a project or a
job is a data edit, not a component edit.

---

## 1. Stack

| Layer             | Choice                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Framework         | React 18, Vite 4 (`type: module`)                                                                       |
| Styling           | Tailwind CSS 3 + PostCSS + Autoprefixer, plus `src/index.css` for fonts / dot-grid / timeline overrides |
| Shared type scale | `src/styles.js` (plain object of Tailwind class strings)                                                |
| Animation         | Framer Motion 9 (scroll reveals, hero letter stagger), `react-simple-typewriter`                        |
| 3D                | Three.js 0.149, `@react-three/fiber` 8, `@react-three/drei` 9, `maath` (star positions)                 |
| Timeline          | `react-vertical-timeline-component`                                                                     |
| Contact form      | `@emailjs/browser` (dynamically imported on submit)                                                     |

Fonts: **Archivo Expanded** (display), **Inter** (body), **JetBrains Mono**
(labels, tags, code). Palette: charcoal base with peach (`#e8a76f`) and mint
(`#6ee7b7`) accents.

---

## 2. Render pipeline

```
index.html  ── static hero shell, inlined CSS (prod only)
               ⚠ the hero intro paragraph is duplicated verbatim in Hero.jsx.
                 Change one, change both, or the copy visibly swaps on mount.
    │
    ├─ vite.config.js › inlineCss()        build: folds the CSS bundle into <style> so
    │                                      first paint needs no blocking stylesheet
    └─ vite.config.js › emptyShellInDev()  serve: empties the shell (Tailwind is JS-injected
                                           in dev, so the shell would flash unstyled)
    │
main.jsx ── waits 2 rAFs (or a 300 ms fallback for hidden tabs) so the browser
            paints the shell before React replaces #root.
            NO <React.StrictMode> — see §3.1
    │
App.jsx ── Navbar
           main
             ├─ .dot-grid › Hero          (+ lazy StarsCanvas, deferred to requestIdleCallback)
             ├─ About      #about
             ├─ Experience #work
             ├─ Tech       #skills
             ├─ Works      #project
             ├─ Feedbacks
             └─ relative z-0
                  ├─ Contact  #contact    (+ lazy EarthCanvas inside LazyShow)
                  └─ LazyShow › lazy StarsCanvas   (absolute, z-[-1] backdrop)
```

**Performance strategy** (why the code looks the way it does):

- `React.lazy` on both canvases keeps Three.js (~740 kB / 202 kB gzip) out of
  the initial bundle. It only downloads once a canvas is actually needed.
- [`LazyShow`](../src/components/LazyShow.jsx) mounts children only when the
  wrapper scrolls within 400 px of the viewport, then disconnects — a one-way
  gate for heavy chunks (Earth GLTF, star field).
- The hero starfield waits for `requestIdleCallback` (600 ms timeout) so it
  never competes with LCP.
- `SectionWrapper` HOC gives every section its scroll anchor (`.hash-span`) and
  a `whileInView` stagger with `once: true`.

---

## 3. WebGL layer

Three canvases can exist on the page: the hero starfield, the contact backdrop
starfield, and the Earth. Two independent things used to break them.

### 3.1 Why the context was being lost (the root cause)

**`@react-three/fiber` 8.x is not compatible with React 18's `StrictMode`
double-mount.** In `CanvasImpl`, the renderer root is held in a **ref**:

```js
if (!root.current) root.current = createRoot(canvas)   // react-three-fiber.esm.js:148
...
React.useEffect(() => {
  if (canvas) return () => unmountComponentAtNode(canvas)   // :193
}, [canvas])
```

and `unmountComponentAtNode` runs its teardown **inside a `setTimeout(…, 500)`**:

```js
state.gl?.renderLists?.dispose();
state.gl?.forceContextLoss();
roots.delete(canvas);
```

Refs survive StrictMode's simulated remount, so the sequence is:

1. mount → renderer created on canvas element `C`
2. StrictMode simulated unmount → teardown **queued** for +500 ms
3. StrictMode remount → `root.current` is still set, so the _same live renderer_
   keeps rendering on `C`
4. **+500 ms** → the queued teardown fires and calls `forceContextLoss()` on a
   canvas that is actively rendering

Result, about half a second after load, dev only:

```
WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
THREE.WebGLRenderer: Context Lost.
```

**Fix:** `main.jsx` renders `<App />` without `<React.StrictMode>`, with a
comment explaining why. StrictMode is dev-only, so production is unaffected.
Revisit if the project moves to r3f 9 / React 19, which fixes remount handling.

> **Never call `forceContextLoss()` on unmount yourself.** A canvas element whose
> context was explicitly lost keeps returning that same dead context from
> `getContext()` until it is restored — so if anything reuses the element, the
> next renderer fails outright with `Error creating WebGL context`. r3f already
> owns teardown. This is why `utils/webgl.js` has no `releaseRenderer()` — and
> see §3.2 for the far worse failure that calling it too often causes.

### 3.2 Why contexts were being *blocked* (the second, worse root cause)

Fixing StrictMode (§3.1) stopped the dev-only teardown race, but the app kept
hitting a different wall in normal browsing:

```
THREE.WebGLRenderer: A WebGL context could not be created.
Reason:  Web page caused context loss and was blocked      ×9
THREE.WebGLRenderer: Error creating WebGL context.
```

That reason string is Chrome's, forwarded verbatim by three.js
(`three.module.js:27586` logs `event.statusMessage` from
`webglcontextcreationerror`). **Chrome counts how many times a page forcibly
loses a WebGL context** — any call to the `WEBGL_lose_context` extension — and
once the count gets high the GPU process refuses to give that page another
context *for the rest of the page's life*. It is a DoS guard on the GPU process,
and only a reload clears it.

The app was calling that extension on two paths, both on purpose:

1. `utils/webgl.js` — the capability probe explicitly called `loseContext()`
   to "release" itself. One guilty loss on every page load.
2. **`Stars.jsx` unmounted its canvas 1.5 s after scrolling off screen.**
   r3f's `unmountComponentAtNode` runs `state.gl.forceContextLoss()`
   (`index-*.esm.js:1947`), which *is* `WEBGL_lose_context.loseContext()`. So
   every scroll past the hero or the contact section spent one guilty loss.

Both were written to stay under Chrome's ~16 *live-context* cap — a cap the page
was never remotely near, with at most three canvases. They traded a limit that
did not apply for the one guard that is unrecoverable. Measured on the built
site, eight scroll cycles produced **10 forced losses and 12 context creations**;
that is a blocked page inside a minute of ordinary scrolling. `SafeCanvas`'s
retry loop then made it terminal — each rebuild unmounts a canvas, which costs
another forced loss, which fails again.

**Fix — don't churn canvases.** This is also what the r3f maintainers advise:
keep one canvas and swap its contents, never mount/unmount per view.

- `Stars.jsx` creates its canvas once and keeps it. Off screen it sets
  `frameloop="never"` instead of unmounting: no rAF, no draw calls, no GPU work,
  and the context survives. Two idle contexts cost far less than one block.
- `Stars.jsx › ResumeOnVisible` calls `invalidate()` from inside the canvas when
  it scrolls back in. **This is load-bearing.** r3f's rAF loop is global across
  all roots and cancels itself when no root wants a frame (`if (repeat === 0)
  { running = false; cancelAnimationFrame(frame) }`). Flipping `frameloop` back
  to `"always"` only writes to the store — `configure()` calls `setFrameloop()`,
  which never restarts the loop, and `invalidate()` refuses to run while
  frameloop is still `"never"`. Without this the stars freeze permanently the
  first time every canvas idles at once.
- `utils/webgl.js` probes without calling `loseContext()`. The throwaway canvas
  is unreachable when the function returns; the browser reclaims it on GC.
- `SafeCanvas` watches for `webglcontextcreationerror` in the capture phase
  (the event does not bubble) and, on a blocked/context-loss status message,
  sets a module-wide flag that makes *every* canvas on the page fall back
  immediately. Retrying a blocked page cannot succeed and adds to the count.
  `MAX_RETRIES` is down to 1 for the same reason.

After the fix the same eight-cycle run produces **0 forced losses and 4 context
creations**, with the starfield still animating at the end.

> **Rule:** never unmount a `<Canvas>` to "free" a context, and never call
> `forceContextLoss()` or `WEBGL_lose_context.loseContext()` yourself. Pause the
> frameloop instead.

### 3.3 Defence in depth

Even with StrictMode gone, contexts can be lost for reasons outside our control:
a laptop switching GPUs, a driver reset, a tab backgrounded too long, or simply
the browser's live-context cap (~16 in Chrome) evicting the oldest.

```
utils/webgl.js       isWebGLAvailable()   one-off probe, self-releasing

components/ErrorBoundary.jsx              the one class component. Catches both
                                          renderer-construction throws AND model
                                          load failures — r3f's inner boundary
                                          rethrows those outside <Canvas>

canvas/SafeCanvas.jsx                     ErrorBoundary + <Canvas>. Failure modes:
                                          · "unsupported" no WebGL at all
                                          · "lost"        context gone for good
                                          · "error"       anything thrown out of
                                                          the canvas tree
                                          On webglcontextlost: preventDefault (or
                                          webglcontextrestored never fires), wait
                                          1.5 s for restore, else rebuild; 2 auto
                                          retries, then hand over to `fallback`.
                                          gl defaults: preserveDrawingBuffer off,
                                          failIfMajorPerformanceCaveat off.
    ├─ canvas/Stars.jsx   unmounts itself 1.5 s after leaving the viewport, so
    │                     only the visible starfield holds a context
    └─ canvas/Earth.jsx   GLTF from /public/planet, frameloop="demand"
```

`fallback` is a node **or** a function `({ reason, retry }) => node`, so a caller
can word the message per failure and offer a retry. `Earth.jsx` uses that: it
shows a styled disc with a reason-specific message and a "try again" link
(hidden for `unsupported`, where retrying can't help), and passes `onRetry` to
call `useGLTF.clear(MODEL_PATH)` — drei caches the _rejected_ promise, so
without clearing it a retry fails instantly with the same error instead of
refetching the model.

`Loader.jsx` (drei `useProgress`) is the in-canvas suspense fallback while the
Earth model downloads.

---

## 4. File map

```
src/
├── main.jsx                 entry; deferred mount
├── App.jsx                  section composition
├── index.css                fonts, .dot-grid, scrollbar, timeline overrides, .canvas-loader
├── styles.js                shared Tailwind class strings
├── constants/index.js       ALL content: navLinks, stats, mernSkills, aiSkill,
│                            paymentsSkill, extraTech, experiences, testimonials, projects
├── assets/index.js          image barrel (screenshots + company logos)
├── hoc/SectionWrapper.jsx   section shell: anchor + stagger + padding
├── utils/motion.js          fadeIn / slideIn / textVariant / staggerContainer
├── utils/webgl.js           WebGL probe + context release
└── components/
    ├── Navbar.jsx           scroll-aware nav, mobile drawer
    ├── Hero.jsx             typewriter, letter-stagger name, code-window card
    ├── About.jsx            intro + stat cards + SocialIcons
    ├── Experience.jsx       vertical timeline from `experiences`
    ├── Tech.jsx             MERN cards + AI + payments + extraTech chips
    ├── Works.jsx            project cards from `projects`
    ├── Feedbacks.jsx        testimonials
    ├── Contact.jsx          EmailJS form + EarthCanvas
    ├── SocialIcons.jsx      social links
    ├── LazyShow.jsx         viewport-gated mount
    ├── ErrorBoundary.jsx    generic boundary
    ├── Loader.jsx           drei progress loader
    └── canvas/{SafeCanvas,Stars,Earth}.jsx
```

---

## 5. Portfolio content inventory

### 5.1 Sections (nav order)

| Anchor     | Section              | Source data                                           |
| ---------- | -------------------- | ----------------------------------------------------- |
| —          | Hero                 | inline                                                |
| `#about`   | About + stats        | `stats`                                               |
| `#work`    | Experience timeline  | `experiences`                                         |
| `#skills`  | Skills / tech        | `mernSkills`, `aiSkill`, `paymentsSkill`, `extraTech` |
| `#project` | Projects             | `projects`                                            |
| —          | Testimonials         | `testimonials`                                        |
| `#contact` | Contact form + Earth | inline / EmailJS                                      |

### 5.2 Projects (14, in display order)

| #   | Project                                                                                | Stack                                      | Live                                    |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| 1   | **Psychic Txt** — live psychic chat & text-reading platform                            | Next.js, Bootstrap, Node, MUI, MSSQL       | https://www.psychictxt.com/             |
| 2   | **MDMC (DRAP)** — medical drug management for Pakistan's DRAP                          | React, Bootstrap, Node, MUI, MSSQL         | https://e.dra.gov.pk/login              |
| 3   | **Psychic Txt — Advisor Match Funnel** — guided advisor-matching intake                | Next.js, Tailwind, Node, MSSQL             | https://try.psychictxt.com/             |
| 4   | **Psychic Vision** — live psychic reading app marketing + credit checkout              | Next.js, Tailwind, Node, Stripe, MSSQL     | https://www.psychicvisionapp.com/       |
| 5   | **Mi Vidente** — Spanish-language tarot / psychic app platform                         | Next.js, Bootstrap, Node, Stripe, MSSQL    | https://mividenteapp.com/               |
| 6   | **Reset Hypnosis** — quit-vaping quiz funnel for a guided hypnosis programme           | React, Tailwind, Node, MySQL               | https://quiz.resethypnosis.com/welcome  |
| 7   | **Wello Move** — wellness platform, plans + expert consults                            | React, Node, Tailwind, MySQL               | https://quiz.joinwello.com/landing      |
| 8   | **Sont (WOAH)** — animal-disease tracking for the World Organisation for Animal Health | React, Bootstrap, Node, MUI, MSSQL         | https://sont-uat.woah.org/              |
| 9   | **Techypedia** — UK digital-solutions company site                                     | React/Next.js, Bootstrap, Node, MUI, MSSQL | https://techypedia.co.uk/               |
| 10  | **PVSIS** — WHO/WOAH veterinary & aquatic animal health services                       | React, Node, MUI, MSSQL                    | https://pvs-preprod.woah.org/           |
| 11  | **True Closure** — grief support & guided resources                                    | React, Tailwind CSS, PHP, MySQL            | https://join.trueclosureapp.com/landing |
| 12  | **Sysreforms International** — software house corporate site                           | React, Bootstrap, Redux                    | https://www.sysreforms.com/             |
| 13  | **UNDP** — UN home energy-efficiency programme (CMS, LMS, Energy modules)              | React, Bootstrap, Redux                    | https://www.undp.org/                   |
| 14  | **Immigra Consultants** — study-abroad student advisory                                | React, Redux, Bootstrap                    | https://www.immigraconsultants.com/     |

Screenshots live in `src/assets/` as **WebP** (`psychicVision`, `miVidente`,
`psyTry`, `resetHypnosis`, `psy`, `wello`, `sont`, `tech_pedia`, `drap`, `pvs`,
`trueClosure`, `immi`, `sys1`, `undp`) and are exported through
`src/assets/index.js`. Every project screenshot is WebP, capped at 1200 px wide,
quality 80 — the whole set is ~420 kB. `Works.jsx` only ever shows 4 cards until
`load_more()`, so the order of the array is what decides which four a visitor
sees first.

### 5.3 Experience

| Role                 | Company                        | Dates               |
| -------------------- | ------------------------------ | ------------------- |
| Frontend Developer   | Optymyze Technologies          | Jul 2025 – Present  |
| MERN Stack Developer | Sysreforms International       | Nov 2023 – Jun 2025 |
| Web Designer & SEO   | Pakistan Detector Technologies | Jan 2022 – Jun 2022 |

Each entry in `experiences` carries `title`, `company_name`, `icon`, `iconBg`,
`date`, `link`, plus:

- **`summary`** — one line of context under the company name: domain, clients,
  scope. This is where the credibility lives (WOAH / WHO / UNDP / DRAP for
  Sysreforms), so it should never be a restatement of the job title.
- **`points`** — what was actually built and owned. Written for recruiters and
  hiring managers, so this section is deliberately more technical than About or
  Skills, which are client-facing. Name the system, the constraint and the
  decision — not the library. `Experience.jsx` renders both fields optionally,
  so an entry without them still works.
- **`tech`** — per-role stack chips, same treatment as the project-card tags, so
  the stack is scannable without reading every bullet.

### 5.4 Skills surfaced

Three tiers of cards, then chips — see `Tech.jsx`:

| Tier | Source | Renders as |
| --- | --- | --- |
| `the core stack:` | `mernSkills` | 4 `SkillCard`s, `lg:grid-cols-4`. The letters spell **MERN** — this row is an acronym, so it takes exactly four entries. |
| `frontend toolkit:` | `frontendSkills` | 5 `StackCard`s, `lg:grid-cols-5`. Next.js, JavaScript, TypeScript, Tailwind CSS, Material UI. Compact variant: 40 px letter mark, `p-6`, 3 bullets. |
| featured | `aiSkill`, `paymentsSkill` | 2 `FeatureCard`s, `lg:grid-cols-2`, mint / peach. |
| `also working with:` | `extraTech` | chips |

`extraTech` chips: Stripe, Apple Pay, PayPal, AI Chatbots, OpenAI API, Claude
API, Bootstrap, MySQL, MSSQL, Firebase, Git & GitHub, Figma.

> Anything promoted from a chip to a card must be **removed from `extraTech`**,
> or it renders twice in the same section. Next.js, TypeScript and MUI were
> moved out when `frontendSkills` was added.

## 6. Conventions

- **Content changes go in `src/constants/index.js`** — components only map.
  Exceptions: the Hero and About prose live in their components (and the Hero
  intro is mirrored in `index.html`).
- **Two voices, on purpose.** Hero, About and Skills are written for clients and
  non-technical visitors: plain language, outcomes over tooling, no unexplained
  acronyms. Experience is written for recruiters and hiring managers: name the
  system, the constraint and the decision. Don't blur them.
- **Every number on the page must be checkable.** `stats` in `constants` is read
  next to a project grid a visitor can count — keep `Projects shipped` equal to
  `projects.length`, and don't add metrics that can't be defended in an interview.
- New images: convert to **WebP** first (≤1200 px wide, quality 80), drop in
  `src/assets/`, export from `src/assets/index.js`. Don't commit the source
  PNG/JPG — a raw full-page screenshot is 1–3 MB, the WebP is ~20–45 kB.
- New section: build the component, wrap in `SectionWrapper(Component, "anchor")`,
  add to `src/components/index.js`, render in `App.jsx`, add to `navLinks`.
- Anything that creates a WebGL context goes through `SafeCanvas`, never `<Canvas>`
  directly — otherwise a lost context or a failed model takes down the React tree.
- **Never unmount a canvas to free its context, and never call
  `forceContextLoss()` / `WEBGL_lose_context.loseContext()`.** Chrome blocks a
  page that forces context loss too often, permanently (§3.2). Pause with
  `frameloop="never"` instead, and call `invalidate()` from inside the canvas
  when resuming.
- Don't re-add `<React.StrictMode>` while the project is on r3f 8 (§3.1), and
  don't call `forceContextLoss()` from component cleanup.
- Motion variants come from `src/utils/motion.js`; don't inline new ones unless
  they're single-use (as in the hero letter stagger).
- **Nothing may translate content past the right edge.** A phone browser widens
  its layout viewport to fit horizontal overflow and never narrows it again, so
  a 0.6 s entry animation that overshoots leaves every section on the page
  rendered at screen width inside a wider document — content pinned left, dead
  strip right — until the visitor reloads. `html, body` now carry
  `overflow-x: clip` as the backstop (`hidden` first, as the fallback), but the
  backstop is not the licence: prefer `y` to `x` for entry variants, or clip at
  the section, as `Contact.jsx` does around its two `slideIn`s.
- **Nothing may set a min-content width wider than the narrowest phone.**
  `whitespace-nowrap` next to display type in a row that cannot wrap is the
  usual culprit — see the `flex-wrap` on the `Clients.jsx` card header. Test at
  320 px, not at 390.
- **`react-vertical-timeline-component` styles are overridden in `index.css`,
  not forked.** Its mobile reveal (`cd-bounce-2-inverse`, which its own
  `max-width: 1169px` rule applies to every phone and tablet) starts the card
  100 px to the right; `index.css` swaps `animation-name` only, so the library
  keeps its timing. The rail compaction below it is scoped to ≤767 px.

## 7. Commands

```bash
npm run dev       # vite dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/
npx update-browserslist-db@latest   # refresh caniuse-lite when Vite warns
```
