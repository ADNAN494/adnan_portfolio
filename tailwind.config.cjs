/** @type {import('tailwindcss').Config} */
//
// Two themes, one set of class names. Every themed colour is an RGB triple in
// a CSS variable (defined in src/index.css: light on :root, dark on
// :root[data-theme="dark"]), so `bg-surface`, `text-ink/10` and friends switch
// with the theme and still take Tailwind's opacity modifiers.
//
// Measured contrast (WCAG 2.x), light / dark:
//
//               on canvas     on surface    on surface.muted
//   ink         15.4 / 17.4   16.8 / 16.6   14.5 / 16.0
//   ink.body     9.5 /  9.9   10.4 /  9.4    8.9 /  9.1
//   ink.muted    5.8 /  6.4    6.4 /  6.1    5.5 /  5.8
//   ember        5.0 /  9.2    5.5 /  8.8    4.7 /  8.5
//   pine         5.5 / 12.5    6.0 / 11.9    5.2 / 11.5
//   line.strong  3.2 /  3.2    3.5 /  3.1                (input borders, ≥3:1)
//
// Text on an ember or ink fill uses `text-canvas`: near-white on the light
// theme's burnt orange (5.0:1), near-black on the dark theme's peach (9.2:1).
// `line` is decorative and deliberately low-contrast; anything that must be
// seen to be used takes `line.strong`. `code` is not themed  the hero's editor
// window is dark in both.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        canvas: v("canvas"),
        surface: {
          DEFAULT: v("surface"),
          muted: v("surface-muted"),
        },
        line: {
          DEFAULT: v("line"),
          strong: v("line-strong"),
        },
        ink: {
          DEFAULT: v("ink"),
          body: v("ink-body"),
          muted: v("ink-muted"),
        },
        ember: {
          DEFAULT: v("ember"),
          dark: v("ember-dark"),
          soft: v("ember-soft"),
        },
        pine: {
          DEFAULT: v("pine"),
          dark: v("pine-dark"),
          soft: v("pine-soft"),
        },
        code: {
          bg: "#111a17",
          bar: "#17211e",
          text: "#a3aeab",
          key: "#f3f3f3",
          string: "#e8a76f",
          bool: "#6ee7b7",
          num: "#b4a0f8",
        },
      },
      // One family for everything a visitor reads  headings, paragraphs,
      // buttons, labels  so the page reads as one voice. Contrast comes from
      // weight and size (450 body → 800 display), not from a second face.
      // `heading` is kept as its own token so the display face can be swapped
      // on its own later. Mono is reserved for the terminal accents: the logo,
      // section eyebrows, the hero pill, the code window and URLs.
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      // Themed too: soft ink shadows on light; on dark, the old deep drop
      // shadow at rest and the old peach glow on hover.
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        float: "var(--shadow-float)",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
