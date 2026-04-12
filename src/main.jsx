/**
 * Tiny entry: the real app loads via dynamic import so failures (blocked script,
 * bad chunk, import error) surface instead of leaving "Loading…" forever.
 *
 * Global styles load here (static import) so index.html gets a normal stylesheet
 * link — not a second-phase preload tied to the async chunk (more reliable on iOS).
 */
import './index.css'

const rootEl = document.getElementById('root')

function showFatal(message) {
  if (!rootEl) return
  rootEl.replaceChildren()
  const wrap = document.createElement('div')
  wrap.style.cssText =
    'padding:24px;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;min-height:100vh;box-sizing:border-box'
  const title = document.createElement('p')
  title.style.cssText = 'font-weight:700;margin:0 0 8px'
  title.textContent = 'Could not load app'
  const pre = document.createElement('pre')
  pre.style.cssText = 'white-space:pre-wrap;font-size:12px;margin:0;opacity:.9'
  pre.textContent = String(message)
  wrap.append(title, pre)
  rootEl.append(wrap)
}

let settled = false
const tid = setTimeout(() => {
  if (!settled && document.getElementById('mojigana-boot')) {
    showFatal(
      'Timed out after 20s. Try Wi‑Fi, disable content blockers for this site, or open in a private tab.',
    )
  }
}, 20000)

import('./app-entry.jsx')
  .then(() => {
    settled = true
    clearTimeout(tid)
  })
  .catch((err) => {
    settled = true
    clearTimeout(tid)
    console.error(err)
    showFatal(err?.message || err)
  })
