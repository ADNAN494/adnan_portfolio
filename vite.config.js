import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Inlines the built CSS into index.html so the static hero shell can paint
// without waiting for a render-blocking stylesheet request.
const inlineCss = () => ({
  name: 'inline-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const html = bundle['index.html']
    if (!html) return
    for (const [name, asset] of Object.entries(bundle)) {
      if (!name.endsWith('.css')) continue
      const linkTag = new RegExp(`<link[^>]+href="/${name.replace(/\./g, '\\.')}"[^>]*>`)
      if (linkTag.test(html.source)) {
        html.source = html.source.replace(linkTag, `<style>${asset.source}</style>`)
        delete bundle[name]
      }
    }
  },
})

// In dev, the inlineCss plugin doesn't run and Tailwind CSS is injected by JS,
// so the static hero shell in index.html would flash unstyled before the JS
// loads. React replaces #root on mount anyway, so we just empty the shell in
// dev — the page shows a blank dark background until React renders (no FOUC).
const emptyShellInDev = () => ({
  name: 'empty-shell-in-dev',
  apply: 'serve',
  transformIndexHtml(html) {
    const start = html.indexOf('<div id="root">')
    const script = html.indexOf('<script type="module"', start)
    if (start === -1 || script === -1) return html
    return html.slice(0, start) + '<div id="root"></div>\n    ' + html.slice(script)
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Fast Refresh injects a preamble into index.html that only exists when
    // Vite is actually serving a page. Under Vitest there is no page, so
    // plugin-react v3 aborts every component module with "can't detect
    // preamble" — switch it off for test runs only.
    react({ fastRefresh: !process.env.VITEST }),
    inlineCss(),
    emptyShellInDev(),
  ],
  build: {
    // Three.js and its React bindings used to land in ONE 741 kB async chunk
    // (202 kB gzip) shared by both canvases, alongside framer-motion sitting in
    // the main bundle. Splitting them by owner:
    //
    //   three   606 kB / 159 gzip   the renderer, changes only on upgrade
    //   r3f     131 kB /  43 gzip   fiber + the drei parts both canvases use
    //   Earth    95 kB /  29 gzip   GLTF loader + OrbitControls — contact only
    //   Stars     7 kB /   3 gzip   points material
    //   motion  102 kB /  34 gzip   framer-motion, out of the main bundle
    //
    // Two things come of it. The starfield no longer drags the GLTF loader
    // along for the ride — Earth's 29 kB gzip is fetched only if a visitor
    // scrolls to the contact section. And the main bundle drops from 100 kB
    // gzip to 66 kB: the same bytes still load at startup, but they now sit in
    // a file that a content edit doesn't invalidate, so returning visitors keep
    // the cached copy.
    //
    // Deliberately NOT giving drei a chunk of its own. Rollup already puts
    // each canvas's own drei imports in that canvas's chunk; grouping them
    // would put the GLTF loader in front of everyone who only sees the stars,
    // which is the opposite of the point.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/node_modules/three/")) return "three";
          if (id.includes("@react-three/fiber")) return "r3f";
          if (id.includes("framer-motion")) return "motion";
        },
      },
    },
    // three.js alone is 607 kB, so the default 500 kB warning fires on every
    // build with nothing left to act on — it is already isolated and lazy. The
    // limit sits just above it rather than being switched off, so the warning
    // still returns if that chunk starts growing.
    chunkSizeWarningLimit: 650,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
  },
})
