// Live server status page: reads snapshots from the status service over
// Server-Sent Events (falling back to polling), renders them, and manages
// alerts: Web Push when the browser supports it, otherwise notifications
// while the tab stays open. Every string from the network goes through
// textContent; nothing is parsed as HTML.
import { REGION_KEYS, REGION_NAMES, type BluePost, type PushPrefs, type RegionKey, type RegionStatus, type Snapshot, type StatusEvent } from '../../server/types.ts';

const KEY = 'azerothtrail:v1:status';
const FORUM_PREFIX = 'https://us.forums.blizzard.com/';
const OFFICIAL = (r: RegionKey) => `https://worldofwarcraft.blizzard.com/en-us/forever/${r}/server-status`;

interface Local {
  region: RegionKey;
  alerts: PushPrefs;
  sound: boolean;
  /** Tab-only alerts (no background push in this browser). */
  tabAlerts: boolean;
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: { class?: string; text?: string; attrs?: Record<string, string> } = {}, ...children: (Node | string | null)[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (props.class) e.className = props.class;
  if (props.text !== undefined) e.textContent = props.text;
  for (const [k, v] of Object.entries(props.attrs ?? {})) e.setAttribute(k, v);
  for (const c of children) if (c !== null) e.append(c);
  return e;
}

function link(href: string, text: string, cls?: string): HTMLAnchorElement {
  const a = el('a', { text, ...(cls ? { class: cls } : {}) });
  if (/^https:\/\//.test(href) || href.startsWith('/')) a.href = href;
  if (/^https:\/\//.test(href)) a.rel = 'noopener';
  return a;
}

// ---- preferences ---------------------------------------------------------

function loadLocal(): Local {
  const def: Local = { region: 'us', alerts: { regions: ['us'], rulesets: [], up: true, down: false, blue: false }, sound: true, tabAlerts: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Local>;
      if (p.region && REGION_KEYS.includes(p.region)) def.region = p.region;
      if (p.alerts && Array.isArray(p.alerts.regions)) {
        const regions = p.alerts.regions.filter((r) => REGION_KEYS.includes(r));
        def.alerts = {
          regions: regions.length ? regions : ['us'],
          rulesets: Array.isArray(p.alerts.rulesets) ? p.alerts.rulesets.filter((s) => typeof s === 'string') : [],
          up: p.alerts.up !== false,
          down: p.alerts.down === true,
          blue: p.alerts.blue === true,
        };
      }
      def.sound = p.sound !== false;
      def.tabAlerts = p.tabAlerts === true;
    }
  } catch {
    /* storage blocked or corrupt: defaults */
  }
  const fromUrl = new URLSearchParams(location.search).get('region');
  if (fromUrl && REGION_KEYS.includes(fromUrl as RegionKey)) def.region = fromUrl as RegionKey;
  return def;
}

const local = loadLocal();
function saveLocal(): void {
  try { localStorage.setItem(KEY, JSON.stringify(local)); } catch { /* ignore */ }
}

// ---- time ----------------------------------------------------------------

let clockOffset = 0; // server time minus client time
const serverNow = () => Date.now() + clockOffset;

function duration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return h ? `${d}d ${h}h` : `${d}d`;
  if (h > 0) return mm ? `${h}h ${mm}m` : `${h}h`;
  return `${m}m`;
}

function ago(iso: string): string {
  const ms = serverNow() - Date.parse(iso);
  if (ms < 5000) return 'just now';
  return `${duration(ms)} ago`;
}

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
function when(iso: string): string {
  const d = new Date(iso);
  const sameDay = new Date().toDateString() === d.toDateString();
  return sameDay ? `today ${timeFmt.format(d)}` : dayFmt.format(d);
}

/** Live-updating relative time: refreshed every second by tick(). */
function liveTime(iso: string, mode: 'ago' | 'for', prefix = ''): HTMLElement {
  const t = el('time', { attrs: { datetime: iso, 'data-live-time': mode, 'data-prefix': prefix, title: new Date(iso).toLocaleString() } });
  t.textContent = relText(t);
  return t;
}

function relText(t: HTMLElement): string {
  const iso = t.getAttribute('datetime') ?? '';
  const prefix = t.dataset.prefix ?? '';
  return t.dataset.liveTime === 'for' ? `${prefix}${duration(serverNow() - Date.parse(iso))}` : `${prefix}${ago(iso)}`;
}

// ---- rendering -----------------------------------------------------------

let snap: Snapshot | null = null;
let lastSnapAt = 0;
let connection: 'connecting' | 'live' | 'reconnecting' = 'connecting';

const STATE_LABEL = { online: 'Online', offline: 'Offline', partial: 'Partly up', unknown: 'Unknown' } as const;

function regionOf(key: RegionKey): RegionStatus | undefined {
  return snap?.regions.find((r) => r.key === key);
}

/** When the region's current overall state began: the latest change among its rulesets. */
function regionSince(r: RegionStatus): { iso: string; known: boolean } | null {
  if (r.rulesets.length === 0) return null;
  const latest = r.rulesets.reduce((a, b) => (Date.parse(b.since) > Date.parse(a.since) ? b : a));
  return { iso: latest.since, known: r.rulesets.every((x) => x.sinceKnown) };
}

function setText(node: HTMLElement | null, text: string): void {
  if (node && node.textContent !== text) node.textContent = text;
}

function renderHero(): void {
  const hero = $('[data-hero]');
  if (!hero) return;
  const r = regionOf(local.region);
  setText($('[data-region-name]'), REGION_NAMES[local.region]);
  const headline = $('[data-headline]');
  const sub = $('[data-subline]');
  const grid = $('[data-rulesets]');
  const meta = $('[data-meta]');
  if (!sub || !grid || !meta) return;

  const state = r?.state ?? 'unknown';
  hero.dataset.state = snap ? state : 'unknown';
  const on = r?.rulesets.filter((x) => x.online).length ?? 0;
  const total = r?.rulesets.length ?? 0;
  const since = r ? regionSince(r) : null;
  const changing = r?.rulesets.some((x) => x.changing) ?? false;

  sub.replaceChildren();
  if (!snap) {
    setText(headline, 'Checking Blizzard…');
    sub.append(connection === 'reconnecting' ? 'Cannot reach the tracker right now. Retrying…' : 'Connecting to the tracker.');
  } else if (state === 'online') {
    setText(headline, 'Servers are up');
    sub.append(`${total === 1 ? 'The ruleset is' : `All ${total} rulesets are`} online`);
    if (since) sub.append(' · up for ', since.known ? '' : 'at least ', liveTime(since.iso, 'for'));
  } else if (state === 'offline') {
    setText(headline, 'Servers are down');
    sub.append(`${total === 1 ? 'The ruleset is' : `All ${total} rulesets are`} offline`);
    if (since) sub.append(' · down for ', since.known ? '' : 'at least ', liveTime(since.iso, 'for'));
  } else if (state === 'partial') {
    setText(headline, 'Partly up');
    sub.append(`${on} of ${total} rulesets online`);
  } else {
    setText(headline, 'Status unknown');
    sub.append(r?.checkedAt ? 'No fresh reading from Blizzard since ' : 'No reading from Blizzard yet.');
    if (r?.checkedAt) sub.append(liveTime(r.checkedAt, 'ago'), '.');
    if (r?.error) sub.append(` Last error: ${r.error}.`);
  }
  if (changing) sub.append(el('span', { class: 'tag tag-warn changing', text: 'Change detected, confirming…' }));

  grid.replaceChildren(
    ...(r?.rulesets ?? []).map((x) => {
      const status = state === 'unknown' ? 'unknown' : x.online ? 'online' : 'offline';
      const li = el('li', { class: 'ruleset', attrs: { 'data-state': status } });
      const head = el('p', { class: 'ruleset-head' }, el('b', { text: x.name }));
      if (x.slug === 'normal') head.append(el('span', { class: 'tag tag-accent', text: 'This guide' }));
      li.append(
        head,
        el('p', { class: 'ruleset-state' }, el('span', { class: 'pill', text: status === 'unknown' ? 'Unknown' : x.online ? 'Online' : 'Offline' }), x.changing ? el('span', { class: 'small muted', text: ' confirming…' }) : null),
        el('p', { class: 'small muted' }, x.online ? 'Up ' : 'Down ', x.sinceKnown ? 'since ' : 'since at least ', el('span', { text: when(x.since) })),
      );
      return li;
    }),
  );

  meta.replaceChildren();
  if (r?.checkedAt) meta.append('Checked ', liveTime(r.checkedAt, 'ago'));
  if (snap && snap.nextCheckIn > 0 && connection === 'live') meta.append(` · next check in about ${snap.nextCheckIn}s`);
  meta.append(meta.childNodes.length ? ' · ' : '', 'Source: ', link(OFFICIAL(local.region), 'Blizzard server status'));
}

function renderTabs(): void {
  for (const btn of $$<HTMLButtonElement>('[data-region-tab]')) btn.setAttribute('aria-pressed', String(btn.dataset.regionTab === local.region));
  for (const dot of $$('[data-region-dot]')) dot.dataset.state = regionOf(dot.dataset.regionDot as RegionKey)?.state ?? 'unknown';
  const mine = regionOf(local.region)?.state ?? 'unknown';
  for (const dot of $$('[data-status-dot]')) dot.dataset.state = mine;
}

function renderTable(): void {
  const body = $('[data-region-table]');
  if (!body || !snap) return;
  body.replaceChildren(
    ...snap.regions.map((r) => {
      const on = r.rulesets.filter((x) => x.online).map((x) => x.name);
      const off = r.rulesets.filter((x) => !x.online).map((x) => x.name);
      const names = r.state === 'online' ? `All up (${on.join(', ')})` : r.state === 'offline' ? `All down (${off.join(', ')})` : r.state === 'partial' ? `Up: ${on.join(', ')} · Down: ${off.join(', ')}` : r.error ?? 'No reading yet';
      const btn = el('button', { class: 'linkish', text: r.name, attrs: { type: 'button', 'data-pick-region': r.key } });
      return el('tr', { attrs: { 'data-state': r.state } },
        el('th', { attrs: { scope: 'row' } }, btn),
        el('td', {}, el('span', { class: 'pill', text: STATE_LABEL[r.state] })),
        el('td', { class: 'small', text: names }),
        el('td', { class: 'num small' }, r.checkedAt ? liveTime(r.checkedAt, 'ago') : '—'),
      );
    }),
  );
}

function renderBlue(): void {
  const list = $('[data-blue]');
  if (!list || !snap) return;
  const posts = snap.bluePosts.filter((p) => p.url.startsWith(FORUM_PREFIX)).slice(0, 6);
  if (posts.length === 0) {
    list.replaceChildren(el('li', { class: 'muted small', text: snap.sources.find((s) => s.id === 'forums')?.ok === false ? 'The forums could not be read just now.' : 'No recent staff posts.' }));
    return;
  }
  list.replaceChildren(
    ...posts.map((p) => el('li', { class: p.service ? 'is-service' : '' },
      el('p', { class: 'feed-title' }, link(p.url, p.title), p.service ? el('span', { class: 'tag tag-warn', text: 'Servers' }) : null),
      el('p', { class: 'small muted' }, `${p.author} · `, liveTime(p.at, 'ago')),
      p.excerpt ? el('p', { class: 'small feed-excerpt', text: p.excerpt }) : null,
    )),
  );
}

function renderReports(): void {
  const count = $('[data-report-count]');
  const list = $('[data-reports]');
  if (!count || !list || !snap) return;
  const r = snap.reports;
  if (!r) {
    setText(count, 'No reading yet.');
    list.replaceChildren();
    return;
  }
  const n = `${r.count}${r.capped ? '+' : ''}`;
  count.replaceChildren(el('b', { text: n }), ` new ${r.count === 1 && !r.capped ? 'thread' : 'threads'} about downtime in the last ${r.windowMinutes} minutes`);
  count.dataset.level = r.count >= 8 ? 'high' : r.count >= 3 ? 'some' : 'low';
  list.replaceChildren(...r.topics.filter((t) => t.url.startsWith(FORUM_PREFIX)).slice(0, 5).map((t) => el('li', {}, link(t.url, t.title), el('span', { class: 'small muted' }, ' · ', liveTime(t.at, 'ago')))));
}

function eventText(e: StatusEvent): string {
  const names = e.rulesets.join(', ');
  const after = e.after === null ? '' : ` after ${e.afterAtLeast ? 'at least ' : ''}${duration(e.after)} ${e.kind === 'up' ? 'down' : 'up'}`;
  return `${names} ${e.kind === 'up' ? 'came back online' : 'went offline'}${after}`;
}

function renderHistory(): void {
  const list = $('[data-history]');
  const note = $('[data-history-note]');
  if (!list || !snap) return;
  setText(note, `Changes seen by this tracker since ${when(snap.trackingSince)}, newest first.`);
  const events = snap.events.slice(0, 20);
  if (events.length === 0) {
    list.replaceChildren(el('li', { class: 'muted small', text: 'No changes yet.' }));
    return;
  }
  list.replaceChildren(
    ...events.map((e) => el('li', { class: `event event-${e.kind}` },
      el('span', { class: 'event-mark', text: e.kind === 'up' ? '▲' : '▼', attrs: { 'aria-hidden': 'true' } }),
      el('span', {}, el('b', { text: REGION_NAMES[e.region] }), `: ${eventText(e)}`, el('span', { class: 'small muted', text: ` · ${when(e.at)}` })),
    )),
  );
}

function renderBanner(): void {
  const banner = $('[data-banner]');
  if (!banner) return;
  const show = (kind: 'ok' | 'warn' | 'info', ...content: (Node | string)[]) => {
    banner.hidden = false;
    banner.dataset.kind = kind;
    banner.replaceChildren(...content);
  };
  if (connection === 'reconnecting' && (!snap || Date.now() - lastSnapAt > 60_000)) return show('warn', 'Lost the connection to the tracker. Retrying…');
  const recentUp = snap?.events.find((e) => e.region === local.region && e.kind === 'up' && serverNow() - Date.parse(e.at) < 15 * 60_000);
  if (recentUp && regionOf(local.region)?.state !== 'offline') return show('ok', el('b', { text: 'Back online! ' }), `${recentUp.rulesets.join(', ')} came back `, liveTime(recentUp.at, 'ago'), '.');
  const notice = snap?.bluePosts.find((p) => p.service && serverNow() - Date.parse(p.at) < 12 * 3600_000 && p.url.startsWith(FORUM_PREFIX));
  if (notice) return show('info', el('b', { text: 'Blizzard: ' }), link(notice.url, notice.title), ' · ', liveTime(notice.at, 'ago'));
  banner.hidden = true;
}

function renderTitle(): void {
  const r = regionOf(local.region);
  const mark = !snap || !r ? '' : r.state === 'online' ? '▲ Up · ' : r.state === 'offline' ? '▼ Down · ' : r.state === 'partial' ? '◆ Partly up · ' : '';
  const t = `${mark}Server status · Azeroth Trail`;
  if (document.title !== t) document.title = t;
}

function render(): void {
  renderTabs();
  renderHero();
  renderTable();
  renderBlue();
  renderReports();
  renderHistory();
  renderBanner();
  renderTitle();
}

function tick(): void {
  for (const t of $$('[data-live-time]')) setText(t, relText(t));
  const live = $('[data-live]');
  if (live) live.dataset.on = String(connection === 'live' && Date.now() - lastSnapAt < 90_000);
  // A stale snapshot or a dropped stream changes the headline and banner.
  if (snap && Date.now() - lastSnapAt > 70_000) renderBanner();
}

// ---- live updates --------------------------------------------------------

let seenEvents: Set<string> | null = null;
let seenBlue: Set<number> | null = null;

function onSnapshot(s: Snapshot): void {
  if (!s || s.version !== 1 || !Array.isArray(s.regions)) return;
  clockOffset = Date.parse(s.generatedAt) - Date.now();
  snap = s;
  lastSnapAt = Date.now();
  connection = 'live';
  const freshEvents = seenEvents ? s.events.filter((e) => !seenEvents?.has(e.id)) : [];
  const freshBlue = seenBlue ? s.bluePosts.filter((p) => !seenBlue?.has(p.id)) : [];
  seenEvents = new Set([...(seenEvents ?? []), ...s.events.map((e) => e.id)]);
  seenBlue = new Set([...(seenBlue ?? []), ...s.bluePosts.map((p) => p.id)]);
  render();
  for (const e of freshEvents.reverse()) onEvent(e);
  for (const p of freshBlue) onBlue(p);
}

function matches(e: StatusEvent): boolean {
  const a = local.alerts;
  if (!a.regions.includes(e.region) || !(e.kind === 'up' ? a.up : a.down)) return false;
  return a.rulesets.length === 0 || e.slugs.some((s) => a.rulesets.includes(s));
}

function onEvent(e: StatusEvent): void {
  const watched = e.region === local.region || local.alerts.regions.includes(e.region);
  if (e.kind === 'up' && watched && local.sound) chime();
  // With push, the service worker shows the notification; tab mode shows it here.
  if (alertMode === 'tab' && matches(e)) {
    void notifyHere(e.kind === 'up' ? 'WoW Forever is back online' : 'WoW Forever servers went down', `${REGION_NAMES[e.region]}: ${eventText(e)}.`, `status-${e.region}`, e.kind === 'up');
  }
}

function onBlue(p: BluePost): void {
  if (alertMode === 'tab' && local.alerts.blue && p.service) void notifyHere(`Blizzard: ${p.title}`, p.excerpt.slice(0, 180), `blue-${p.id}`, false, p.url);
}

let source: EventSource | null = null;

async function pollOnce(): Promise<void> {
  try {
    const res = await fetch('/api/status', { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    onSnapshot((await res.json()) as Snapshot);
    if (!source || source.readyState !== EventSource.OPEN) connection = 'live';
  } catch {
    connection = 'reconnecting';
    render();
  }
}

function connect(): void {
  if (typeof EventSource === 'undefined') {
    void pollOnce();
    window.setInterval(() => void pollOnce(), 20_000);
    return;
  }
  source = new EventSource('/api/status/stream');
  source.addEventListener('status', (ev) => {
    try { onSnapshot(JSON.parse((ev as MessageEvent<string>).data) as Snapshot); } catch { /* ignore a bad frame */ }
  });
  source.addEventListener('error', () => {
    connection = 'reconnecting';
    renderBanner();
    if (source?.readyState === EventSource.CLOSED) {
      // The browser gave up (e.g. a 503): poll, and try streaming again later.
      source = null;
      void pollOnce();
      window.setTimeout(connect, 30_000);
    }
  });
}

// Watchdog: snapshots arrive at least every 45 seconds while streaming.
window.setInterval(() => {
  if (Date.now() - lastSnapAt > 75_000) void pollOnce();
}, 15_000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - lastSnapAt > 30_000) void pollOnce();
});

// ---- sound ---------------------------------------------------------------

let audio: AudioContext | null = null;
function unlockAudio(): void {
  if (audio || !('AudioContext' in window)) return;
  try { audio = new AudioContext(); } catch { audio = null; }
}
document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

function chime(): void {
  if (!audio) return;
  void audio.resume();
  const t0 = audio.currentTime + 0.05;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    const t = t0 + i * 0.16;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  });
}

// ---- alerts --------------------------------------------------------------

type AlertMode = 'push' | 'tab' | null;
let alertMode: AlertMode = null;
let registration: ServiceWorkerRegistration | null = null;

const hasNotifications = 'Notification' in window;
const hasPush = hasNotifications && 'serviceWorker' in navigator && 'PushManager' in window;
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

function b64uToBytes(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function api(path: string, body: unknown): Promise<Response> {
  return fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

async function notifyHere(title: string, body: string, tag: string, sticky: boolean, url = '/status/'): Promise<void> {
  if (!hasNotifications || Notification.permission !== 'granted') return;
  const options: NotificationOptions & { renotify?: boolean; requireInteraction?: boolean } = { body, tag, icon: '/icons/status-192.png', badge: '/icons/badge-72.png', data: { url }, renotify: true, requireInteraction: sticky };
  try {
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    /* some browsers refuse page notifications; the banner and chime still work */
  }
}

function setAlertUi(state: string, help: string | null, buttons: { on?: boolean; test?: boolean; off?: boolean; onLabel?: string }): void {
  setText($('[data-alert-state]'), state);
  const helpEl = $('[data-alert-help]');
  if (helpEl) {
    helpEl.hidden = !help;
    setText(helpEl, help ?? '');
  }
  const on = $<HTMLButtonElement>('[data-alert-on]');
  const test = $<HTMLButtonElement>('[data-alert-test]');
  const off = $<HTMLButtonElement>('[data-alert-off]');
  if (on) { on.hidden = !buttons.on; on.textContent = buttons.onLabel ?? 'Notify me when servers are back'; on.disabled = false; }
  if (test) { test.hidden = !buttons.test; test.disabled = false; }
  if (off) { off.hidden = !buttons.off; off.disabled = false; }
  $('[data-alerts]')?.setAttribute('data-mode', alertMode ?? 'off');
}

const watchedText = () => local.alerts.regions.map((r) => REGION_NAMES[r]).join(', ');

async function currentSubscription(): Promise<PushSubscription | null> {
  if (!hasPush || !registration) return null;
  try { return await registration.pushManager.getSubscription(); } catch { return null; }
}

async function refreshAlerts(): Promise<void> {
  if (!hasNotifications) {
    alertMode = null;
    if (isIOS && !standalone) setAlertUi('Alerts on iPhone and iPad need this page on your Home Screen.', 'Tap Share, then Add to Home Screen. Open Azeroth Trail from the Home Screen icon and turn alerts on there.', {});
    else setAlertUi("This browser can't show notifications.", 'Keep this tab open: it updates live, plays a chime and the tab title changes when servers come back.', {});
    return;
  }
  if (Notification.permission === 'denied') {
    alertMode = null;
    setAlertUi('Notifications are blocked for this site.', `Allow notifications for ${location.hostname} in your browser's site settings, then reload this page.`, {});
    return;
  }
  const sub = await currentSubscription();
  if (sub && Notification.permission === 'granted') {
    alertMode = 'push';
    setAlertUi(`Alerts are on for ${watchedText()}.`, 'They arrive even when this tab is closed, as long as your browser is running.', { test: true, off: true });
    return;
  }
  if (local.tabAlerts && Notification.permission === 'granted') {
    alertMode = 'tab';
    setAlertUi(`Alerts are on for ${watchedText()}, while this tab stays open.`, 'This browser has no background push, so keep this tab open (it can be in the background).', { test: true, off: true });
    return;
  }
  alertMode = null;
  setAlertUi('Get an alert the moment the servers come back.', hasPush ? null : 'This browser only supports alerts while this tab is open.', { on: true });
}

async function subscribePush(): Promise<boolean> {
  if (!registration) return false;
  const keyRes = await fetch('/api/push/key', { cache: 'no-store' });
  if (!keyRes.ok) throw new Error('The tracker is not reachable right now.');
  const { publicKey } = (await keyRes.json()) as { publicKey: string };
  let sub = await registration.pushManager.getSubscription();
  // A subscription made with a different server key can't receive our pushes.
  if (sub && sub.options.applicationServerKey) {
    const have = new Uint8Array(sub.options.applicationServerKey);
    const want = b64uToBytes(publicKey);
    if (have.length !== want.length || have.some((b, i) => b !== want[i])) {
      await sub.unsubscribe();
      sub = null;
    }
  }
  sub ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(publicKey) });
  const res = await api('/api/push/subscribe', { subscription: sub.toJSON(), prefs: local.alerts });
  if (!res.ok) {
    const msg = ((await res.json().catch(() => ({}))) as { error?: string }).error;
    throw new Error(msg ? `The tracker refused the subscription: ${msg}.` : `The tracker answered HTTP ${res.status}.`);
  }
  return true;
}

async function turnOn(): Promise<void> {
  unlockAudio();
  const btn = $<HTMLButtonElement>('[data-alert-on]');
  if (btn) btn.disabled = true;
  setText($('[data-alert-state]'), 'Asking your browser…');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return refreshAlerts();
  if (hasPush) {
    try {
      await subscribePush();
      local.tabAlerts = false;
      saveLocal();
      await refreshAlerts();
      return;
    } catch (err) {
      // Push can be switched off (e.g. Brave's default): fall back to the tab.
      local.tabAlerts = true;
      saveLocal();
      await refreshAlerts();
      setText($('[data-alert-help]'), `Background push didn't work in this browser (${(err as Error).message || 'push service error'}), so alerts only arrive while this tab is open.`);
      const help = $('[data-alert-help]');
      if (help) help.hidden = false;
      return;
    }
  }
  local.tabAlerts = true;
  saveLocal();
  await refreshAlerts();
}

async function turnOff(): Promise<void> {
  const sub = await currentSubscription();
  if (sub) {
    await api('/api/push/unsubscribe', { endpoint: sub.endpoint }).catch(() => undefined);
    await sub.unsubscribe().catch(() => undefined);
  }
  local.tabAlerts = false;
  saveLocal();
  await refreshAlerts();
}

async function sendTest(): Promise<void> {
  const btn = $<HTMLButtonElement>('[data-alert-test]');
  if (btn) btn.disabled = true;
  unlockAudio();
  if (local.sound) chime();
  const help = $('[data-alert-help]');
  const say = (t: string) => { if (help) { help.hidden = false; setText(help, t); } };
  try {
    if (alertMode === 'push') {
      const sub = await currentSubscription();
      const res = sub ? await api('/api/push/test', { endpoint: sub.endpoint }) : null;
      if (res?.status === 404 && sub) {
        await subscribePush();
        say('The tracker had forgotten this browser, so it was signed up again. Try the test once more.');
      } else if (res?.status === 429) say('A test was just sent. Wait a few seconds before trying again.');
      else if (!res?.ok) say('The test could not be delivered. Turn alerts off and on again.');
      else say('Test sent through your browser’s push service. It should appear within a few seconds.');
    } else {
      await notifyHere('Notifications are on', `You'll get an alert here when servers come back online (${watchedText()}).`, 'test', false);
      say('Test shown. Keep this tab open to get alerts.');
    }
  } finally {
    window.setTimeout(() => { if (btn) btn.disabled = false; }, 3000);
  }
}

// Alert settings form.
function syncForm(): void {
  for (const i of $$<HTMLInputElement>('input[name="alert-region"]')) i.checked = local.alerts.regions.includes(i.value as RegionKey);
  for (const i of $$<HTMLInputElement>('input[name="alert-ruleset"]')) i.checked = local.alerts.rulesets.includes(i.value);
  const all = $<HTMLInputElement>('input[name="alert-ruleset-all"]');
  if (all) all.checked = local.alerts.rulesets.length === 0;
  const set = (n: string, v: boolean) => { const i = $<HTMLInputElement>(`input[name="${n}"]`); if (i) i.checked = v; };
  set('alert-up', local.alerts.up);
  set('alert-down', local.alerts.down);
  set('alert-blue', local.alerts.blue);
  set('alert-sound', local.sound);
}

let saveTimer: number | undefined;
function prefsChanged(): void {
  saveLocal();
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(async () => {
    const saved = $('[data-alert-saved]');
    if (alertMode === 'push') {
      try {
        await subscribePush();
        setText(saved, 'Saved.');
      } catch (err) {
        setText(saved, `Could not save: ${(err as Error).message}`);
      }
    } else setText(saved, 'Saved in this browser.');
    if (alertMode) await refreshAlerts();
  }, 400);
}

function initForm(): void {
  syncForm();
  for (const i of $$<HTMLInputElement>('input[name="alert-region"]')) {
    i.addEventListener('change', () => {
      const picked = $$<HTMLInputElement>('input[name="alert-region"]').filter((x) => x.checked).map((x) => x.value as RegionKey);
      if (picked.length === 0) { i.checked = true; return; }
      local.alerts.regions = picked;
      prefsChanged();
    });
  }
  const all = $<HTMLInputElement>('input[name="alert-ruleset-all"]');
  all?.addEventListener('change', () => {
    if (all.checked) local.alerts.rulesets = [];
    else if (local.alerts.rulesets.length === 0) { all.checked = true; return; }
    syncForm();
    prefsChanged();
  });
  for (const i of $$<HTMLInputElement>('input[name="alert-ruleset"]')) {
    i.addEventListener('change', () => {
      local.alerts.rulesets = $$<HTMLInputElement>('input[name="alert-ruleset"]').filter((x) => x.checked).map((x) => x.value);
      syncForm();
      prefsChanged();
    });
  }
  const bind = (name: string, apply: (v: boolean) => void) => {
    const i = $<HTMLInputElement>(`input[name="${name}"]`);
    i?.addEventListener('change', () => { apply(i.checked); prefsChanged(); });
  };
  bind('alert-up', (v) => { local.alerts.up = v; });
  bind('alert-down', (v) => { local.alerts.down = v; });
  bind('alert-blue', (v) => { local.alerts.blue = v; });
  bind('alert-sound', (v) => { local.sound = v; if (v) { unlockAudio(); chime(); } });
}

// ---- boot ----------------------------------------------------------------

function pickRegion(key: RegionKey): void {
  local.region = key;
  saveLocal();
  const url = new URL(location.href);
  if (key === 'us') url.searchParams.delete('region');
  else url.searchParams.set('region', key);
  history.replaceState(null, '', url);
  render();
}

async function boot(): Promise<void> {
  for (const btn of $$<HTMLButtonElement>('[data-region-tab]')) btn.addEventListener('click', () => pickRegion(btn.dataset.regionTab as RegionKey));
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-pick-region]');
    if (b) {
      pickRegion(b.dataset.pickRegion as RegionKey);
      $('[data-hero]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  $('[data-alert-on]')?.addEventListener('click', () => void turnOn());
  $('[data-alert-off]')?.addEventListener('click', () => void turnOff());
  $('[data-alert-test]')?.addEventListener('click', () => void sendTest());
  initForm();
  render();
  connect();
  window.setInterval(tick, 1000);

  if ('serviceWorker' in navigator) {
    try {
      registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      navigator.serviceWorker.addEventListener('message', (ev: MessageEvent<{ type?: string; kind?: string }>) => {
        if (ev.data?.type === 'push' && ev.data.kind === 'up' && local.sound) chime();
      });
    } catch {
      registration = null;
    }
  }
  await refreshAlerts();
  // The tracker can lose a subscription (e.g. state reset): sign up again quietly.
  if (alertMode === 'push') {
    const sub = await currentSubscription();
    if (sub) {
      const res = await api('/api/push/prefs', { endpoint: sub.endpoint }).catch(() => null);
      if (res?.status === 404) await subscribePush().catch(() => undefined);
    }
  }
}

void boot();
