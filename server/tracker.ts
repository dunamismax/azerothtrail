// Ruleset state per region, confirmed transitions and their history.
// A changed reading counts only once two consecutive checks agree, so a
// single odd answer from Blizzard never triggers "servers are up" alerts.
import type { RawRuleset } from './blizzard.ts';
import { REGION_KEYS, REGION_NAMES, type RegionKey, type RegionState, type RegionStatus, type RulesetStatus, type StatusEvent } from './types.ts';

export const CONFIRMATIONS = 2;
/** Without a successful reading for this long, a region's state is unknown. */
export const STALE_MS = 5 * 60_000;
const MAX_EVENTS = 60;

interface Ruleset {
  slug: string;
  name: string;
  online: boolean;
  since: number;
  sinceKnown: boolean;
  pending: { online: boolean; firstSeen: number; count: number } | null;
}

interface Region {
  rulesets: Ruleset[];
  checkedAt: number | null;
  error: string | null;
}

export interface TrackerState {
  version: 1;
  trackingSince: number;
  regions: Partial<Record<RegionKey, Region>>;
  events: StatusEvent[];
}

export function emptyState(now: number): TrackerState {
  return { version: 1, trackingSince: now, regions: {}, events: [] };
}

export function restoreState(raw: unknown, now: number): TrackerState {
  const s = raw as TrackerState | null;
  if (!s || s.version !== 1 || typeof s.trackingSince !== 'number' || typeof s.regions !== 'object' || !Array.isArray(s.events)) return emptyState(now);
  for (const key of REGION_KEYS) {
    const r = s.regions[key];
    if (!r) continue;
    if (!Array.isArray(r.rulesets)) delete s.regions[key];
    // Pending readings don't survive a restart: the next checks start over.
    else for (const rs of r.rulesets) rs.pending = null;
  }
  s.events = s.events.slice(0, MAX_EVENTS);
  return s;
}

interface Change {
  slug: string;
  name: string;
  at: number;
  after: number;
  atLeast: boolean;
}

/** Apply one successful reading. Returns the transitions it confirmed. */
export function applyReading(state: TrackerState, region: RegionKey, reading: RawRuleset[], now: number): StatusEvent[] {
  const r: Region = state.regions[region] ?? { rulesets: [], checkedAt: null, error: null };
  state.regions[region] = r;
  r.checkedAt = now;
  r.error = null;

  const bySlug = new Map(r.rulesets.map((x) => [x.slug, x]));
  const next: Ruleset[] = [];
  const changes: Record<'up' | 'down', Change[]> = { up: [], down: [] };
  for (const raw of reading) {
    const old = bySlug.get(raw.slug);
    if (!old) {
      // First sight of a ruleset (or of the tracker): take its state as it is.
      next.push({ slug: raw.slug, name: raw.name, online: raw.online, since: now, sinceKnown: false, pending: null });
      continue;
    }
    old.name = raw.name;
    if (raw.online === old.online) old.pending = null;
    else if (old.pending?.online === raw.online) old.pending.count += 1;
    else old.pending = { online: raw.online, firstSeen: now, count: 1 };

    if (old.pending && old.pending.count >= CONFIRMATIONS) {
      const at = old.pending.firstSeen;
      changes[old.pending.online ? 'up' : 'down'].push({ slug: old.slug, name: old.name, at, after: at - old.since, atLeast: !old.sinceKnown });
      old.online = old.pending.online;
      old.since = at;
      old.sinceKnown = true;
      old.pending = null;
    }
    next.push(old);
  }
  r.rulesets = next;

  const events: StatusEvent[] = [];
  for (const kind of ['up', 'down'] as const) {
    const list = changes[kind];
    if (list.length === 0) continue;
    const at = Math.max(...list.map((c) => c.at));
    events.push({
      id: `${region}-${kind}-${at}`,
      at: new Date(at).toISOString(),
      region,
      kind,
      rulesets: list.map((c) => c.name),
      slugs: list.map((c) => c.slug),
      after: Math.max(...list.map((c) => c.after)),
      afterAtLeast: list.some((c) => c.atLeast),
    });
  }
  state.events = [...events, ...state.events].slice(0, MAX_EVENTS);
  return events;
}

export function recordError(state: TrackerState, region: RegionKey, error: string): void {
  const r = state.regions[region] ?? { rulesets: [], checkedAt: null, error: null };
  r.error = error.slice(0, 200);
  state.regions[region] = r;
}

export function hasPending(state: TrackerState): boolean {
  return REGION_KEYS.some((k) => state.regions[k]?.rulesets.some((x) => x.pending) ?? false);
}

export function anyOffline(state: TrackerState): boolean {
  return REGION_KEYS.some((k) => state.regions[k]?.rulesets.some((x) => !x.online) ?? false);
}

export function regionState(r: Region | undefined, now: number): RegionState {
  if (!r || r.checkedAt === null || now - r.checkedAt > STALE_MS || r.rulesets.length === 0) return 'unknown';
  const on = r.rulesets.filter((x) => x.online).length;
  if (on === r.rulesets.length) return 'online';
  return on === 0 ? 'offline' : 'partial';
}

export function regionStatuses(state: TrackerState, now: number): RegionStatus[] {
  return REGION_KEYS.map((key) => {
    const r = state.regions[key];
    const rulesets: RulesetStatus[] = (r?.rulesets ?? []).map((x) => ({
      slug: x.slug,
      name: x.name,
      online: x.online,
      since: new Date(x.since).toISOString(),
      sinceKnown: x.sinceKnown,
      changing: x.pending !== null,
    }));
    return {
      key,
      name: REGION_NAMES[key],
      state: regionState(r, now),
      checkedAt: r?.checkedAt ? new Date(r.checkedAt).toISOString() : null,
      error: r?.error ?? null,
      rulesets,
    };
  });
}
