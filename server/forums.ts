// Blizzard's US forums (Discourse) as supporting sources:
// - blue posts: the forum's Blizzard tracker, limited to the WoW: Forever
//   categories, for maintenance notices and fixes;
// - player reports: new Forever threads that talk about servers being down,
//   an unofficial early signal that often moves before the status page.
import type { BluePost, PlayerReports, ReportTopic } from './types.ts';

export const FORUM = 'https://us.forums.blizzard.com/en/wow';
const FOREVER_SLUG = 'wow-forever';
const FALLBACK_CATEGORIES = [346, 347, 348, 349, 352];

const SERVICE_WORDS = /\b(maintenance|downtime|restart(s|ed|ing)?|offline|outages?|shut ?downs?|shutting down|emergency|servers?|realms?|rulesets?|login|log ?in|queues?|disconnect(s|ed|ions?)?|unavailable|back (up|online)|latency|lag)\b/i;
const DOWN_WORDS = /\b(servers? (are |is )?(down|offline)|down\b|offline|maintenance|shut ?down|shutting down|outage|can'?t (log|connect|login)|cannot (log|connect)|unable to (log|connect)|disconnect\w*|kicked|login (issue|problem|error)s?|wow5\d{6}|emergency|restart)/i;

export function stripHtml(html: string): string {
  // Block tags become spaces; inline ones (<b>, <a>, ...) vanish without one.
  const text = html.replace(/<\/?(p|br|div|li|ul|ol|h\d|blockquote|tr|td|th|table|aside|img|hr)\b[^>]*>/gi, ' ').replace(/<[^>]*>/g, '');
  return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

const NAMED: Record<string, string> = { hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', laquo: '«', raquo: '»', middot: '·', bull: '•', copy: '©', reg: '®', trade: '™' };

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    const k = e.toLowerCase();
    if (k === 'amp') return '&';
    if (k === 'lt') return '<';
    if (k === 'gt') return '>';
    if (k === 'quot') return '"';
    if (k === 'apos' || k === '#39') return "'";
    if (k === 'nbsp') return ' ';
    const named = NAMED[k];
    if (named) return named;
    const code = k.startsWith('#x') ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
    return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
  });
}

export const isServiceText = (s: string) => SERVICE_WORDS.test(s);
export const isDownReport = (title: string) => DOWN_WORDS.test(title);

export interface ForumOptions {
  userAgent: string;
  fetchImpl?: typeof fetch;
}

export class ForumClient {
  private categories = new Set(FALLBACK_CATEGORIES);
  private categoriesAt = 0;
  private readonly ua: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: ForumOptions) {
    this.ua = opts.userAgent;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async json(path: string): Promise<unknown> {
    const res = await this.fetchImpl(`${FORUM}${path}`, { headers: { accept: 'application/json', 'user-agent': this.ua }, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`forums answered HTTP ${res.status} for ${path}`);
    return res.json();
  }

  /** The Forever category and its subcategories, refreshed daily. */
  private async foreverCategories(now: number): Promise<Set<number>> {
    if (now - this.categoriesAt < 24 * 3600_000) return this.categories;
    this.categoriesAt = now;
    try {
      const d = (await this.json('/categories.json')) as { category_list?: { categories?: { id: number; slug: string; subcategory_ids?: number[] }[] } };
      const c = d.category_list?.categories?.find((x) => x.slug === FOREVER_SLUG);
      if (c) this.categories = new Set([c.id, ...(c.subcategory_ids ?? []), ...FALLBACK_CATEGORIES]);
    } catch {
      /* keep the previous list */
    }
    return this.categories;
  }

  async bluePosts(now = Date.now()): Promise<BluePost[]> {
    const cats = await this.foreverCategories(now);
    const d = (await this.json('/groups/blizzard-tracker/posts.json')) as { posts?: unknown[] };
    if (!Array.isArray(d.posts)) throw new Error('blue tracker: unexpected response');
    const out: BluePost[] = [];
    const topics = new Set<number>();
    for (const raw of d.posts) {
      const p = raw as { id?: unknown; topic_id?: unknown; topic_title?: unknown; excerpt?: unknown; url?: unknown; username?: unknown; name?: unknown; created_at?: unknown; category_id?: unknown };
      if (typeof p.id !== 'number' || typeof p.category_id !== 'number' || !cats.has(p.category_id)) continue;
      if (typeof p.topic_title !== 'string' || typeof p.url !== 'string' || typeof p.created_at !== 'string') continue;
      if (!/^\/t\/[\w%-]+\/\d+(\/\d+)?$/.test(p.url)) continue;
      // Several staff replies in one thread: keep the newest (the list is newest first).
      if (typeof p.topic_id === 'number') {
        if (topics.has(p.topic_id)) continue;
        topics.add(p.topic_id);
      }
      const title = stripHtml(p.topic_title).slice(0, 200);
      const excerpt = stripHtml(typeof p.excerpt === 'string' ? p.excerpt : '').slice(0, 320);
      const author = typeof p.name === 'string' && p.name ? p.name : typeof p.username === 'string' ? p.username : 'Blizzard';
      out.push({ id: p.id, title, excerpt, url: `${FORUM}${p.url}`, author: stripHtml(author).slice(0, 60), at: new Date(p.created_at).toISOString(), service: isServiceText(`${title} ${excerpt}`) });
    }
    return out.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 12);
  }

  async playerReports(windowMinutes = 60, now = Date.now()): Promise<PlayerReports> {
    const since = now - windowMinutes * 60_000;
    const recent: ReportTopic[] = [];
    const seen = new Set<number>();
    let covered = false;
    // Newest topics first, a page of 30 at a time, until the window is covered.
    for (let page = 0; page < 4 && !covered; page++) {
      const d = (await this.json(`/c/${FOREVER_SLUG}/${FALLBACK_CATEGORIES[0]}/l/latest.json?order=created${page ? `&page=${page}` : ''}`)) as { topic_list?: { topics?: unknown[] } };
      const topics = d.topic_list?.topics;
      if (!Array.isArray(topics)) throw new Error('forum latest: unexpected response');
      if (topics.length < 30) covered = true;
      for (const raw of topics) {
        const t = raw as { id?: unknown; slug?: unknown; title?: unknown; created_at?: unknown; pinned?: unknown };
        if (typeof t.id !== 'number' || typeof t.slug !== 'string' || typeof t.title !== 'string' || typeof t.created_at !== 'string' || seen.has(t.id)) continue;
        seen.add(t.id);
        const at = Date.parse(t.created_at);
        if (!Number.isFinite(at)) continue;
        if (at < since) {
          if (t.pinned !== true) covered = true;
          continue;
        }
        const title = stripHtml(t.title).slice(0, 200);
        if (t.pinned === true || !isDownReport(title)) continue;
        recent.push({ title, url: `${FORUM}/t/${encodeURIComponent(t.slug)}/${t.id}`, at: new Date(at).toISOString() });
      }
    }
    recent.sort((a, b) => b.at.localeCompare(a.at));
    return { windowMinutes, count: recent.length, capped: !covered, topics: recent.slice(0, 8), checkedAt: new Date(now).toISOString() };
  }
}
