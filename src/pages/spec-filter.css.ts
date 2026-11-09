import type { APIRoute } from 'astro';
import { classes } from '../data/registry.ts';

// Hides content for specs other than the chosen one, before the app script
// runs. public/boot.js sets <html data-spec> from the saved choice (or the
// class default); with no attribute (JavaScript off) every spec stays visible.
export const GET: APIRoute = () => {
  const slugs = [...new Set(classes.flatMap((c) => c.specs.map((s) => s.slug)))].sort();
  const rules = slugs.map((s) => `html[data-spec="${s}"] [data-spec]:not([data-spec~="${s}"]) { display: none !important; }`);
  const labels = 'html[data-spec] .spec-group-name { display: none; }';
  return new Response(`/* Generated from the class registry. */\n${rules.join('\n')}\n${labels}\n`, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
