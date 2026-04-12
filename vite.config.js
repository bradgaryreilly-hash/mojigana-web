import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub project Pages URLs are /repo-name/; set VITE_PAGES_BASE in CI (see deploy workflow).
// When using a custom domain at the site root, omit that env so base stays '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_PAGES_BASE || '/',
  build: {
    // Avoid modulepreload polyfill at top of entry; on some WebKit builds a thrown
    // error there would skip the rest of bootstrap (stuck on "Loading…").
    modulePreload: false,
  },
})
