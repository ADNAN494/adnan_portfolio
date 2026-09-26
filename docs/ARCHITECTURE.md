# Architecture Adnan Yousaf Portfolio

A single-page React + Vite portfolio. Everything renders from one route; the
"pages" are scroll sections wired together in [`src/App.jsx`](../src/App.jsx).
Content is data-driven almost every section maps over an array exported from
[`src/constants/index.js`](../src/constants/index.js), so adding a project or a
job is a data edit, not a component edit.

---

## 1. Stack

| Layer             | Choice                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Framework         | React 18, Vite 4 (`type: module`)                                                                       |
| Styling           | Tailwind CSS 3 + PostCSS + Autoprefixer, plus `src/index.css` for fonts / dot-grid / glow utilities      |
| Shared type scale | `src/styles.js` (plain object of Tailwind class strings)                                                |
| Animation         | Framer Motion 9 (scroll reveals, hero letter stagger), `react-simple-typewriter`                        |
| 3D                | Three.js 0.149, `@react-three/fiber` 8, `@react-three/drei` 9, `maath` (star positions)                 |
| Contact form      | `@emailjs/browser` (dynamically imported on submit)                                                     |

Fonts: **Plus Jakarta Sans** (variable, 400–800) for everything a visitor
reads: headings 800, card titles 800, buttons 700, captions 700 uppercase, and
body at **450**, which is set on `body`. **JetBrains Mono** is reserved for the
terminal accents: the logo, section eyebrows (`// about`), the hero pill, the
code window and URLs. Nothing else should be mono. Light theme since
2026-09-25; see §1.1.

### 1.1 Theme tokens

All colours are named tokens in `tailwind.config.cjs`; components never use a
raw hex for text or surfaces. Each token is an `R G B` CSS variable
(`rgb(var(--ink) / <alpha-value>)`), defined twice in `src/index.css`: light on
`:root`, dark on `:root[data-theme="dark"]`. The contrast table at the top of
`tailwind.config.cjs` covers both themes and is the source of truth. Re-check it
whenever a value changes.

**Two themes.** Dark is the default (since 2026-09-25, same day the light
theme was added). The dark theme is the original pre-2026-09-25 palette (charcoal `#0c1110`, peach `#e8a76f`, mint `#6ee7b7`),
with body text one step brighter (`#b3bdb9`). The hex values below are the
light theme's.

- **The switch.** [`ThemeToggle.jsx`](../src/components/ThemeToggle.jsx) is
  fixed to the right edge (bottom-right on phones). It springs in once the page
  has scrolled 120px and leaves again at the top.
- **The reveal.** It swaps the theme with a View Transitions circle reveal
  starting from the button. Browsers without the API get a 350ms colour ease
  (`html.theme-fading`), and reduced-motion users get an instant swap.
- **State.** [`utils/theme.js`](../src/utils/theme.js) owns it. The DOM
  attribute is the source of truth, the choice is saved in `localStorage.theme`,
  and components subscribe via `useTheme()`, which works inside r3f canvases
  too. The starfield uses it to switch pine ↔ mint.
- **Default and no flash on reload.** `index.html` ships
  `<html data-theme="dark">` in its markup, so dark holds even with
  JavaScript off. An inline script there removes the attribute before first
  paint only when `localStorage.theme === "light"`. The critical `<style>` there
  carries both canvas colours. The storage key and hex values are duplicated
  there, so keep them in sync with `theme.js` and `index.css`. The "default
  theme" tests in `ThemeToggle.test.jsx` run that inline script directly.

| Token                            | Hex                               | Used for                                                                                        |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `canvas`                         | `#f7f5f0`                         | page background (warm off-white, never pure white)                                              |
| `surface` / `surface-muted`      | `#ffffff` / `#f1eee7`             | cards, inputs / chips, card headers, image wells                                                |
| `line` / `line-strong`           | `#e3ded3` / `#8f887a`             | decorative borders / anything that must be _seen_ to be used (inputs, secondary buttons) 3:1+   |
| `ink` / `ink-body` / `ink-muted` | `#14201c` / `#36433e` / `#56625d` | headings / paragraphs (9.5:1) / labels, meta (5.8:1)                                            |
| `ember` (+`-dark`, `-soft`)      | `#b04a14`                         | brand orange: primary CTA, the name, links, active nav. Text-safe on every surface (≥4.7:1)     |
| `pine` (+`-dark`, `-soft`)       | `#0b7152`                         | brand green: section eyebrows, markers, "featured" AI card                                      |
| `code.*`                         | `#111a17` …                       | the hero editor window, which stays dark on purpose and keeps the old peach/mint syntax colours |

The old peach `#e8a76f` and mint `#6ee7b7` are too pale for text on a light
ground (≈2:1), which is why they survive only inside `code.*`. Shadows are
`shadow-card` (resting), `shadow-lift` (hover), `shadow-float` (code window).
Keyboard focus is one global `:focus-visible` ember ring in `index.css`; form
fields opt out of it and draw their own ring.

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
            NO <React.StrictMode>  see §3.1
    │
App.jsx ── Navbar
           main
             ├─ .dot-grid › Hero          (+ lazy StarsCanvas, deferred to requestIdleCallback)
             ├─ About      #about
             ├─ Experience #work
             ├─ Tech       #skills
             ├─ Works      #project
             ├─ Clients
             └─ relative z-0
                  ├─ Contact  #contact    (+ lazy EarthCanvas inside LazyShow)
                  └─ LazyShow › lazy StarsCanvas   (absolute, z-[-1] backdrop)
```

**Performance strategy** (why the code looks the way it does):

- `React.lazy` on both canvases keeps Three.js (~740 kB / 202 kB gzip) out of
  the initial bundle. It only downloads once a canvas is actually needed.
- [`LazyShow`](../src/components/LazyShow.jsx) mounts children only when the
  wrapper scrolls within 400 px of the viewport, then disconnects a one-way
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
> `getContext()` until it is restored so if anything reuses the element, the
> next renderer fails outright with `Error creating WebGL context`. r3f already
> owns teardown. This is why `utils/webgl.js` has no `releaseRenderer()`. (A
> _fresh_ throwaway canvas, like the capability probe, is safe to release this
> way nothing reuses it.)

### 3.2 "Web page caused context loss and was blocked"

```
THREE.WebGLRenderer: A WebGL context could not be created.
Reason:  Web page caused context loss and was blocked      ×40
THREE.WebGLRenderer: Error creating WebGL context.
WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
```

That reason string comes from Blink
(`webgl_rendering_context_base.cc`, `CreateWebGraphicsContext3DProvider`),
dispatched when the browser process says the page's host is blocked from 3D
APIs. The rules live in `content/browser/gpu/gpu_data_manager_impl_private.cc`:

| Rule               | Value                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What gets recorded | A **real** GPU context loss driver reset/TDR, GPU process crash, GPU out of memory, a dual-GPU Mac switching GPUs logged against the page's **host** (`localhost` in dev) |
| Block one host     | 2+ recorded losses for that host inside the window                                                                                                                        |
| Block every host   | 3+ separate reset events inside the window                                                                                                                                |
| Window / expiry    | `kBlockedDomainExpirationPeriod` = **2 minutes**                                                                                                                          |
| Scope              | Browser-wide: every tab on that host, **and reloads**, until it expires                                                                                                   |

**Page-initiated losses don't count.** `WEBGL_lose_context.loseContext()`
(which is all three's `forceContextLoss()` does) is a _synthetic_ loss in
Blink; it never reaches the browser process. The console tells the two apart:
Blink prints `WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost` only for a
real loss (`kRealLostContext` → `kDisplayInConsole`). If that line is in the
log, the GPU dropped us.

> **Correction, 2026-09-24.** The 2026-09-08 write-up of this error blamed our
> own `loseContext()` calls, and a later "fix" replaced
> `renderer.forceContextLoss()` with a no-op. Neither survives a read of the
> Chromium source above. The no-op actively hurt: discarded contexts kept
> their drawing buffers until GC, and every HMR remount in dev left another
> one behind GPU memory pressure on exactly the kind of machine that resets
> under it (dev box: Intel Iris Plus 650, 1.5 GB shared). It's gone.

**Fix ask the GPU for less, and wait the block out:**

- `SafeCanvas` `DEFAULT_GL.powerPreference = "low-power"`. r3f defaults to
  `"high-performance"`, which wakes the discrete GPU on dual-GPU Macs; the
  switch is itself a real context loss.
- `Stars.jsx` passes `antialias: false`. Each starfield is full-viewport, so
  4× MSAA made its buffers ~90 MB at 1.5 dpr on a 1440×900 screen twice
  over, with the contact backdrop. `PointMaterial` already draws soft points.
- `Earth.jsx` drops `shadows` (the model is `KHR_materials_unlit` with no
  lights) and caps `dpr` at 1.5.
- r3f's own teardown runs untouched again, so an unmounted canvas frees its
  context immediately.
- **Recovery.** `probeWebGL()` returns `"ok" | "blocked" | "unsupported"` and
  never caches `"blocked"`. `SafeCanvas` parks canvases waiting for a context on
  reason `"blocked"`, then remounts them after `BLOCK_EXPIRY_MS` (125 s), up to
  three times per visit. Canvases already rendering keep their contexts
  throughout the block refuses only _new_ ones. `Earth.jsx` shows
  "3D is paused while the graphics driver recovers." with no retry link.

Canvases are still created once and paused off screen (`frameloop="never"`,
then `ResumeOnVisible` → `invalidate()` on the way back). That is now a
performance choice, not a block-avoidance rule: rebuilding a context and
re-uploading the Earth model on every scroll pass is expensive.
`ResumeOnVisible` is still load-bearing. r3f's rAF loop is global across roots
and cancels itself when no root wants a frame; flipping `frameloop` back to
`"always"` doesn't restart it, and `invalidate()` refuses to run while
frameloop is `"never"`.

**Unblocking a dev session right now:** wait two minutes, or quit and reopen
Chrome (the block list is in browser-process memory). `chrome://gpu` shows the
reset log. For heavy 3D debugging only, Chrome can be launched with
`--disable-domain-blocking-for-3d-apis`.

### 3.3 Defence in depth

```
utils/webgl.js       probeWebGL()   "ok" | "blocked" | "unsupported"; releases
                                    its throwaway context immediately

components/ErrorBoundary.jsx        the one class component. Catches both
                                    renderer-construction throws AND model
                                    load failures  r3f's inner boundary
                                    rethrows those outside <Canvas>

canvas/SafeCanvas.jsx               ErrorBoundary + <Canvas>. Failure reasons:
                                    · "unsupported" no WebGL at all
                                    · "blocked"     Chrome's host block; clears
                                                    itself after BLOCK_EXPIRY_MS
                                    · "lost"        context gone for good
                                    · "error"       anything thrown out of
                                                    the canvas tree
                                    On webglcontextlost: preventDefault (or
                                    webglcontextrestored never fires), wait
                                    1.5 s for restore, else rebuild; 1 auto
                                    retry, then hand over to `fallback`.
                                    gl defaults: low-power, preserveDrawingBuffer
                                    off, failIfMajorPerformanceCaveat off.
    ├─ canvas/Stars.jsx   paused off screen; antialias off
    └─ canvas/Earth.jsx   GLTF from /public/planet; paused off screen; dpr ≤ 1.5
```

`fallback` is a node **or** a function `({ reason, retry }) => node`, so a caller
can word the message per failure and offer a retry. `Earth.jsx` uses that: it
shows a styled disc with a reason-specific message and a "try again" link
(hidden for `unsupported` and `blocked`, where retrying can't help), and passes
`onRetry` to call `useGLTF.clear(MODEL_PATH)` drei caches the _rejected_
promise, so without clearing it a retry fails instantly with the same error
instead of refetching the model.

`Loader.jsx` (drei `useProgress`) is the in-canvas suspense fallback while the
Earth model downloads.

---

## 4. File map

```
src/
├── main.jsx                 entry; deferred mount
├── App.jsx                  section composition
├── index.css                base colours, focus ring, .dot-grid hero ground, scrollbar,
│                            glow utilities, .canvas-loader
├── styles.js                shared type scale (hero, section heads, eyebrow, bodyText)
├── constants/index.js       ALL content: navLinks, stats, mernSkills, aiSkill,
│                            paymentsSkill, extraTech, experiences, testimonials, projects
├── assets/index.js          image barrel (screenshots + company logos)
├── hoc/SectionWrapper.jsx   section shell: anchor + stagger + padding
├── utils/motion.js          fadeIn / slideIn / textVariant / staggerContainer
├── utils/webgl.js           WebGL probe ("ok" / "blocked" / "unsupported")
├── utils/theme.js           light/dark store: getTheme / setTheme / useTheme
├── utils/useMediaQuery.js    live CSS media query match (see the §6 variants rule)
└── components/
    ├── Navbar.jsx           scroll-aware nav, mobile drawer
    ├── ThemeToggle.jsx      floating light/dark switch, circle-reveal transition
    ├── SocialRail.jsx       fixed left-edge social links (md+), staged entrance
    ├── Hero.jsx             typewriter pill, letter-stagger name, dark code-window card
    ├── About.jsx            intro + stat cards + SocialIcons
    ├── Experience.jsx       role switcher (tabs + one panel) from `experiences`
    ├── Tech.jsx             MERN cards + AI + payments + extraTech chips
    ├── Works.jsx            project cards from `projects`
    ├── Clients.jsx          organisation cards (replaced Feedbacks)
    ├── Contact.jsx          EmailJS form + EarthCanvas
    ├── SocialIcons.jsx      single-colour social glyphs + phone-only row in About
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
|            | Hero                 | inline                                                |
| `#about`   | About + stats        | `stats`                                               |
| `#work`    | Experience switcher  | `experiences`                                         |
| `#skills`  | Skills / tech        | `mernSkills`, `aiSkill`, `paymentsSkill`, `extraTech` |
| `#project` | Projects             | `projects`                                            |
|            | Testimonials         | `testimonials`                                        |
| `#contact` | Contact form + Earth | inline / EmailJS                                      |

### 5.2 Projects (15, in display order)

| #   | Project                                                                              | Stack                                      | Live                                    |
| --- | ------------------------------------------------------------------------------------ | ------------------------------------------ | --------------------------------------- |
| 1   | **Mukafi** bilingual (EN/AR, RTL) GCC end-of-service gratuity calculator             | Next.js, Tailwind, i18n                    | https://mukafi.com/en                   |
| 2   | **Psychic Txt** live psychic chat & text-reading platform                            | Next.js, Bootstrap, Node, MUI, MSSQL       | https://www.psychictxt.com/             |
| 3   | **MDMC (DRAP)** medical drug management for Pakistan's DRAP                          | React, Bootstrap, Node, MUI, MSSQL         | https://e.dra.gov.pk/login              |
| 4   | **Psychic Txt Advisor Match Funnel** guided advisor-matching intake                  | Next.js, Tailwind, Node, MSSQL             | https://try.psychictxt.com/             |
| 5   | **Psychic Vision** live psychic reading app marketing + credit checkout              | Next.js, Tailwind, Node, Stripe, MSSQL     | https://www.psychicvisionapp.com/       |
| 6   | **Mi Vidente** Spanish-language tarot / psychic app platform                         | Next.js, Bootstrap, Node, Stripe, MSSQL    | https://mividenteapp.com/               |
| 7   | **Reset Hypnosis** quit-vaping quiz funnel for a guided hypnosis programme           | React, Tailwind, Node, MySQL               | https://quiz.resethypnosis.com/welcome  |
| 8   | **Wello Move** wellness platform, plans + expert consults                            | React, Node, Tailwind, MySQL               | https://quiz.joinwello.com/landing      |
| 9   | **Sont (WOAH)** animal-disease tracking for the World Organisation for Animal Health | React, Bootstrap, Node, MUI, MSSQL         | https://sont-uat.woah.org/              |
| 10  | **Techypedia** UK digital-solutions company site                                     | React/Next.js, Bootstrap, Node, MUI, MSSQL | https://techypedia.co.uk/               |
| 11  | **PVSIS** WHO/WOAH veterinary & aquatic animal health services                       | React, Node, MUI, MSSQL                    | https://pvs-preprod.woah.org/           |
| 12  | **True Closure** grief support & guided resources                                    | React, Tailwind CSS, PHP, MySQL            | https://join.trueclosureapp.com/landing |
| 13  | **Sysreforms International** software house corporate site                           | React, Bootstrap, Redux                    | https://www.sysreforms.com/             |
| 14  | **UNDP** UN home energy-efficiency programme (CMS, LMS, Energy modules)              | React, Bootstrap, Redux                    | https://www.undp.org/                   |
| 15  | **Immigra Consultants** study-abroad student advisory                                | React, Redux, Bootstrap                    | https://www.immigraconsultants.com/     |

Screenshots live in `src/assets/` as **WebP** (`mukafi`, `psychicVision`, `miVidente`,
`psyTry`, `resetHypnosis`, `psy`, `wello`, `sont`, `tech_pedia`, `drap`, `pvs`,
`trueClosure`, `immi`, `sys1`, `undp`) and are exported through
`src/assets/index.js`. Every project screenshot is WebP, capped at 1200 px wide,
quality 80 the whole set is ~420 kB. `Works.jsx` only ever shows 4 cards until
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

- **`summary`** one line of context under the company name: domain, clients,
  scope. This is where the credibility lives (WOAH / WHO / UNDP / DRAP for
  Sysreforms), so it should never be a restatement of the job title.
- **`points`** what was actually built and owned. Written for recruiters and
  hiring managers, so this section is deliberately more technical than About or
  Skills, which are client-facing. Name the system, the constraint and the
  decision not the library. `Experience.jsx` renders both fields optionally,
  so an entry without them still works.
- **`tech`** per-role stack chips, same treatment as the project-card tags, so
  the stack is scannable without reading every bullet.

**How it renders.** `Experience.jsx` is a WAI-ARIA tab set, not a timeline.
The roles sit in a tab list (a column beside the panel from `lg`, a row of logo
tabs above it below `lg`), and one panel shows the selected role. Only the first
`VISIBLE_POINTS` (4) `points` show until "Show all N highlights" is pressed, so
**order `points` by strength**: the first four are the ones most visitors read.
Every panel is rendered and stacked in one grid cell (crossfade in place). The
cell is sized to the active panel by a `ResizeObserver` and eases only on a role
switch. The entrance reproduces the old timeline's CSS keyframes
(`popIn` / `bounceIn` in `utils/motion.js`).

### 5.4 Skills surfaced

Three tiers of cards, then chips see `Tech.jsx`:

| Tier                 | Source                     | Renders as                                                                                                                                          |
| -------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `the core stack:`    | `mernSkills`               | 4 `SkillCard`s, `lg:grid-cols-4`. The letters spell **MERN** this row is an acronym, so it takes exactly four entries.                              |
| `frontend toolkit:`  | `frontendSkills`           | 5 `StackCard`s, `lg:grid-cols-5`. Next.js, JavaScript, TypeScript, Tailwind CSS, Material UI. Compact variant: 40 px letter mark, `p-6`, 3 bullets. |
| featured             | `aiSkill`, `paymentsSkill` | 2 `FeatureCard`s, `lg:grid-cols-2`, mint / peach.                                                                                                   |
| `also working with:` | `extraTech`                | chips                                                                                                                                               |

`extraTech` chips: Stripe, Apple Pay, PayPal, AI Chatbots, OpenAI API, Claude
API, Bootstrap, MySQL, MSSQL, Firebase, Git & GitHub, Figma.

> Anything promoted from a chip to a card must be **removed from `extraTech`**,
> or it renders twice in the same section. Next.js, TypeScript and MUI were
> moved out when `frontendSkills` was added.

## 6. Conventions

- **Content changes go in `src/constants/index.js`** components only map.
  Exceptions: the Hero and About prose live in their components (and the Hero
  intro is mirrored in `index.html`).
- **Two voices, on purpose.** Hero, About and Skills are written for clients and
  non-technical visitors: plain language, outcomes over tooling, no unexplained
  acronyms. Experience is written for recruiters and hiring managers: name the
  system, the constraint and the decision. Don't blur them.
- **Every number on the page must be checkable.** `stats` in `constants` is read
  next to a project grid a visitor can count keep `Projects shipped` equal to
  `projects.length`, and don't add metrics that can't be defended in an interview.
- **Colour goes through tokens.** Use `text-ink*`, `bg-surface*`, `border-line*`,
  `ember`, `pine`, not hex values and not `text-white`. Text on an `ember` or
  `ink` fill is `text-canvas`, which is light on the light theme and dark on the
  dark one. Where a library takes inline styles, use
  `rgb(var(--surface))` / `var(--shadow-card)` so the theme still applies. The
  one fixed-colour exception is the hero code window (`code.*`), dark in both
  themes. Body
  copy is `styles.bodyText`; headings are `font-heading`; in-section captions
  ("The core stack", "What I build") are `styles.label`. Anything that must be
  seen to be used takes `border-line-strong`, not `border-line`.
- New images: convert to **WebP** first (≤1200 px wide, quality 80), drop in
  `src/assets/`, export from `src/assets/index.js`. Don't commit the source
  PNG/JPG a raw full-page screenshot is 1–3 MB, the WebP is ~20–45 kB.
- New section: build the component, wrap in `SectionWrapper(Component, "anchor")`,
  add to `src/components/index.js`, render in `App.jsx`, add to `navLinks`.
- Anything that creates a WebGL context goes through `SafeCanvas`, never `<Canvas>`
  directly otherwise a lost context or a failed model takes down the React tree.
- **Keep canvases cheap on the GPU.** Real context losses not our own
  `loseContext()` calls are what get a host blocked for two minutes (§3.2).
  Don't turn on `antialias`, `shadows` or a dpr above 1.5 without a visible
  reason, and never set `powerPreference: "high-performance"`.
- Pause off-screen canvases with `frameloop="never"` rather than unmounting
  them, and call `invalidate()` from inside the canvas when resuming.
- **The two edge controls are 40px wide at 16px from the edge** (32px from
  1400px). `SocialRail` sits on the left, `ThemeToggle` on the right. Content
  stops 64px from the edge (the section gutter) until the centred column pulls
  away, so that leaves 8px clear on both sides. Anything wider or further in
  overlaps card edges between 768 and ~1340px, which is what the first
  50px/24px switch did.
- Don't re-add `<React.StrictMode>` while the project is on r3f 8 (§3.1), and
  don't call `forceContextLoss()` from component cleanup r3f owns teardown.
- Motion variants come from `src/utils/motion.js`; don't inline new ones unless
  they're single-use (as in the hero letter stagger).
- **Nothing may translate content past the right edge.** A phone browser widens
  its layout viewport to fit horizontal overflow and never narrows it again, so
  a 0.6 s entry animation that overshoots leaves every section on the page
  rendered at screen width inside a wider document content pinned left, dead
  strip right until the visitor reloads. `html, body` now carry
  `overflow-x: clip` as the backstop (`hidden` first, as the fallback), but the
  backstop is not the licence: prefer `y` to `x` for entry variants, or clip at
  the section, as `Contact.jsx` does around its two `slideIn`s.
- **Nothing may set a min-content width wider than the narrowest phone.**
  `whitespace-nowrap` next to display type in a row that cannot wrap is the
  usual culprit see the `flex-wrap` on the `Clients.jsx` card header. Test at
  320 px, not at 390.
- **Never derive a framer-motion variant from a live media query.** If the
  variants change after the entrance has played, framer-motion applies the new
  set, and any axis the new set doesn't mention goes back to its `hidden`
  value. Swapping `bounceIn("right")` for `bounceIn("up")` on a resize past
  1024px left the Experience panel stuck at `translateX(100px)`, cut off. Pick
  the direction once at mount (`useState(isDesktop)`, as `Experience.jsx`
  does), and keep both axes in every variant, as `bounceIn` does.

## 7. Commands

```bash
npm run dev       # vite dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/
npx update-browserslist-db@latest   # refresh caniuse-lite when Vite warns
```
