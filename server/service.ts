// The status service: polls Blizzard and the forums, keeps state on disk,
// sends Web Push alerts on confirmed changes and tells live pages (SSE).
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BlizzardClient, STATUS_PAGE } from './blizzard.ts';
import { FORUM, ForumClient } from './forums.ts';
import { anyOffline, applyReading, hasPending, recordError, regionStatuses, restoreState, type TrackerState } from './tracker.ts';
import { REGION_KEYS, REGION_NAMES, type BluePost, type PlayerReports, type PushMessage, type PushPrefs, type RegionKey, type Snapshot, type SourceHealth, type StatusEvent } from './types.ts';
import { generateVapidKeys, sendPush, validVapidKeys, Vapid, type SendOptions, type Subscription } from './webpush.ts';

export interface ServiceOptions {
  stateDir: string;
  userAgent: string;
  vapidSubject: string;
  siteUrl: string;
  fetchImpl?: typeof fetch;
  /** Push-service fetch, separate so tests can capture pushes. */
  pushFetch?: typeof fetch;
  now?: () => number;
  /** Poll intervals in ms. */
  intervals?: Partial<Intervals>;
  maxSubscriptions?: number;
  log?: (msg: string) => void;
}

interface Intervals {
  online: number; // every ruleset up: nothing urgent
  offline: number; // something is down: watch closely for its return
  confirm: number; // a changed reading is waiting for confirmation
  forums: number;
}

const DEFAULT_INTERVALS: Intervals = { online: 45_000, offline: 20_000, confirm: 8_000, forums: 180_000 };

interface StoredSub {
  sub: Subscription;
  prefs: PushPrefs;
  created: string;
  failures: number;
}

export const DEFAULT_PREFS: PushPrefs = { regions: ['us'], rulesets: [], up: true, down: false, blue: false };

export function validPrefs(v: unknown): PushPrefs | null {
  const p = v as Partial<PushPrefs> | null;
  if (!p || typeof p !== 'object') return null;
  const regions = Array.isArray(p.regions) ? p.regions.filter((r): r is RegionKey => REGION_KEYS.includes(r as RegionKey)) : [];
  const rulesets = Array.isArray(p.rulesets) ? p.rulesets.filter((r): r is string => typeof r === 'string' && /^[a-z0-9-]{1,64}$/.test(r)).slice(0, 16) : [];
  if (regions.length === 0) return null;
  return { regions: [...new Set(regions)], rulesets: [...new Set(rulesets)], up: p.up !== false, down: p.down === true, blue: p.blue === true };
}

export function formatDuration(ms: number): string {
  const m = Math.floor(ms / 60_000);
  if (m < 1) return 'under a minute';
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return h > 0 ? `${d}d ${h}h` : `${d}d`;
  if (h > 0) return mm > 0 ? `${h}h ${mm}m` : `${h}h`;
  return `${mm}m`;
}

const listNames = (names: string[]) => (names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`);

export class StatusService {
  readonly vapid: Vapid;
  private state: TrackerState;
  private subs = new Map<string, StoredSub>();
  private blue: BluePost[] = [];
  private seenBlue: Set<number> | null = null;
  private reports: PlayerReports | null = null;
  private sources: Record<'blizzard' | 'forums', SourceHealth>;
  private listeners = new Set<(s: Snapshot) => void>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private nextPollAt = 0;
  private running = false;
  private savedState = '';
  private readonly blizzard: BlizzardClient;
  private readonly forums: ForumClient;
  private readonly now: () => number;
  private readonly iv: Intervals;
  private readonly opts: ServiceOptions;
  private readonly log: (msg: string) => void;
  private readonly testSent = new Map<string, number>();

  constructor(opts: ServiceOptions) {
    this.opts = opts;
    this.now = opts.now ?? Date.now;
    this.iv = { ...DEFAULT_INTERVALS, ...opts.intervals };
    this.log = opts.log ?? ((m) => console.log(m));
    mkdirSync(opts.stateDir, { recursive: true, mode: 0o700 });
    this.state = restoreState(this.readJson('state.json'), this.now());
    this.savedState = JSON.stringify(this.state);
    const stored = this.readJson('vapid.json');
    const keys = validVapidKeys(stored) ? stored : generateVapidKeys();
    if (keys !== stored) {
      this.writeJson('vapid.json', keys);
      this.log('generated a new VAPID key pair');
    }
    this.vapid = new Vapid(keys, opts.vapidSubject);
    const subs = this.readJson('subscriptions.json');
    if (Array.isArray(subs)) for (const s of subs as StoredSub[]) if (s?.sub?.endpoint) this.subs.set(s.sub.endpoint, s);
    const fetchImpl = opts.fetchImpl ?? fetch;
    this.blizzard = new BlizzardClient({ userAgent: opts.userAgent, fetchImpl });
    this.forums = new ForumClient({ userAgent: opts.userAgent, fetchImpl });
    this.sources = {
      blizzard: { id: 'blizzard', name: 'Blizzard server status', url: STATUS_PAGE('us'), ok: false, lastSuccess: null, lastError: null },
      forums: { id: 'forums', name: 'Blizzard forums (WoW: Forever)', url: `${FORUM}/c/wow-forever/346`, ok: false, lastSuccess: null, lastError: null },
    };
  }

  // ---- persistence -------------------------------------------------------

  private readJson(name: string): unknown {
    try { return JSON.parse(readFileSync(join(this.opts.stateDir, name), 'utf8')); } catch { return null; }
  }

  private writeJson(name: string, value: unknown): void {
    const file = join(this.opts.stateDir, name);
    try {
      writeFileSync(`${file}.tmp`, JSON.stringify(value), { mode: 0o600 });
      renameSync(`${file}.tmp`, file);
    } catch (err) {
      this.log(`could not write ${name}: ${(err as Error).message}`);
    }
  }

  private saveState(): void {
    const json = JSON.stringify(this.state);
    if (json === this.savedState) return;
    this.savedState = json;
    this.writeJson('state.json', this.state);
  }

  private saveSubs(): void {
    this.writeJson('subscriptions.json', [...this.subs.values()]);
  }

  // ---- scheduling --------------------------------------------------------

  start(): void {
    if (this.running) return;
    this.running = true;
    void this.pollLoop();
    void this.forumLoop();
  }

  stop(): void {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
  }

  private later(ms: number, fn: () => void): void {
    if (!this.running) return;
    const t = setTimeout(() => {
      this.timers = this.timers.filter((x) => x !== t);
      fn();
    }, ms);
    t.unref?.();
    this.timers.push(t);
  }

  private async pollLoop(): Promise<void> {
    // Nothing may stop the loop: an unexpected error waits for the next round.
    try { await this.pollBlizzard(); } catch (err) { this.log(`poll failed: ${(err as Error).stack ?? err}`); }
    const wait = hasPending(this.state) ? this.iv.confirm : anyOffline(this.state) ? this.iv.offline : this.iv.online;
    this.nextPollAt = this.now() + wait;
    this.emit();
    this.later(wait, () => void this.pollLoop());
  }

  private async forumLoop(): Promise<void> {
    try { await this.pollForums(); } catch (err) { this.log(`forum poll failed: ${(err as Error).stack ?? err}`); }
    this.emit();
    this.later(this.iv.forums, () => void this.forumLoop());
  }

  // ---- polling -----------------------------------------------------------

  /** One reading of every region. Public for tests. */
  async pollBlizzard(): Promise<StatusEvent[]> {
    const events: StatusEvent[] = [];
    let ok = 0;
    let lastError = '';
    for (const region of REGION_KEYS) {
      try {
        const reading = await this.blizzard.rulesets(region);
        events.push(...applyReading(this.state, region, reading, this.now()));
        ok += 1;
      } catch (err) {
        lastError = `${REGION_NAMES[region]}: ${(err as Error).message}`;
        recordError(this.state, region, (err as Error).message);
      }
    }
    const src = this.sources.blizzard;
    src.ok = ok === REGION_KEYS.length;
    if (ok > 0) src.lastSuccess = new Date(this.now()).toISOString();
    src.lastError = src.ok ? null : lastError;
    if (!src.ok) this.log(`blizzard: ${lastError}`);
    this.saveState();
    for (const e of events) {
      this.log(`${e.region}: ${e.rulesets.join(', ')} ${e.kind === 'up' ? 'came online' : 'went offline'}`);
      await this.notifyStatus(e);
    }
    return events;
  }

  /** Public for tests. */
  async pollForums(): Promise<void> {
    const src = this.sources.forums;
    const errors: string[] = [];
    try {
      const posts = await this.forums.bluePosts(this.now());
      const fresh = this.seenBlue ? posts.filter((p) => !this.seenBlue?.has(p.id)) : [];
      this.seenBlue = new Set([...(this.seenBlue ?? []), ...posts.map((p) => p.id)]);
      this.blue = posts;
      for (const p of fresh.filter((x) => x.service)) await this.notifyBlue(p);
    } catch (err) {
      errors.push((err as Error).message);
    }
    try {
      this.reports = await this.forums.playerReports(60, this.now());
    } catch (err) {
      errors.push((err as Error).message);
    }
    src.ok = errors.length === 0;
    if (errors.length < 2) src.lastSuccess = new Date(this.now()).toISOString();
    src.lastError = errors[0] ?? null;
    if (errors.length) this.log(`forums: ${errors.join('; ')}`);
  }

  // ---- snapshot and live listeners --------------------------------------

  snapshot(): Snapshot {
    const now = this.now();
    return {
      version: 1,
      generatedAt: new Date(now).toISOString(),
      nextCheckIn: Math.max(0, Math.round((this.nextPollAt - now) / 1000)),
      trackingSince: new Date(this.state.trackingSince).toISOString(),
      regions: regionStatuses(this.state, now),
      events: this.state.events.slice(0, 30),
      bluePosts: this.blue,
      reports: this.reports,
      sources: [this.sources.blizzard, this.sources.forums],
      push: { available: true },
    };
  }

  subscribe(fn: (s: Snapshot) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  get listenerCount(): number {
    return this.listeners.size;
  }

  private emit(): void {
    if (this.listeners.size === 0) return;
    const snap = this.snapshot();
    for (const fn of this.listeners) {
      try { fn(snap); } catch { /* a closed stream; it removes itself */ }
    }
  }

  // ---- push subscriptions -----------------------------------------------

  get subscriptionCount(): number {
    return this.subs.size;
  }

  addSubscription(sub: Subscription, prefs: PushPrefs): 'added' | 'updated' | 'full' {
    const existing = this.subs.get(sub.endpoint);
    if (!existing && this.subs.size >= (this.opts.maxSubscriptions ?? 20_000)) return 'full';
    this.subs.set(sub.endpoint, { sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, prefs, created: existing?.created ?? new Date(this.now()).toISOString(), failures: 0 });
    this.saveSubs();
    return existing ? 'updated' : 'added';
  }

  removeSubscription(endpoint: string): boolean {
    const had = this.subs.delete(endpoint);
    if (had) this.saveSubs();
    return had;
  }

  /** The browser rotated its subscription: keep the old preferences. */
  replaceSubscription(oldEndpoint: string, sub: Subscription): boolean {
    const old = this.subs.get(oldEndpoint);
    if (!old) return false;
    this.subs.delete(oldEndpoint);
    return this.addSubscription(sub, old.prefs) !== 'full';
  }

  getPrefs(endpoint: string): PushPrefs | null {
    return this.subs.get(endpoint)?.prefs ?? null;
  }

  /** Test notification for one existing subscription, at most every 20 seconds. */
  async sendTest(endpoint: string): Promise<'sent' | 'unknown' | 'too-soon' | 'failed'> {
    const s = this.subs.get(endpoint);
    if (!s) return 'unknown';
    const last = this.testSent.get(endpoint) ?? 0;
    if (this.now() - last < 20_000) return 'too-soon';
    this.testSent.set(endpoint, this.now());
    const watched = s.prefs.regions.map((r) => REGION_NAMES[r]).join(', ');
    const msg = this.message('test', 'Notifications are on', `You'll get an alert here when WoW Forever servers come back online (${watched}).`, 'test');
    const r = await this.deliver(s, msg, { ttl: 300, urgency: 'normal' });
    return r === 'sent' ? 'sent' : 'failed';
  }

  private message(kind: PushMessage['kind'], title: string, body: string, tag: string, url = '/status/'): PushMessage {
    return { kind, title, body, tag, url, at: new Date(this.now()).toISOString() };
  }

  private async notifyStatus(e: StatusEvent): Promise<void> {
    const region = this.state.regions[e.region];
    const total = region?.rulesets.length ?? 0;
    const onlineNow = region?.rulesets.filter((x) => x.online).length ?? 0;
    const targets = [...this.subs.values()].filter((s) => s.prefs.regions.includes(e.region) && (e.kind === 'up' ? s.prefs.up : s.prefs.down));
    const sends = targets.flatMap((s) => {
      const names = s.prefs.rulesets.length === 0 ? e.rulesets : e.rulesets.filter((_, i) => s.prefs.rulesets.includes(e.slugs[i] ?? ''));
      if (names.length === 0) return [];
      const all = s.prefs.rulesets.length === 0 && names.length === total;
      const region = REGION_NAMES[e.region];
      const verb = names.length === 1 ? 'is' : 'are';
      const dur = e.after !== null && e.after >= 60_000 ? `${e.afterAtLeast ? 'at least ' : ''}${formatDuration(e.after)}` : null;
      let title: string;
      let body: string;
      if (e.kind === 'up') {
        title = all || onlineNow === total ? 'WoW Forever is back online' : `${listNames(names)} ${verb} back online`;
        body = `${region}: ${listNames(names)} ${verb} up again${dur ? ` after ${dur} down` : ''}. Time to log in.`;
      } else {
        title = all ? 'WoW Forever servers are down' : `${listNames(names)} went offline`;
        body = `${region}: ${listNames(names)} ${verb} offline${dur ? ` after ${dur} up` : ''}.${s.prefs.up ? ` You'll get another alert when ${names.length === 1 ? "it's" : "they're"} back.` : ''}`;
      }
      const msg = this.message(e.kind, title, body, `status-${e.region}`);
      return [() => this.deliver(s, msg, { ttl: e.kind === 'up' ? 6 * 3600 : 3600, urgency: 'high', topic: `status-${e.region}` })];
    });
    await this.fanOut(sends);
  }

  private async notifyBlue(p: BluePost): Promise<void> {
    const targets = [...this.subs.values()].filter((s) => s.prefs.blue);
    const msg = this.message('blue', `Blizzard: ${p.title}`.slice(0, 120), p.excerpt.slice(0, 180) || `New post from ${p.author}.`, `blue-${p.id}`, p.url);
    await this.fanOut(targets.map((s) => () => this.deliver(s, msg, { ttl: 6 * 3600, urgency: 'normal' })));
  }

  private async fanOut(jobs: (() => Promise<unknown>)[]): Promise<void> {
    for (let i = 0; i < jobs.length; i += 25) await Promise.allSettled(jobs.slice(i, i + 25).map((j) => j()));
  }

  private async deliver(s: StoredSub, msg: PushMessage, opts: Omit<SendOptions, 'fetchImpl'>, retried = false): Promise<string> {
    const { result, status } = await sendPush(this.vapid, s.sub, msg, { ...opts, ...(this.opts.pushFetch ? { fetchImpl: this.opts.pushFetch } : {}) });
    if (result === 'sent') {
      if (s.failures) { s.failures = 0; this.saveSubs(); }
    } else if (result === 'gone') {
      this.removeSubscription(s.sub.endpoint);
    } else {
      s.failures += 1;
      if (result === 'failed' && status !== 413) this.log(`push failed with HTTP ${status} (${new URL(s.sub.endpoint).host})`);
      if (s.failures >= (result === 'failed' ? 3 : 20)) this.removeSubscription(s.sub.endpoint);
      else if (result === 'retry' && !retried && this.subs.has(s.sub.endpoint)) this.later(30_000, () => void this.deliver(s, msg, opts, true));
    }
    return result;
  }
}
