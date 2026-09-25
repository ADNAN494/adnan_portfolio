# TODO Adnan Yousaf Portfolio

Living backlog. Newest work at the top; see
[ARCHITECTURE.md](./ARCHITECTURE.md) for how the pieces fit together.

Legend: `[x]` done · `[ ]` open · **P1** blocking/user-visible · **P2** should
fix · **P3** polish.

---

## Done 2026-09-25

### [x] Ember glow on the social links (P3)

- **What glows:** the "Find me on" caption, the icons and the rail's hairline,
  on the left rail and on the phone tiles in About. At rest they are ember with
  a soft glow instead of muted grey. The hairline fades from ember at the icons
  to nothing at the bottom edge.
- **Hover / keyboard focus:** the glow flares to a brighter core and a wider
  halo.
- **Implementation:** utilities in `index.css` (`glow-ember`,
  `glow-ember-strong`, `text-glow-ember`, `box-glow-ember*`). The icon glows use
  drop-shadow filters, so the glow follows the glyph's shape. The name label
  sits outside the glowing element and doesn't pick it up.
- **Strength is per theme** (`--glow-a`, `--glow-a-soft`): strong on dark,
  about half on light, where a heavy orange haze looks like a smudge.

### [x] Dark theme is the default (P2)

- **New visitors land on dark.** `index.html` now ships
  `<html data-theme="dark">` (and a dark `theme-color`) in the markup itself,
  so the first frame is dark even before, or without, JavaScript. The inline
  script flips it to light only for a visitor whose saved choice is `light`.
- **Returning visitors keep what they chose.** Both choices are still saved
  under `localStorage.theme`, so anyone who picked light stays light. Before
  this, a visitor with nothing saved got light.
- **Verified** on the built site: first visit is `rgb(12, 17, 16)` at
  DOMContentLoaded. After picking light, a reload is light from
  DOMContentLoaded (no dark flash). With JS disabled the page renders dark.
  Tests: 28/28. The three new ones run `index.html`'s inline script directly.

### [x] Social links → fixed left rail **P3**

Facebook / WhatsApp / LinkedIn moved out of About onto a fixed left-edge rail
(md and up), in the pattern Brittany Chiang's v4 made standard for developer
portfolios. The rail has a vertical "Find me on" caption, the icons, and a
hairline down to the bottom of the screen.

- **Entrance** (0.9s, after the hero intro): the hairline draws up from the
  bottom, the icons rise out of it one by one from a blur, then the caption.
- **Hover:** the icon lifts and turns ember, and a name label slides out to the
  right. Keyboard focus shows the same label.
- **Icons are single-colour now.** The brand-coloured circles are gone: two
  blues and a green fought the ember/pine palette. Same artwork, in
  `currentColor`, so they follow the theme.
- **Phones** (no room for a rail beside a 24px gutter) keep a row at the end of
  About, as squared tiles.
- **Links** moved into `constants.socials`, per the content-in-constants rule.
  `SocialRail.test.jsx` covers hrefs, new-tab attributes, and that every id has
  a glyph.

**Also fixed:** the theme switch was 50px wide at 24px from the edge, so it
overlapped card edges by ~10px at every width from 768 to ~1340px. It is now
40px at 16px, mirroring the rail. Measured with animations settled at
768/1024/1180/1280/1366/1440: no overlap, at least 4px clear, on either side.

### [x] Light / dark theme switch **P2**

A floating switch on the right edge (bottom-right on phones) flips between the
new light theme and the original dark one.

**Appearance.** The switch springs in, with one ring pulse, once the page has
scrolled 120px, and leaves again at the top. The thumb slides between a sun and
a moon. On desktop, hover or keyboard focus shows a "Dark mode" / "Light mode"
label.

**The swap.** The new theme is revealed as a circle growing out of the switch
(View Transitions API). Other browsers get a 350ms colour ease; reduced-motion
users get an instant swap.

**How it works:**

- Every themed colour became an `R G B` CSS variable behind the same Tailwind
  class names, so no component markup had to fork.
- Text on ember/ink fills moved from `text-white` to `text-canvas`, because
  white on the dark theme's peach is 2:1.
- Timeline inline styles, the canvas loader, the typewriter cursor and the
  starfield colour all read the theme too.

**Persistence.** The choice goes to `localStorage.theme`. An inline script in
`index.html` applies it before first paint. Verified: after a reload, `<body>`
is already `rgb(12, 17, 16)` at DOMContentLoaded.

**Also fixed:** the global `:focus-visible` rule set `border-radius: 6px` on the
focused element, so every pill button went square-cornered on Tab. It now sets
the outline only.

**Verified:**

- Tests: 23/23, including 3 new ones in `ThemeToggle.test.jsx` (appears on
  scroll, toggles and persists, respects a pre-applied theme).
- In Chrome: no overflow while the switch springs in, and none on a full scroll
  at 390px in either theme.
- The reveal animation measured running across ~650ms.

### [x] Light theme, typography and readability pass **P2**

Body copy was `#a3aeab` on `#0c1110` in Inter 17px. It passed contrast on paper,
but it read as grey-on-black, and the type overall felt plain.

**Palette:** a warm off-white canvas, white cards, green-black ink, and the
two brand accents deepened until they are safe as text. The old peach and mint
were ≈2:1 on a light ground. Tokens, hex values and measured ratios are in
[ARCHITECTURE.md §1.1](./ARCHITECTURE.md#11-theme-tokens) and at the top of
`tailwind.config.cjs`. Body text is 9.5:1, muted text 5.8:1, and the accents
are 4.7:1 or better on every surface they sit on. The hero editor window stays
dark on purpose and keeps the old syntax colours (`code.*`).

**Type:** Archivo Expanded → **Plus Jakarta Sans** 600–800 for headings, nav
and buttons, with tightened tracking. **Inter** stays for body copy (it was
never the problem; colour and size were), now at 16/17px with a 1.75 line
height through `styles.bodyText`. JetBrains Mono stays for labels and code.
Archivo is no longer loaded.

**Components (same structure and behaviour):**

- Cards: white on the canvas, hairline border, `shadow-card` → `shadow-lift`
  on hover. Non-link cards lost their misleading `cursor-pointer`.
- Navbar: active section is marked by an underline as well as colour. "Hire me"
  is a solid ink pill. The desktop links now start at `md` instead of `sm`,
  because Jakarta sets wider and five links crowded a 640px bar.
- Mobile menu: the hamburger was an `<img>` of a **white** SVG (invisible on
  light) with an `onClick`, so no keyboard could reach it. It is now a
  `<button>` with inline `currentColor` icons, `aria-expanded` and
  `aria-controls`, and the drawer gained a "Hire me" row.
- Hero: the role line sits in a pill with a fixed `23ch` minimum width, so the
  typewriter no longer resizes it. The code window now enters from below
  instead of from the right (§6 overflow rule).
- Timeline: white cards, white logo discs (the logos are on light
  backgrounds), and a 2px rail. The date is no longer at 70% opacity.
  Summary and company lines are `div`s, because the library's
  `.vertical-timeline-element-content p` rule had been silently overriding
  their Tailwind sizes.
- Contact form: fields have a visible 3:1 border and 16px text, so iOS no
  longer zooms on focus. They drop `outline-none` for an ember focus ring.
  Labels are sentence case.
- One global `:focus-visible` ember ring. `SocialIcons` heading `h1` → `p` (the
  page had two h1s). The `*` font-family rule is gone, because it forced Inter
  onto the children of every `font-mono` element.

**Gotcha:** Tailwind 3.2's opacity scale has no `15`, so `ring-ember/15` was
silently never generated and the ring fell back to Tailwind's default blue.
Stick to 5/10/20/25/30/40/50/60/70/75/80/90/95, or use an arbitrary `/[.15]`.

**Verified:** built site at 320/360/390/430/640/768/1024/1280/1440, scrolled
top to bottom: `scrollWidth` never exceeds the viewport. Tests 20/20.

**Follow-up the same day: one typeface for everything.** Inter is gone.
Plus Jakarta Sans now sets all headings, paragraphs, buttons, labels and
chips, loaded as one variable file (400..800). Body text is weight 450. Card
titles are 800, buttons 700. JetBrains Mono had spread into skill bullets,
tech chips, row captions, status messages and the "load more" button. It is
now back to the terminal accents only (logo, `// eyebrows`, hero pill, code
window, URLs). Captions such as "the core stack:" became uppercase
`styles.label`, and `load_more()` became "Load more projects". Re-verified:
no overflow at 320/390/768, tests 20/20.

**Not changed:** `public/og.png` and `favicon.svg` still use the dark palette.
The favicon reads fine on light tabs. The OG card should be re-rendered to match.

---

## Done 2026-09-24

### [x] `Web page caused context loss and was blocked` back again, real cause found **P1**

Came back in dev on `localhost:5173` despite both earlier fixes, with a
`WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost` in the log.

**Root cause: real GPU context losses, not our `loseContext()` calls.** Read
against the Chromium source:

- The message is Blink's (`webgl_rendering_context_base.cc`), raised when the
  browser process has the page's **host** on its 3D block list.
- `gpu_data_manager_impl_private.cc` adds a host only on a _real_ loss (driver
  reset, GPU process crash, GPU OOM, a GPU switch). 2+ in **2 minutes** blocks
  the host all tabs, **across reloads** until they expire.
- `WEBGL_lose_context.loseContext()` is a synthetic loss that never reaches the
  browser process. Blink prints the `CONTEXT_LOST_WEBGL: loseContext` line only
  for real losses, so that log line was the GPU dropping us.

So the 2026-09-08 diagnosis was wrong, and the `forceContextLoss()` no-op
added after it made things worse. Every discarded context kept its buffers
until GC, and in dev every HMR remount left another behind. On this machine
(Intel Iris Plus 650, 1.5 GB shared) that is the GPU memory pressure that
causes real resets.

**Fix:**

1. `utils/webgl.js` removed `preventForcedContextLoss()`; r3f tears down
   normally again. The probe is now `probeWebGL()` → `"ok" | "blocked" |
"unsupported"`, and never caches `"blocked"`.
2. `SafeCanvas.jsx` `powerPreference: "low-power"` (r3f defaulted to
   high-performance, which switches GPUs on dual-GPU Macs). New reason
   `"blocked"`: waiting canvases stand down and remount after 125 s (Chrome's
   2 min + margin), at most 3 times per visit. A failed creation no longer
   latches the canvas into `"error"` for good.
3. `Stars.jsx` `antialias: false`. Full-viewport 4× MSAA was ~90 MB per
   starfield at 1.5 dpr, twice over.
4. `Earth.jsx` dropped `shadows` (unlit model, no lights), dpr capped at 1.5,
   "3D is paused while the graphics driver recovers." for `"blocked"`.
5. Tests: `webgl.test.js` now covers the probe's three answers;
   `canvas.test.jsx` covers the blocked fallback.

Full write-up in [ARCHITECTURE.md §3.2](./ARCHITECTURE.md#32-web-page-caused-context-loss-and-was-blocked).

**If it's blocked right now:** wait 2 minutes or restart Chrome a page
reload alone won't clear it. `chrome://gpu` lists recent GPU resets.

**Verify:** `npm run dev`, save `Stars.jsx` a dozen times to force HMR
remounts, scroll hero → contact → hero. No `loseContext: context lost`, no
`blocked` lines. If a block does happen, the globe shows the paused message
and comes back on its own about two minutes later.

---

## Done 2026-09-09

### [x] Whole site rendered to the left with a dead strip down the right, on mobile **P1**

Every section, on every phone width: content laid out at screen width inside a
wider page, a band of empty background on the right, and the navbar's hamburger
pushed into it.

**Root cause: `react-vertical-timeline-component` reveals each card from
`translateX(100px)`.** Its `cd-bounce-2-inverse` keyframe starts a hundred
pixels right of where the card lands, and the library's own
`@media (max-width: 1169px)` rule routes _every_ mobile viewport through it. A
phone browser widens the layout viewport to fit horizontal overflow and does
not narrow it again, so one card reveal in the Experience section resizes the
page for the rest of the visit which is why a timeline bug looked like a
site-wide layout bug.

Measured on the built site, 390px viewport, sampling `scrollWidth` through a
full scroll: **457px** as shipped (67px of overflow, first seen at the
timeline), **390px** with that one keyframe disabled zero overflow anywhere
else on the page.

Two smaller offenders sat underneath it, both biting below ~380px:

1. `Clients.jsx` the card header put a `whitespace-nowrap` kind chip beside an
   org name in 28px expanded Archivo, in a row that could not wrap. That gave
   the page a hard 380px minimum width: at 320px the chip ran out of the card.
2. Card padding (`p-8`/`p-7`) left the contact fields 208px of width at 320px.

**Fix:**

1. `index.css` `overflow-x: clip` (with `hidden` as the fallback) on
   `html, body`, so no entry animation can widen the layout viewport again.
2. `index.css` the timeline's mobile reveal keyframe swapped for a vertical
   one (`cd-bounce-2-up`), overriding `animation-name` only so the library keeps
   its own timing. Also switched off under `prefers-reduced-motion`, which
   `<MotionConfig reducedMotion="user">` cannot reach because it is library CSS.
3. `Clients.jsx` the header row wraps, so the chip drops under the org name
   instead of forcing a minimum width.
4. Mobile padding step-downs on the client, contact, stat, skill and feature
   cards, and on the hero code window (which no longer scrolls sideways inside
   itself at 320px).
5. `index.css` the timeline rail on phones: `width: 100%` instead of 95%, a
   32px icon on a line at `left: 14px`, and 48px of content margin instead of
   60px. At 320px that took the bullet column from ~146px of text to ~175px.
   Scoped to ≤767px so tablets and the two-column desktop layout are untouched.

**Verify:** load the built site at 320/360/375/390/412/430 and scroll to the
bottom with `document.documentElement.scrollWidth` logged it should never
exceed the viewport width. The Experience cards should fade up, not slide in
from the right.

---

## Done 2026-09-08

### [x] `Web page caused context loss and was blocked` WebGL dead after scrolling **P1**

> **Superseded 2026-09-24.** The cause below is wrong. Chrome only counts
> _real_ GPU losses toward this block, not page-initiated `loseContext()`. See
> the 2026-09-24 entry.

```
THREE.WebGLRenderer: A WebGL context could not be created.
Reason:  Web page caused context loss and was blocked      ×9
THREE.WebGLRenderer: Error creating WebGL context.
```

**Root cause: the app was deliberately forcing context loss, and Chrome blocks a
page that does that too often.** Chrome counts every call to the
`WEBGL_lose_context` extension and, past a threshold, refuses the page any
further context until a reload. Two places did it:

1. `utils/webgl.js` the capability probe called `loseContext()` on itself.
2. `Stars.jsx` unmounted its canvas 1.5 s after it scrolled off screen, and
   r3f's unmount path runs `forceContextLoss()`. One guilty loss per scroll past
   the hero or contact section.

Both were guarding against Chrome's ~16 _live-context_ cap, which a page with
three canvases never approaches trading a limit that didn't apply for the one
that can't be recovered from. `SafeCanvas`'s rebuild-on-failure loop then made
it terminal, since each rebuild unmounts a canvas and spends another loss.

**Fix:** canvases are created once and never unmounted; off screen they set
`frameloop="never"`. `ResumeOnVisible` calls `invalidate()` on the way back in,
because r3f's global rAF loop cancels itself when no root wants a frame and
`setFrameloop()` does not restart it. The probe no longer calls `loseContext()`.
`SafeCanvas` detects `webglcontextcreationerror` in the capture phase and makes
every canvas on the page stand down instead of retrying into the block. Full
walkthrough in [ARCHITECTURE.md §3.2](./ARCHITECTURE.md#32-why-contexts-were-being-blocked-the-second-worse-root-cause).

**Measured** on the built site, 8 scroll cycles (Playwright, instrumented
`loseContext`): before **10 forced losses / 12 contexts created**; after
**0 / 4**, starfield still animating.

**Verify:** scroll hero → contact → hero half a dozen times with the console
open. No `Context Lost` lines, no `blocked` lines, stars still rotating.

### [x] Project screenshots converted to WebP **P2**

Four new projects (Psychic Vision, Mi Vidente, Psychic Txt Advisor Funnel, Reset
Hypnosis) came in as full-page PNGs totalling 6.0 MB. Converted the whole project
set to WebP (q80, ≤1200 px wide): **6.68 MB → 0.42 MB**, and deleted the
originals. New screenshots must be converted before they go in `src/assets/`.

---

## Done 2026-09-07

### [x] Browserslist / caniuse-lite out of date **P2**

Every build printed:

```
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
```

Autoprefixer uses `caniuse-lite` to decide which vendor prefixes to emit, so a
stale copy means prefixes for browsers nobody runs and, worse, missing prefixes
for ones people do.

**Fix:** ran `npx update-browserslist-db@latest` `1.0.30001642` → `1.0.30001810`.
Only `package-lock.json` changed; no target-browser changes, so the CSS output is
identical. Re-run it every few months (or whenever the warning returns); it is a
lockfile refresh, not a dependency upgrade.

### [x] `CONTEXT_LOST_WEBGL` / "Error creating WebGL context" crash **P1**

Symptoms in the console:

```
WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
THREE.WebGLRenderer: Context Lost.
The above error occurred in the <ForwardRef(Canvas)> component ...
Consider adding an error boundary to your tree ...
Uncaught Error: Error creating WebGL context.
```

**Root cause: `@react-three/fiber` 8.11.5 does not survive React 18 `StrictMode`.**
`CanvasImpl` keeps the renderer root in a ref, and `unmountComponentAtNode` runs
`forceContextLoss()` from inside a `setTimeout(…, 500)`. StrictMode's simulated
unmount queues that teardown, the simulated remount then reuses the _same live
renderer_ (the ref survived), and half a second later the queued teardown kills
the context of a canvas that is actively rendering. Full walkthrough with line
numbers in [ARCHITECTURE.md §3.1](./ARCHITECTURE.md#31-why-the-context-was-being-lost-the-root-cause).

**Fix:**

1. `main.jsx` dropped `<React.StrictMode>`, with a comment explaining why.
   It is a dev-only wrapper, so production output is unchanged.
2. `src/components/ErrorBoundary.jsx` the boundary React kept asking for.
   Catches renderer-construction throws _and_ model-load failures (r3f's inner
   boundary rethrows those outside `<Canvas>`), instead of unmounting `<App>`.
3. `src/components/canvas/SafeCanvas.jsx` the only `<Canvas>` the app uses.
   Handles `webglcontextlost` (with `preventDefault()`, without which the browser
   never fires `webglcontextrestored`), rebuilds on restore, auto-retries twice,
   then shows a fallback. Defaults `preserveDrawingBuffer: false` and
   `failIfMajorPerformanceCaveat: false`.
4. `src/utils/webgl.js` `isWebGLAvailable()` probe only.
5. `Stars.jsx` unmounts itself 1.5 s after leaving the viewport (debounced), so
   in practice only one starfield holds a context.

> **Superseded 2026-09-08.** Point 5 was wrong and caused the block described in
> the 2026-09-08 entry above: every one of those unmounts spends a forced context
> loss. Canvases are now kept mounted and paused. The retry count in point 3 is
> also down from two to one.

> **Correction worth recording:** the first pass at this added a
> `releaseRenderer()` (`forceContextLoss()` + `dispose()`) to `SafeCanvas`'s
> unmount cleanup, on the theory that contexts were leaking. That made things
> strictly worse it force-lost the context on a canvas element StrictMode was
> about to reuse, and a canvas whose context was explicitly lost keeps handing
> back that same dead context from `getContext()`. Every mount then failed with
> `Error creating WebGL context`. r3f already owns teardown; don't duplicate it.

### [x] Graceful handling when the 3D model fails to load **P2**

A 404 on `/planet/scene.gltf`, a corrupt file or a dropped connection makes
`useGLTF` reject. r3f catches that on its inner boundary and rethrows it outside
`<Canvas>`, so it now lands on `SafeCanvas`'s boundary like any other failure.

`SafeCanvas` distinguishes three reasons `unsupported` (no WebGL at all),
`lost` (context gone for good) and `error` (anything thrown out of the canvas
tree, including a failed model) and `fallback` may be a function
`({ reason, retry }) => node`. `Earth.jsx` uses it to show a styled disc with a
reason-specific message plus a "try again" link, hidden for `unsupported` where
retrying cannot help. Its `onRetry` calls `useGLTF.clear(MODEL_PATH)`, because
drei caches the **rejected** promise without clearing it, a retry fails
instantly with the same error instead of refetching.

**Verify:** rename `public/planet/scene.gltf`, reload the contact section, and
the disc should read "The 3D model couldn't be loaded."; rename it back and
"try again" should bring the globe in without a page reload.

---

## Open P1

### [ ] Contact form reports success when EmailJS fails

[`Contact.jsx`](../src/components/Contact.jsx) sets
`status: { type: "success" }` in **both** the `try` and the `catch`. A visitor
whose message never sent is told "Message sent thank you!" and the form is
cleared, so the message is gone with no way to recover it. Show a real failure
state with a mailto fallback, and keep the field values so nothing is lost.

### [ ] Stray credential-shaped comment in `Contact.jsx`

Line ~12 carries a bare `// 7lWL2GUOhoPuvPumyTuPQ`. If that is an EmailJS
private key or any other secret, rotate it and delete the line. Even if it is
inert, it should not sit in a public repo.

### [ ] Move EmailJS IDs to env vars

`service_9f24tvg`, `template_28wreop` and the public key are inline in
`Contact.jsx`. The public key is public by design, but env vars
(`import.meta.env.VITE_EMAILJS_*`, `.env` is already gitignored) make rotating
and swapping between prod/test templates a config change rather than a code edit.

---

## Open P2

### [ ] Placeholder testimonials

`testimonials` in `constants/index.js` uses invented names (Sara Lee, Chris
Brown, Lisa Wang) with `randomuser.me` stock photos. Real quotes from the
Sysreforms / Optymyze / freelance work would carry far more weight and stock
faces on a testimonial card read as fake to anyone who has seen randomuser.me.

### [ ] Earth may not actually auto-rotate

`Earth.jsx` combines `frameloop='demand'` with drei's `<OrbitControls autoRotate>`.
Under `demand`, frames render only when something calls `invalidate()`, and
`autoRotate` has nothing to trigger it so the globe may sit still until the
user drags it. Either switch that canvas to `frameloop='always'` (it already
unmounts/idles when off screen) or drive `invalidate()` from a `useFrame` tick.

### [ ] Typos in public-facing content

In `constants/index.js`: `"Immigra Conslutant"` → _Immigra Consultants_,
`"boostrap"` → _bootstrap_ (appears ~8 times as a tech tag),
`"Sysreform's International"` → _Sysreforms International_. These render on the
project cards where visitors read them.

### [ ] Three.js chunk is 740 kB (202 kB gzip)

The build warns about it. It is already lazy nothing downloads until a canvas
is needed so this is not an LCP problem, but a `manualChunks` split of
three / fiber / drei would let the starfield load without pulling in everything
the Earth model needs.

---

## Open P3

- [ ] Re-render `public/og.png` in the light palette so link previews match the
      site (it is still the dark design).
- [ ] `<Navbar>` has no active-link highlight tied to scroll position beyond the
      click handler; an IntersectionObserver-driven version would track properly.
- [ ] No `prefers-reduced-motion` handling. The hero letter-stagger, timeline
      reveals and rotating starfield all animate regardless. A media-query guard
      that drops to `initial={false}` would be a real accessibility win.
- [ ] Add `og:image` / Twitter card meta to `index.html` so shared links preview.
- [ ] `dist/` exists in the working tree; it is gitignored and untracked, so it is
      only local clutter safe to delete between builds.
- [ ] Revisit `<React.StrictMode>` after upgrading to `@react-three/fiber` 9 +
      React 19, which fixes the remount handling that forced us to drop it (§3.1).
- [ ] No test setup at all. Even a smoke test that renders `<App />` with WebGL
      stubbed would catch the class of crash fixed above.

---

## Routine maintenance

| Cadence          | Task                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Every few months | `npx update-browserslist-db@latest` when the build warns                                                                                       |
| Per new project  | Add to `projects` in `constants/index.js`, screenshot in `src/assets/`, export from `src/assets/index.js`, then update §5.2 of ARCHITECTURE.md |
| Per new role     | Add to `experiences`; keep dates absolute                                                                                                      |
| Before deploy    | `npm run build && npm run preview`, then check the console for WebGL / hydration warnings                                                      |
