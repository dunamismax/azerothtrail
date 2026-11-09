import { request } from 'node:http';
import { defineConfig } from 'astro/config';

// `npm run dev` only: forward /api/* to the status service (node server/main.ts
// on 4315), streaming responses so Server-Sent Events work. In production
// Caddy does this.
const statusApiProxy = {
  name: 'status-api-proxy',
  hooks: {
    'astro:server:setup': ({ server }) => {
      const handle = (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        const upstream = request({ host: '127.0.0.1', port: 4315, path: req.url, method: req.method, headers: req.headers }, (up) => {
          res.writeHead(up.statusCode ?? 502, up.headers);
          up.pipe(res);
        });
        upstream.on('error', () => {
          if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json' });
          res.end('{"error":"status service not running (node server/main.ts)"}');
        });
        req.pipe(upstream);
      };
      // First in the stack, ahead of Astro's trailing-slash check and page
      // handler, which it inserts after this hook runs.
      server.httpServer?.once('listening', () => server.middlewares.stack.unshift({ route: '', handle }));
    },
  },
};

// Static output only: Caddy serves dist/ from an immutable release directory.
// Nothing is inlined, so the site works under a strict `script-src 'self'`
// and `style-src 'self'` Content-Security-Policy.
export default defineConfig({
  site: 'https://azerothtrail.com',
  output: 'static',
  integrations: [statusApiProxy],
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
