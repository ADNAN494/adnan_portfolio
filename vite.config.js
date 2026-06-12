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
  plugins: [react(), inlineCss(), emptyShellInDev()],
})
