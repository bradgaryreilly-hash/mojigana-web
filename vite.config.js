import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
// GitHub project Pages URLs are /repo-name/; set VITE_PAGES_BASE in CI (see deploy workflow).
// When using a custom domain at the site root, omit that env so base stays '/'.
export default defineConfig({
  plugins: [
    react(),
    // Older iOS Safari/WebKit often shows a blank white page if the modern bundle is too new.
    legacy({
      targets: ['iOS >= 12', 'Safari >= 12'],
      modernPolyfills: true,
    }),
  ],
  base: process.env.VITE_PAGES_BASE || '/',
})
