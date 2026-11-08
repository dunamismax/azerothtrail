import { defineConfig } from 'astro/config';

// Static output only: Caddy serves dist/ from an immutable release directory.
// Nothing is inlined, so the site works under a strict `script-src 'self'`
// and `style-src 'self'` Content-Security-Policy.
export default defineConfig({
  site: 'https://azerothtrail.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
