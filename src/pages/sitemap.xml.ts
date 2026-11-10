import type { APIRoute } from 'astro';
import { classes } from '../data/registry.ts';
import { LEVELS, classPath, levelHref, specPath } from '../lib/guide.ts';

// Every page of the site, for search engines. Generated from the class
// registry, so a new class or spec is listed without touching this file.
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? 'https://azerothtrail.com/').replace(/\/$/, '');
  const paths: { path: string; lastmod?: string }[] = [{ path: '/' }, { path: '/zones/' }, { path: '/status/' }];
  for (const g of classes) {
    const lastmod = g.lastVerified;
    for (const page of ['', 'route', 'quests', 'specs', 'sources']) paths.push({ path: classPath(g, page), lastmod });
    for (const s of g.specs) paths.push({ path: specPath(g, s), lastmod }, { path: specPath(g, s, true), lastmod });
    for (const n of LEVELS) paths.push({ path: levelHref(g, n), lastmod });
  }
  const urls = paths.map((p) => `  <url><loc>${base}${p.path}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
