// Smoke test for a built site, either a dist/ directory or a live URL:
//   node scripts/smoke.ts dist
//   node scripts/smoke.ts https://azerothtrail.com [expected-commit]
// Checks every page and level, internal links and #anchors, assets,
// bracket links, talent rows, and (for URLs) TLS, headers and the revision.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { classes } from '../src/data/registry.ts';
import { LEVELS, bracketFor, expandBuild } from '../src/lib/guide.ts';

const target = process.argv[2] ?? 'dist';
const expectedCommit = process.argv[3];
const remote = /^https?:\/\//.test(target);
const base = target.replace(/\/$/, '');
const problems: string[] = [];
const fail = (m: string) => problems.push(m);

interface Got {
  status: number;
  type: string;
  body: Buffer;
  headers: Headers | null;
}

const cache = new Map<string, Got>();

async function get(path: string): Promise<Got> {
  const hit = cache.get(path);
  if (hit) return hit;
  let got: Got;
  if (remote) {
    const res = await fetch(`${base}${path}`, { redirect: 'manual' });
    got = { status: res.status, type: res.headers.get('content-type') ?? '', body: Buffer.from(await res.arrayBuffer()), headers: res.headers };
  } else {
    let file = join(base, decodeURIComponent(path));
    if (path.endsWith('/')) file = join(file, 'index.html');
    if (existsSync(file) && statSync(file).isFile()) got = { status: 200, type: '', body: readFileSync(file), headers: null };
    else got = { status: 404, type: '', body: Buffer.alloc(0), headers: null };
  }
  cache.set(path, got);
  return got;
}

const ids = (html: string) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const hrefs = (html: string) => [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1] ?? '');

const pages: string[] = ['/', '/404.html'];
for (const g of classes) {
  pages.push(`/${g.id}/`, `/${g.id}/route/`, `/${g.id}/quests/`, `/${g.id}/${g.leveling.slug}/`, `/${g.id}/${g.endgame.slug}/`, `/${g.id}/sources/`);
  for (const n of LEVELS) pages.push(`/${g.id}/level/${n}/`);
}

const html = new Map<string, string>();
for (const p of pages) {
  const r = await get(p);
  if (r.status !== 200) { fail(`${p}: HTTP ${r.status}`); continue; }
  if (remote && !r.type.startsWith('text/html')) fail(`${p}: content-type ${r.type}`);
  const text = r.body.toString('utf8');
  html.set(p, text);
  if (/<script(?![^>]*\bsrc=)[^>]*>/.test(text)) fail(`${p}: inline <script>`);
  if (/<style[\s>]/.test(text) || /\sstyle="/.test(text) || /\son[a-z]+="/.test(text)) fail(`${p}: inline style or handler`);
  if (!/<title>[^<]+<\/title>/.test(text)) fail(`${p}: missing <title>`);
  if (!text.includes('name="viewport"')) fail(`${p}: missing viewport`);
}

// Internal links and anchors.
const assets = new Set<string>();
for (const [p, text] of html) {
  for (const h of hrefs(text)) {
    if (/^(https?:|mailto:)/.test(h) || h === '#') continue;
    const [pathPart, hash] = h.split('#');
    const path = pathPart === '' ? p : pathPart ?? '';
    if (!path.startsWith('/')) { fail(`${p}: relative link ${h}`); continue; }
    if (/\.(css|js|svg|txt)$/.test(path)) { assets.add(path); continue; }
    const r = await get(path);
    if (r.status !== 200) { fail(`${p}: broken link ${h} (${r.status})`); continue; }
    if (hash) {
      const targetHtml = html.get(path) ?? r.body.toString('utf8');
      if (!ids(targetHtml).has(hash)) fail(`${p}: missing anchor ${h}`);
    }
  }
}
for (const a of assets) {
  const r = await get(a);
  if (r.status !== 200) { fail(`asset ${a}: HTTP ${r.status}`); continue; }
  if (remote) {
    const want = a.endsWith('.css') ? 'text/css' : a.endsWith('.js') ? 'javascript' : a.endsWith('.svg') ? 'image/svg+xml' : 'text/plain';
    if (!r.type.includes(want)) fail(`asset ${a}: content-type ${r.type}`);
  }
}

for (const g of classes) {
  // Home: one panel per level; route: every bracket anchor; level pages: right bracket.
  const home = html.get(`/${g.id}/`) ?? '';
  const panels = [...home.matchAll(/data-level-panel="(\d+)"/g)].map((m) => Number(m[1]));
  if (JSON.stringify(panels) !== JSON.stringify(LEVELS)) fail(`/${g.id}/: panels ${panels.length}`);
  const route = html.get(`/${g.id}/route/`) ?? '';
  const routeIds = ids(route);
  for (const b of g.brackets) if (!routeIds.has(b.id)) fail(`route missing #${b.id}`);
  for (const n of LEVELS) {
    const page = html.get(`/${g.id}/level/${n}/`) ?? '';
    const b = bracketFor(g, n);
    if (!page.includes(`<h1>What should I do at level ${n}?</h1>`)) fail(`level ${n}: heading`);
    if (!page.includes(`href="/${g.id}/route/#${b.id}"`)) fail(`level ${n}: does not link bracket ${b.id}`);
    if (!page.includes(`data-page-level="${n}"`)) fail(`level ${n}: data-page-level`);
  }
  // Talent tables have a row per level of each build.
  for (const spec of [g.leveling, g.endgame]) {
    const page = html.get(`/${g.id}/${spec.slug}/`) ?? '';
    const pageIds = ids(page);
    for (const p of expandBuild(g, spec.build)) if (!pageIds.has(`lvl-${p.level}`)) fail(`${spec.slug}: missing row lvl-${p.level}`);
  }
}

if (remote) {
  const home = await get('/');
  const h = home.headers;
  if (!h?.get('strict-transport-security')) fail('missing HSTS');
  if (!h?.get('content-security-policy')?.includes("script-src 'self'")) fail('missing CSP');
  if (h?.get('x-content-type-options') !== 'nosniff') fail('missing nosniff');
  const missing = await get('/no-such-page/');
  if (missing.status !== 404 || !missing.body.toString().includes('Off the trail')) fail(`404 page: HTTP ${missing.status}`);
  const rev = (await get('/version.txt')).body.toString().trim();
  if (expectedCommit && rev !== expectedCommit) fail(`version.txt ${rev} != ${expectedCommit}`);
  console.log(`Live revision: ${rev}`);
} else {
  const rev = (await get('/version.txt')).body.toString().trim();
  if (!/^[0-9a-f]{40}$|^unknown$/.test(rev)) fail(`version.txt: ${rev}`);
  if (expectedCommit && rev !== expectedCommit) fail(`version.txt ${rev} != ${expectedCommit}`);
}

if (problems.length > 0) {
  console.error(`Smoke test failed for ${target} (${problems.length}):`);
  for (const p of problems.slice(0, 50)) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Smoke test passed for ${target}: ${pages.length} pages, ${assets.size} assets, all links and anchors resolve.`);
