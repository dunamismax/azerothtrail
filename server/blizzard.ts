// Reads WoW: Forever ruleset status from the same GraphQL endpoint that
// Blizzard's official server-status page uses:
//   https://worldofwarcraft.blizzard.com/en-us/forever/us/server-status
// The endpoint only accepts persisted (pre-registered) queries, identified by
// a hash baked into the page's realm-status script. When Blizzard ships a new
// build and the hash stops working, it is rediscovered from that script.
import type { RegionKey } from './types.ts';

export const STATUS_PAGE = (region: RegionKey) => `https://worldofwarcraft.blizzard.com/en-us/forever/${region}/server-status`;
const ORIGIN = 'https://worldofwarcraft.blizzard.com';
const GRAPHQL = `${ORIGIN}/en-us/graphql`;
/** Hash of GetRealmStatusData as of November 2026; refreshed automatically. */
const KNOWN_HASH = 'e890f42a5375f136b9f9165408fb2bc372cc5f88be0b21e7dc681a70d9999c67';

export interface RawRuleset {
  slug: string;
  name: string;
  online: boolean;
}

export interface BlizzardOptions {
  userAgent: string;
  fetchImpl?: typeof fetch;
  hash?: string;
}

export class BlizzardClient {
  private hash: string;
  private lastDiscovery = 0;
  private readonly ua: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: BlizzardOptions) {
    this.ua = opts.userAgent;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.hash = opts.hash ?? KNOWN_HASH;
  }

  get queryHash(): string {
    return this.hash;
  }

  async rulesets(region: RegionKey): Promise<RawRuleset[]> {
    try {
      return await this.query(region);
    } catch (err) {
      if (!(err instanceof QueryRejected)) throw err;
      // The persisted query may have been replaced by a new site build.
      if (!(await this.rediscover())) throw err;
      return await this.query(region);
    }
  }

  private async query(region: RegionKey): Promise<RawRuleset[]> {
    const res = await this.fetchImpl(GRAPHQL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', 'accept-language': 'en-US', 'user-agent': this.ua, referer: STATUS_PAGE(region) },
      body: JSON.stringify({
        operationName: 'GetRealmStatusData',
        variables: { input: { compoundRegionGameVersionSlug: `forever-${region}` } },
        extensions: { persistedQuery: { version: 1, sha256Hash: this.hash } },
      }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 400 || res.status === 404) throw new QueryRejected(`HTTP ${res.status}`);
      throw new Error(`Blizzard answered HTTP ${res.status}`);
    }
    let json: { data?: { Realms?: unknown }; errors?: { message?: string }[] };
    try { json = JSON.parse(text); } catch { throw new Error('Blizzard sent a response that is not JSON'); }
    const realms = json.data?.Realms;
    if (!Array.isArray(realms)) {
      const msg = json.errors?.map((e) => e.message).filter(Boolean).join('; ') || 'no realm data';
      if (/persisted/i.test(msg)) throw new QueryRejected(msg);
      throw new Error(`Blizzard: ${msg}`);
    }
    return parseRealms(realms);
  }

  /** Find the current hash of GetRealmStatusData in the status page's script. At most every 10 minutes. */
  async rediscover(now = Date.now()): Promise<boolean> {
    if (now - this.lastDiscovery < 10 * 60_000) return false;
    this.lastDiscovery = now;
    const get = async (url: string) => {
      const r = await this.fetchImpl(url, { headers: { 'user-agent': this.ua, accept: '*/*' }, signal: AbortSignal.timeout(20_000) });
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
      return r.text();
    };
    try {
      const html = await get(STATUS_PAGE('us'));
      const scripts = [...html.matchAll(/src="(https:\/\/[^"]+\/realm-status\.[0-9a-f]+\.js)"/g)].map((m) => m[1] ?? '');
      for (const src of scripts) {
        const found = findHash(await get(src));
        if (found) {
          const changed = found !== this.hash;
          this.hash = found;
          return changed;
        }
      }
    } catch {
      /* keep the current hash; the caller reports the original error */
    }
    return false;
  }
}

class QueryRejected extends Error {}

export function findHash(js: string): string | null {
  const exact = /\(\w+,"GetRealmStatusData"\),\w+\.documentId="([0-9a-f]{64})"/.exec(js);
  if (exact?.[1]) return exact[1];
  const at = js.lastIndexOf('"GetRealmStatusData"');
  if (at < 0) return null;
  return /documentId="([0-9a-f]{64})"/.exec(js.slice(at, at + 400))?.[1] ?? null;
}

/** Forever lists rulesets (isRuleset) rather than realms; accept realms too in case that changes. */
const ORDER = ['normal', 'pvp', 'roleplay', 'roleplay-pvp'];

export function parseRealms(realms: unknown[]): RawRuleset[] {
  const out: RawRuleset[] = [];
  for (const r of realms) {
    const x = r as { slug?: unknown; name?: unknown; online?: unknown };
    if (typeof x.slug !== 'string' || typeof x.name !== 'string' || typeof x.online !== 'boolean') continue;
    if (!/^[a-z0-9-]{1,64}$/.test(x.slug)) continue;
    out.push({ slug: x.slug, name: x.name.slice(0, 64), online: x.online });
  }
  if (out.length === 0) throw new Error('Blizzard returned no rulesets');
  // Blizzard's order changes between answers; use a stable one.
  const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? ORDER.length : i; };
  return out.sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name));
}
