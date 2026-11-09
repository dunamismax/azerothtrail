// Shapes shared by the status service (server/) and the status page
// (src/scripts/status.ts), plus the region names both use.

export type RegionKey = 'us' | 'eu' | 'kr' | 'tw';

/** online | offline: every ruleset agrees; partial: some are up; unknown: no fresh reading. */
export type RegionState = 'online' | 'offline' | 'partial' | 'unknown';

export interface RulesetStatus {
  slug: string;
  name: string;
  online: boolean;
  /** When the current state began (ISO), as first observed by this tracker. */
  since: string;
  /** False when the state was already in place when tracking started, so `since` is a lower bound. */
  sinceKnown: boolean;
  /** A different reading is waiting for confirmation on the next check. */
  changing: boolean;
}

export interface RegionStatus {
  key: RegionKey;
  name: string;
  state: RegionState;
  /** Last successful reading from Blizzard (ISO), or null before the first. */
  checkedAt: string | null;
  /** Last error for this region, cleared on the next success. */
  error: string | null;
  rulesets: RulesetStatus[];
}

export interface StatusEvent {
  id: string;
  at: string;
  region: RegionKey;
  kind: 'up' | 'down';
  /** Ruleset names that changed together, and their slugs. */
  rulesets: string[];
  slugs: string[];
  /** How long they had been in the previous state, in ms (null if never observed). */
  after: number | null;
  /** True when `after` is a lower bound (tracking started mid-state). */
  afterAtLeast: boolean;
}

export interface BluePost {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  author: string;
  at: string;
  /** Mentions servers, maintenance, restarts, logins or queues. */
  service: boolean;
}

export interface ReportTopic {
  title: string;
  url: string;
  at: string;
}

export interface PlayerReports {
  windowMinutes: number;
  count: number;
  /** The forum page was full, so the real count may be higher. */
  capped: boolean;
  topics: ReportTopic[];
  checkedAt: string;
}

export interface SourceHealth {
  id: 'blizzard' | 'forums';
  name: string;
  url: string;
  ok: boolean;
  lastSuccess: string | null;
  lastError: string | null;
}

export interface Snapshot {
  version: 1;
  generatedAt: string;
  /** Seconds until the next scheduled check. */
  nextCheckIn: number;
  trackingSince: string;
  regions: RegionStatus[];
  events: StatusEvent[];
  bluePosts: BluePost[];
  reports: PlayerReports | null;
  sources: SourceHealth[];
  push: { available: boolean };
}

export interface PushPrefs {
  regions: RegionKey[];
  /** Ruleset slugs to watch; empty means every ruleset. */
  rulesets: string[];
  up: boolean;
  down: boolean;
  blue: boolean;
}

export interface PushMessage {
  title: string;
  body: string;
  tag: string;
  url: string;
  kind: 'up' | 'down' | 'blue' | 'test';
  at: string;
}

export const REGION_NAMES: Record<RegionKey, string> = {
  us: 'Americas & Oceania',
  eu: 'Europe',
  kr: 'Korea',
  tw: 'Taiwan',
};

export const REGION_KEYS: readonly RegionKey[] = ['us', 'eu', 'kr', 'tw'];
