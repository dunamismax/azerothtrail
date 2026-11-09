// Tests for the status service (server/), with no network access:
//   node scripts/test-status.ts
// Blizzard, the forums and the push services are replaced by fake fetches.
import assert from 'node:assert/strict';
import { createDecipheriv, createECDH, createHmac, createPublicKey, randomBytes, verify } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { AddressInfo } from 'node:net';
import { BlizzardClient, findHash, parseRealms } from '../server/blizzard.ts';
import { isDownReport, stripHtml } from '../server/forums.ts';
import { createStatusServer } from '../server/http.ts';
import { formatDuration, StatusService, validPrefs } from '../server/service.ts';
import { applyReading, emptyState, regionState, restoreState } from '../server/tracker.ts';
import type { PushMessage, Snapshot } from '../server/types.ts';
import { b64u, encrypt, generateVapidKeys, validSubscription, Vapid } from '../server/webpush.ts';

let failed = 0;
let passed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${name}\n  ${(err as Error).stack?.split('\n').slice(0, 4).join('\n  ')}`);
  }
}

// ---- Web Push --------------------------------------------------------------

/** The receiving side of RFC 8291, written from the spec, to check our sender. */
function decrypt(body: Buffer, uaPrivate: Buffer, uaPublic: Buffer, auth: Buffer): string {
  const salt = body.subarray(0, 16);
  const rs = body.readUInt32BE(16);
  const idlen = body.readUInt8(20);
  const asPublic = body.subarray(21, 21 + idlen);
  const ct = body.subarray(21 + idlen);
  assert.ok(ct.length <= rs);
  const ecdh = createECDH('prime256v1');
  ecdh.setPrivateKey(uaPrivate);
  const secret = ecdh.computeSecret(asPublic);
  const h = (k: Buffer, d: Buffer) => createHmac('sha256', k).update(d).digest();
  const ikm = h(h(auth, secret), Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic, Buffer.from([1])]));
  const prk = h(salt, ikm);
  const cek = h(prk, Buffer.from('Content-Encoding: aes128gcm\0\x01', 'binary')).subarray(0, 16);
  const nonce = h(prk, Buffer.from('Content-Encoding: nonce\0\x01', 'binary')).subarray(0, 12);
  const d = createDecipheriv('aes-128-gcm', cek, nonce);
  d.setAuthTag(ct.subarray(ct.length - 16));
  const plain = Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]);
  let end = plain.length - 1;
  while (end > 0 && plain[end] === 0) end -= 1;
  assert.equal(plain[end], 2, 'last-record delimiter');
  return plain.subarray(0, end).toString('utf8');
}

function fakeBrowser(host = 'fcm.googleapis.com') {
  const ecdh = createECDH('prime256v1');
  ecdh.generateKeys();
  const auth = randomBytes(16);
  const endpoint = `https://${host}/fcm/send/${randomBytes(8).toString('hex')}`;
  return {
    sub: { endpoint, keys: { p256dh: b64u.encode(ecdh.getPublicKey()), auth: b64u.encode(auth) } },
    open: (body: Buffer) => JSON.parse(decrypt(body, ecdh.getPrivateKey(), ecdh.getPublicKey(), auth)) as PushMessage,
  };
}

await test('encrypt matches RFC 8291 Appendix A byte for byte', () => {
  const out = encrypt(
    b64u.decode('V2hlbiBJIGdyb3cgdXAsIEkgd2FudCB0byBiZSBhIHdhdGVybWVsb24'),
    b64u.decode('BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4'),
    b64u.decode('BTBZMqHH6r4Tts7J_aSIgg'),
    { senderPrivateKey: b64u.decode('yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw'), salt: b64u.decode('DGv6ra1nlYgDCS1FRnbzlw') },
  );
  const want = Buffer.concat([
    b64u.decode('DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8'),
    b64u.decode('8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ'),
  ]);
  assert.equal(out.toString('hex'), want.toString('hex'));
});

await test('encrypted messages decrypt with the subscriber keys', () => {
  const b = fakeBrowser();
  const msg = { title: 'Hi ✓', body: 'x'.repeat(1500), tag: 't', url: '/status/', kind: 'test', at: new Date().toISOString() };
  const body = encrypt(Buffer.from(JSON.stringify(msg)), b64u.decode(b.sub.keys.p256dh), b64u.decode(b.sub.keys.auth));
  assert.deepEqual(b.open(body), msg);
});

await test('VAPID JWT is a valid ES256 token for the push origin', () => {
  const keys = generateVapidKeys();
  const v = new Vapid(keys, 'https://example.test/status/');
  const header = v.header('https://fcm.googleapis.com/fcm/send/abc');
  const m = /^vapid t=([^,]+), k=(.+)$/.exec(header);
  assert.ok(m);
  const [h, c, s] = (m[1] ?? '').split('.');
  assert.equal(m[2], keys.publicKey);
  const claims = JSON.parse(b64u.decode(c ?? '').toString());
  assert.equal(claims.aud, 'https://fcm.googleapis.com');
  assert.equal(claims.sub, 'https://example.test/status/');
  assert.ok(claims.exp > Date.now() / 1000 && claims.exp <= Date.now() / 1000 + 24 * 3600);
  const pub = createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: keys.privateJwk.x, y: keys.privateJwk.y }, format: 'jwk' });
  assert.ok(verify('sha256', Buffer.from(`${h}.${c}`), { key: pub, dsaEncoding: 'ieee-p1363' }, b64u.decode(s ?? '')));
});

await test('only known push services are accepted', () => {
  assert.ok(validSubscription(fakeBrowser().sub));
  assert.ok(validSubscription(fakeBrowser('web.push.apple.com').sub));
  assert.ok(validSubscription(fakeBrowser('updates.push.services.mozilla.com').sub));
  assert.ok(!validSubscription(fakeBrowser('evil.example.com').sub));
  assert.ok(!validSubscription(fakeBrowser('fcm.googleapis.com.evil.com').sub));
  assert.ok(!validSubscription({ ...fakeBrowser().sub, endpoint: 'http://fcm.googleapis.com/x' }));
  assert.ok(!validSubscription({ ...fakeBrowser().sub, endpoint: 'https://127.0.0.1/x' }));
  assert.ok(!validSubscription({ endpoint: 'https://fcm.googleapis.com/x', keys: { p256dh: 'AAAA', auth: 'AAAA' } }));
});

// ---- Blizzard and forums ---------------------------------------------------

await test('finds the persisted-query hash in the status page script', () => {
  const js = 'x(t,"GetInitialRealmStatusData"),t.documentId="' + 'a'.repeat(64) + '"},1:function(e){q(t,"GetRealmStatusData"),t.documentId="' + 'b'.repeat(64) + '"}';
  assert.equal(findHash(js), 'b'.repeat(64));
  assert.equal(findHash('nothing'), null);
});

await test('parses rulesets in a stable order and rejects junk', () => {
  const r = parseRealms([
    { name: 'Roleplay', slug: 'roleplay', online: false },
    { name: 'Normal', slug: 'normal', online: true },
    { name: 'Bad', slug: '../x', online: true },
    { name: 'PvP', slug: 'pvp', online: 'yes' },
  ]);
  assert.deepEqual(r.map((x) => x.slug), ['normal', 'roleplay']);
  assert.throws(() => parseRealms([]));
});

await test('rediscovers the query hash when Blizzard rejects the old one', async () => {
  const newHash = 'c'.repeat(64);
  let queries = 0;
  const fetchImpl = (async (url: string | URL, init?: RequestInit) => {
    const u = String(url);
    if (u.endsWith('/graphql')) {
      queries += 1;
      const body = JSON.parse(String(init?.body));
      if (body.extensions.persistedQuery.sha256Hash !== newHash) return Response.json({ errors: [{ message: 'PersistedQueryNotSupported' }] });
      return Response.json({ data: { Realms: [{ name: 'Normal', slug: 'normal', online: true, isRuleset: true }] } });
    }
    if (u.endsWith('/server-status')) return new Response('<script src="https://assets.example/realm-status.abc123.js"></script>');
    if (u.endsWith('realm-status.abc123.js')) return new Response(`q(t,"GetRealmStatusData"),t.documentId="${newHash}"`);
    return new Response('', { status: 404 });
  }) as typeof fetch;
  const c = new BlizzardClient({ userAgent: 't', fetchImpl, hash: 'd'.repeat(64) });
  const r = await c.rulesets('us');
  assert.equal(r[0]?.online, true);
  assert.equal(c.queryHash, newHash);
  assert.equal(queries, 2);
});

await test('forum text helpers', () => {
  assert.equal(stripHtml('<p>a&hellip; <b>b</b>&rsquo;s &amp; &#8217;</p>'), 'a… b’s & ’');
  assert.ok(isDownReport('Servers down?'));
  assert.ok(isDownReport('Emergency Maintenance Shut down'));
  assert.ok(isDownReport('WOW51900319 again'));
  assert.ok(!isDownReport('Best leveling spec for Paladin'));
});

// ---- tracker ---------------------------------------------------------------

const rs = (normal: boolean, pvp = normal) => [{ slug: 'normal', name: 'Normal', online: normal }, { slug: 'pvp', name: 'PvP', online: pvp }];

await test('a change needs two agreeing readings; a single flap is ignored', () => {
  const s = emptyState(0);
  assert.deepEqual(applyReading(s, 'us', rs(false), 1000), []);
  assert.deepEqual(applyReading(s, 'us', rs(true), 2000), []); // first sighting: pending
  assert.deepEqual(applyReading(s, 'us', rs(false), 3000), []); // flap back: cleared
  assert.deepEqual(applyReading(s, 'us', rs(true), 4000), []);
  const ev = applyReading(s, 'us', rs(true), 5000);
  assert.equal(ev.length, 1);
  assert.equal(ev[0]?.kind, 'up');
  assert.deepEqual(ev[0]?.slugs, ['normal', 'pvp']);
  assert.equal(ev[0]?.at, new Date(4000).toISOString()); // dated from the first reading
  assert.equal(ev[0]?.after, 3000);
  assert.equal(ev[0]?.afterAtLeast, true); // tracking began mid-outage
  assert.equal(regionState(s.regions.us, 5000), 'online');
  assert.equal(regionState(s.regions.us, 5000 + 6 * 60_000), 'unknown');
  // A later outage is measured exactly.
  applyReading(s, 'us', rs(false, true), 10_000);
  const down = applyReading(s, 'us', rs(false, true), 11_000);
  assert.equal(down[0]?.kind, 'down');
  assert.deepEqual(down[0]?.rulesets, ['Normal']);
  assert.equal(down[0]?.after, 6000);
  assert.equal(down[0]?.afterAtLeast, false);
  assert.equal(regionState(s.regions.us, 11_000), 'partial');
});

await test('state survives a restart without pending readings', () => {
  const s = emptyState(0);
  applyReading(s, 'eu', rs(false), 1000);
  applyReading(s, 'eu', rs(true), 2000);
  const back = restoreState(JSON.parse(JSON.stringify(s)), 9999);
  assert.equal(back.trackingSince, 0);
  assert.equal(back.regions.eu?.rulesets[0]?.pending, null);
  assert.equal(restoreState({ junk: true }, 5).trackingSince, 5);
});

await test('prefs validation and durations', () => {
  assert.deepEqual(validPrefs({ regions: ['us', 'xx', 'us'], rulesets: ['normal', 'BAD!'], down: true }), { regions: ['us'], rulesets: ['normal'], up: true, down: true, blue: false });
  assert.equal(validPrefs({ regions: [] }), null);
  assert.equal(formatDuration(30_000), 'under a minute');
  assert.equal(formatDuration(75 * 60_000), '1h 15m');
  assert.equal(formatDuration(26 * 3600_000), '1d 2h');
});

// ---- the whole service -----------------------------------------------------

interface World {
  online: Record<string, boolean>;
  blue: { id: number; topic_id: number; topic_title: string; excerpt: string; url: string; username: string; created_at: string; category_id: number }[];
  pushes: { endpoint: string; headers: Headers; body: Buffer }[];
  pushStatus: number;
}

function world(): { w: World; fetchImpl: typeof fetch; pushFetch: typeof fetch } {
  const w: World = { online: { normal: false, pvp: false, roleplay: false, 'roleplay-pvp': false }, blue: [], pushes: [], pushStatus: 201 };
  const fetchImpl = (async (url: string | URL, init?: RequestInit) => {
    const u = String(url);
    if (u.endsWith('/graphql')) {
      const region = JSON.parse(String(init?.body)).variables.input.compoundRegionGameVersionSlug as string;
      const slugs = region.endsWith('-us') || region.endsWith('-eu') ? Object.keys(w.online) : ['normal', 'pvp'];
      return Response.json({ data: { Realms: slugs.map((slug) => ({ slug, name: slug === 'pvp' ? 'PvP' : slug.replace(/(^|-)(\w)/g, (_m, d: string, c: string) => `${d ? ' ' : ''}${c.toUpperCase()}`).replace('Pvp', 'PvP'), online: w.online[slug] ?? false, isRuleset: true })) } });
    }
    if (u.includes('/categories.json')) return Response.json({ category_list: { categories: [{ id: 346, slug: 'wow-forever', subcategory_ids: [347] }] } });
    if (u.includes('/blizzard-tracker/posts.json')) return Response.json({ posts: w.blue });
    if (u.includes('/latest.json')) {
      return Response.json({ topic_list: { topics: [
        { id: 1, slug: 'servers-down', title: 'Servers down?', created_at: new Date().toISOString() },
        { id: 2, slug: 'paladin-talents', title: 'Paladin talents', created_at: new Date().toISOString() },
      ] } });
    }
    return new Response('not found', { status: 404 });
  }) as typeof fetch;
  const pushFetch = (async (url: string | URL, init?: RequestInit) => {
    w.pushes.push({ endpoint: String(url), headers: new Headers(init?.headers), body: Buffer.from(init?.body as Uint8Array) });
    return new Response('', { status: w.pushStatus });
  }) as typeof fetch;
  return { w, fetchImpl, pushFetch };
}

const dirs: string[] = [];
function service(fetchImpl: typeof fetch, pushFetch: typeof fetch, clock: { t: number }) {
  const dir = mkdtempSync(join(tmpdir(), 'status-test-'));
  dirs.push(dir);
  return { dir, svc: new StatusService({ stateDir: dir, userAgent: 'test', vapidSubject: 'https://example.test/status/', siteUrl: 'https://example.test', fetchImpl, pushFetch, now: () => clock.t, log: () => undefined }) };
}

await test('servers coming back sends one decryptable push per matching subscriber', async () => {
  const { w, fetchImpl, pushFetch } = world();
  const clock = { t: Date.parse('2026-11-09T20:00:00Z') };
  const { dir, svc } = service(fetchImpl, pushFetch, clock);
  const all = fakeBrowser();
  const normalOnly = fakeBrowser();
  const euOnly = fakeBrowser();
  const quiet = fakeBrowser();
  svc.addSubscription(all.sub, { regions: ['us'], rulesets: [], up: true, down: true, blue: false });
  svc.addSubscription(normalOnly.sub, { regions: ['us'], rulesets: ['normal'], up: true, down: false, blue: false });
  svc.addSubscription(euOnly.sub, { regions: ['eu'], rulesets: [], up: true, down: false, blue: false });
  svc.addSubscription(quiet.sub, { regions: ['us'], rulesets: [], up: false, down: false, blue: false });

  await svc.pollBlizzard(); // all offline: first sighting
  clock.t += 20_000;
  w.online = { normal: true, pvp: true, roleplay: true, 'roleplay-pvp': true };
  await svc.pollBlizzard(); // pending
  assert.equal(w.pushes.length, 0);
  clock.t += 8_000;
  const events = await svc.pollBlizzard(); // confirmed in every region
  assert.equal(events.filter((e) => e.kind === 'up').length, 4);

  const byEndpoint = new Map(w.pushes.map((p) => [p.endpoint, p]));
  assert.equal(w.pushes.length, 3, 'all, normalOnly and euOnly (quiet has up alerts off)');
  const a = byEndpoint.get(all.sub.endpoint);
  assert.ok(a);
  assert.equal(a.headers.get('content-encoding'), 'aes128gcm');
  assert.equal(a.headers.get('urgency'), 'high');
  assert.equal(a.headers.get('topic'), 'status-us');
  assert.match(a.headers.get('authorization') ?? '', /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=[\w-]+$/);
  const msgA = all.open(a.body);
  assert.equal(msgA.title, 'WoW Forever is back online');
  assert.equal(msgA.body, 'Americas & Oceania: Normal, PvP, Roleplay and Roleplay PvP are up again. Time to log in.');
  assert.equal(msgA.kind, 'up');
  assert.equal(msgA.tag, 'status-us');
  const msgN = normalOnly.open(byEndpoint.get(normalOnly.sub.endpoint)?.body ?? Buffer.alloc(0));
  assert.equal(msgN.title, 'WoW Forever is back online');
  assert.equal(msgN.body, 'Americas & Oceania: Normal is up again. Time to log in.');
  const msgE = euOnly.open(byEndpoint.get(euOnly.sub.endpoint)?.body ?? Buffer.alloc(0));
  assert.match(msgE.body, /^Europe:/);

  // Snapshot and persistence.
  const snap = svc.snapshot();
  assert.equal(snap.regions.find((r) => r.key === 'us')?.state, 'online');
  assert.equal(snap.events[0]?.kind, 'up');
  assert.equal(JSON.parse(readFileSync(join(dir, 'subscriptions.json'), 'utf8')).length, 4);
  assert.equal(JSON.parse(readFileSync(join(dir, 'state.json'), 'utf8')).events.length, 4);

  // Going down: only the subscriber with down alerts; a 410 drops it.
  w.pushes = [];
  w.pushStatus = 410;
  w.online.pvp = false;
  clock.t += 45_000;
  await svc.pollBlizzard();
  clock.t += 8_000;
  await svc.pollBlizzard();
  // (up for 45s: under a minute, so no duration in the text)
  assert.deepEqual(w.pushes.map((p) => p.endpoint), [all.sub.endpoint]);
  const downMsg = all.open(w.pushes[0]?.body ?? Buffer.alloc(0));
  assert.equal(downMsg.title, 'PvP went offline');
  assert.equal(downMsg.body, "Americas & Oceania: PvP is offline. You'll get another alert when it's back.");
  assert.equal(svc.subscriptionCount, 3, 'gone subscription removed');
  svc.stop();
});

await test('new Blizzard service posts alert opted-in subscribers once', async () => {
  const { w, fetchImpl, pushFetch } = world();
  const clock = { t: Date.now() };
  const { svc } = service(fetchImpl, pushFetch, clock);
  const fan = fakeBrowser();
  svc.addSubscription(fan.sub, { regions: ['us'], rulesets: [], up: true, down: false, blue: true });
  svc.addSubscription(fakeBrowser().sub, { regions: ['us'], rulesets: [], up: true, down: false, blue: false });
  const post = (id: number, title: string, category = 347) => ({ id, topic_id: id, topic_title: title, excerpt: '<p>Details&hellip;</p>', url: `/t/x/${id}/1`, username: 'Kaivax', created_at: new Date(clock.t).toISOString(), category_id: category });
  w.blue = [post(1, 'Hotfixes - November 9')];
  await svc.pollForums(); // existing posts are never alerted
  w.blue = [post(3, 'Emergency maintenance - November 9'), post(2, 'Midnight raid tuning', 171), ...w.blue];
  await svc.pollForums();
  await svc.pollForums();
  assert.equal(w.pushes.length, 1);
  const msg = fan.open(w.pushes[0]?.body ?? Buffer.alloc(0));
  assert.equal(msg.title, 'Blizzard: Emergency maintenance - November 9');
  assert.equal(msg.body, 'Details…');
  assert.equal(msg.url, 'https://us.forums.blizzard.com/en/wow/t/x/3/1');
  const snap = svc.snapshot();
  assert.deepEqual(snap.bluePosts.map((p) => p.id), [3, 1], 'other games filtered out');
  assert.equal(snap.reports?.count, 1);
  svc.stop();
});

await test('HTTP API: subscribe, test push, origin and stream', async () => {
  const { w, fetchImpl, pushFetch } = world();
  const clock = { t: Date.now() };
  const { svc } = service(fetchImpl, pushFetch, clock);
  await svc.pollBlizzard();
  const server = createStatusServer(svc, { allowedOrigins: ['https://example.test'] });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const post = (path: string, body: unknown, origin = 'https://example.test') =>
    fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body) });
  try {
    const snap = (await (await fetch(`${base}/api/status`)).json()) as Snapshot;
    assert.equal(snap.version, 1);
    assert.equal(snap.regions.length, 4);
    const key = (await (await fetch(`${base}/api/push/key`)).json()) as { publicKey: string };
    assert.equal(key.publicKey, svc.vapid.publicKey);

    const b = fakeBrowser();
    assert.equal((await post('/api/push/subscribe', { subscription: b.sub, prefs: { regions: ['us'] } }, 'https://evil.test')).status, 403);
    assert.equal((await post('/api/push/subscribe', { subscription: fakeBrowser('evil.test').sub })).status, 400);
    assert.equal((await post('/api/push/subscribe', { subscription: b.sub, prefs: { regions: [] } })).status, 400);
    const ok = await post('/api/push/subscribe', { subscription: b.sub, prefs: { regions: ['us', 'eu'], rulesets: ['normal'] } });
    assert.equal(ok.status, 200);
    assert.deepEqual(((await (await post('/api/push/prefs', { endpoint: b.sub.endpoint })).json()) as { prefs: { regions: string[] } }).prefs.regions, ['us', 'eu']);

    assert.equal((await post('/api/push/test', { endpoint: b.sub.endpoint })).status, 200);
    assert.equal(b.open(w.pushes.at(-1)?.body ?? Buffer.alloc(0)).title, 'Notifications are on');
    assert.equal((await post('/api/push/test', { endpoint: b.sub.endpoint })).status, 429, 'tests are rate limited');
    assert.equal((await post('/api/push/test', { endpoint: 'https://fcm.googleapis.com/unknown' })).status, 404);

    const moved = fakeBrowser();
    assert.equal(((await (await post('/api/push/resubscribe', { oldEndpoint: b.sub.endpoint, subscription: moved.sub })).json()) as { ok: boolean }).ok, true);
    assert.deepEqual(svc.getPrefs(moved.sub.endpoint)?.rulesets, ['normal']);
    assert.equal(((await (await post('/api/push/unsubscribe', { endpoint: moved.sub.endpoint })).json()) as { removed: boolean }).removed, true);

    assert.equal((await fetch(`${base}/api/push/subscribe`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' })).status, 415);
    assert.equal((await post('/api/push/subscribe', { pad: 'x'.repeat(10_000) })).status, 413);

    // The stream opens with a full snapshot.
    const ac = new AbortController();
    const res = await fetch(`${base}/api/status/stream`, { signal: ac.signal });
    assert.equal(res.headers.get('content-type'), 'text/event-stream; charset=utf-8');
    const reader = res.body?.getReader();
    let text = '';
    while (reader && !text.includes('\n\n', text.indexOf('event: status'))) {
      const { value, done } = await reader.read();
      if (done) break;
      text += Buffer.from(value).toString();
    }
    ac.abort();
    const data = /event: status\ndata: (.+)\n\n/.exec(text)?.[1];
    assert.equal((JSON.parse(data ?? '{}') as Snapshot).version, 1);
  } finally {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
    svc.stop();
  }
});

for (const d of dirs) rmSync(d, { recursive: true, force: true });
if (failed > 0) {
  console.error(`Status tests: ${failed} failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`Status tests passed: ${passed} tests.`);
