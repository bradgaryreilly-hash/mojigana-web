import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages + WebKit: strip crossorigin; move script to end of body; use a
 * classic (non-module) script tag when the bundle is IIFE (no type="module").
 */
function productionGhPagesHtml() {
  return {
    name: 'production-gh-pages-html',
    transformIndexHtml(html) {
      let h = html.replace(/\s+crossorigin(?:="[^"]*"|)/g, '')
      const re =
        /<script([^>]*type="module"[^>]*)src="([^"]+)"([^>]*)>\s*<\/script>/
      const m = h.match(re)
      if (m) {
        const full = m[0]
        const src = m[2]
        h = h.replace(full, '')
        const tag = `<script defer src="${src}"></script>`
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
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'MojiganaApp',
      },
    },
  },
})
