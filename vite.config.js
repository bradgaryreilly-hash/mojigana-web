import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages + WebKit: strip crossorigin on same-origin tags; move the module
 * entry from <head> to the end of <body> (some Safari builds fail modules in head).
 */
function productionGhPagesHtml() {
  return {
    name: 'production-gh-pages-html',
    transformIndexHtml(html) {
      let h = html.replace(/\s+crossorigin(?:="[^"]*"|)/g, '')
      const re =
        /<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*>\s*<\/script>/
      const m = h.match(re)
      if (m) {
        const full = m[0]
        const src = m[1]
        h = h.replace(full, '')
        const tag = `<script type="module" src="${src}"></script>`
        h = h.replace(/\s*<\/body>/i, `\n    ${tag}\n  </body>`)
      }
      return h
    },
  }
}

// https://vite.dev/config/
// GitHub project Pages URLs are /repo-name/; set VITE_PAGES_BASE in CI (see deploy workflow).
// When using a custom domain at the site root, omit that env so base stays '/'.
export default defineConfig({
  plugins: [react(), productionGhPagesHtml()],
  base: process.env.VITE_PAGES_BASE || '/',
  build: {
    target: ['es2020', 'safari14'],
  },
})
