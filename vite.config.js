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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inlineCss()],
})
