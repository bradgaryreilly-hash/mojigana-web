import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'

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

/**
 * After write: embed the IIFE in index.html and delete the separate .js file.
 * Avoids a second network request to /assets/*.js (often blocked on mobile for github.io).
 */
function inlineIifeBundle() {
  let outDir = 'dist'
  let base = '/'
  return {
    name: 'inline-iife-bundle',
    configResolved(config) {
      outDir = config.build.outDir
      base = config.base.endsWith('/') ? config.base : `${config.base}/`
    },
    async closeBundle() {
      const htmlPath = path.join(outDir, 'index.html')
      let html
      try {
        html = await fs.readFile(htmlPath, 'utf-8')
      } catch {
        return
      }
      if (!html.includes('<meta name="mojigana-inline-js"')) {
        const withMeta = html.replace(
          /<\/title>[\s\r\n]*<\/head>/i,
          '</title>\n    <meta name="mojigana-inline-js" content="1" />\n  </head>',
        )
        if (withMeta === html) {
          throw new Error(
            '[mojigana] Could not inject mojigana-inline-js meta (title/head pattern missing).',
          )
        }
        html = withMeta
      }
      const re =
        /<script(?:\s+defer)?\s+src="([^"]+\/assets\/[^"]+\.js)"\s*>\s*<\/script>/i
      const m = html.match(re)
      if (!m) return
      const webPath = m[1]
      let rel = webPath.startsWith(base) ? webPath.slice(base.length) : webPath
      rel = rel.replace(/^\//, '')
      const jsPath = path.join(outDir, rel)
      let js
      try {
        js = await fs.readFile(jsPath, 'utf-8')
      } catch {
        return
      }
      const safe = js.replace(/<\/script/gi, '<\\/script')
      // Replacement must be a function: minified JS contains `$&`, `$1`, etc.; a string
      // replacement would interpret `$` and corrupt the bundle (and inject </script>).
      html = html.replace(re, () => `<script>${safe}</script>`)
      await fs.writeFile(htmlPath, html, 'utf-8')
      try {
        await fs.unlink(jsPath)
      } catch {
        /* ignore */
      }
    },
  }
}

// https://vite.dev/config/
// GitHub project Pages URLs are /repo-name/; set VITE_PAGES_BASE in CI (see deploy workflow).
// When using a custom domain at the site root, omit that env so base stays '/'.
export default defineConfig({
  plugins: [react(), productionGhPagesHtml(), inlineIifeBundle()],
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
