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
      let h = html.replace(/<script\b([^>]*)>/gi, (tag, attrs) => {
        if (/googlesyndication\.com/i.test(attrs)) return tag
        return `<script${attrs.replace(/\s+crossorigin(?:="[^"]*")?/g, '')}>`
      })
      h = h.replace(/(<link\b[^>]*)\s+crossorigin(?:="[^"]*")?/gi, '$1')
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
      if (m) {
        const webPath = m[1]
        let rel = webPath.startsWith(base) ? webPath.slice(base.length) : webPath
        rel = rel.replace(/^\//, '')
        const jsPath = path.join(outDir, rel)
        try {
          const js = await fs.readFile(jsPath, 'utf-8')
          const safe = js.replace(/<\/script/gi, '<\\/script')
          // Replacement must be a function: minified JS contains `$&`, `$1`, etc.; a string
          // replacement would interpret `$` and corrupt the bundle (and inject </script>).
          html = html.replace(re, () => `<script>${safe}</script>`)
          await fs.unlink(jsPath)
        } catch {
          /* keep the external script tag if the bundle file is missing */
        }
      }
      await fs.writeFile(htmlPath, html, 'utf-8')
      await copyRouteHtml(outDir, html)
    },
  }
}

/**
 * GitHub Pages has no SPA fallback. Copy the built index to each real route
 * (and 404.html) so mojigana.com/privacy and the other pages load directly.
 * Keep folder names in sync with STATIC_ROUTE_DIRS in src/lib/sitePaths.js.
 */
async function copyRouteHtml(outDir, html) {
  const routes = ['flashcards', 'about', 'contact', 'privacy']
  for (const route of routes) {
    const dir = path.join(outDir, route)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'index.html'), html, 'utf-8')
  }
  await fs.writeFile(path.join(outDir, '404.html'), html, 'utf-8')
}

// https://vite.dev/config/
// mojigana.com is served at the domain root. A /mojigana-web/ base prefixes
// public files (logo, favicon) and those URLs 404 on the custom domain.
export default defineConfig({
  plugins: [react(), productionGhPagesHtml(), inlineIifeBundle()],
  base: '/',
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
