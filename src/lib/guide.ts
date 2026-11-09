import type {
  Bracket,
  BuildStep,
  BuildVariant,
  ClassGuide,
  Dungeon,
  EndgameBuild,
  FormGuide,
  Source,
  SpecGuide,
  Talent,
  TalentBuild,
  TrainPriority,
  TrainSpell,
  TrainingLevel,
  UpdateNote,
} from '../data/types.ts';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 60;
export const FIRST_TALENT_LEVEL = 10;
export const POINTS_PER_ROW = 5;

export const LEVELS: readonly number[] = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);

/** Page slugs a spec slug may not take, since /<class>/<page>/ already exists. */
export const RESERVED_SLUGS: readonly string[] = ['route', 'quests', 'sources', 'specs', 'level', 'endgame'];

export function specBySlug(guide: ClassGuide, slug: string): SpecGuide {
  const s = guide.specs.find((x) => x.slug === slug);
  if (!s) throw new Error(`${guide.id}: unknown spec ${slug}`);
  return s;
}

export function defaultSpec(guide: ClassGuide): SpecGuide {
  return specBySlug(guide, guide.defaultSpec);
}

export function specPath(guide: ClassGuide, spec: SpecGuide, endgame = false): string {
  return `/${guide.id}/${spec.slug}/${endgame ? 'endgame/' : ''}`;
}

/** Order an endgame build's ranks so every point respects row gates and prerequisites. */
export function endgameSteps(guide: ClassGuide, build: EndgameBuild): BuildStep[] {
  const entries = Object.entries(build.ranks).map(([id, n]) => ({ t: talentById(guide, id), n }));
  const treeOrder = (id: string) => guide.trees.findIndex((x) => x.id === id);
  entries.sort((a, b) => treeOrder(a.t.tree) - treeOrder(b.t.tree) || a.t.row - b.t.row || (a.t.requires ? 1 : 0) - (b.t.requires ? 1 : 0));
  return entries.map((e) => [e.t.id, e.n] as const);
}

/** An endgame build as a talent build whose 51 points are all spent at 60. */
export function endgameAsBuild(guide: ClassGuide, build: EndgameBuild): TalentBuild {
  return { id: build.id, name: build.name, role: build.use, startLevel: MAX_LEVEL, steps: endgameSteps(guide, build), expected: build.expected, summary: build.body, sources: build.sources };
}

export function bracketFor(guide: ClassGuide, level: number): Bracket {
  const b = guide.brackets.find((x) => level >= x.min && level <= x.max);
  if (!b) throw new Error(`${guide.id}: no bracket for level ${level}`);
  return b;
}

export function talentById(guide: ClassGuide, id: string): Talent {
  const t = guide.talents.find((x) => x.id === id);
  if (!t) throw new Error(`${guide.id}: unknown talent ${id}`);
  return t;
}

export function treeName(guide: ClassGuide, id: string): string {
  return guide.trees.find((t) => t.id === id)?.name ?? id;
}

export interface TalentPoint {
  /** 1-based point number in the build. */
  n: number;
  level: number;
  talent: Talent;
  /** Rank after this point. */
  rank: number;
  /** Points spent per tree after this point. */
  totals: Record<string, number>;
}

/** Level at which point n (1-based) is spent. Points before startLevel all land on startLevel. */
export function levelForPoint(build: TalentBuild, n: number): number {
  const atStart = build.startLevel - FIRST_TALENT_LEVEL + 1;
  return n <= atStart ? build.startLevel : build.startLevel + (n - atStart);
}

/**
 * Expand a build into one entry per talent point, checking ranks, row gates
 * and prerequisites as it goes. Throws on any rule the game would refuse.
 */
const expandCache = new WeakMap<TalentBuild, Map<BuildVariant | undefined, TalentPoint[]>>();

export function expandBuild(guide: ClassGuide, build: TalentBuild, variant?: BuildVariant): TalentPoint[] {
  const cached = expandCache.get(build)?.get(variant);
  if (cached) return cached;
  const out = expandBuildUncached(guide, build, variant);
  const byVariant = expandCache.get(build) ?? new Map<BuildVariant | undefined, TalentPoint[]>();
  byVariant.set(variant, out);
  expandCache.set(build, byVariant);
  return out;
}

function expandBuildUncached(guide: ClassGuide, build: TalentBuild, variant?: BuildVariant): TalentPoint[] {
  const ranks: Record<string, number> = {};
  const totals: Record<string, number> = Object.fromEntries(guide.trees.map((t) => [t.id, 0]));
  const out: TalentPoint[] = [];
  let n = 0;
  for (const [id, count] of build.steps) {
    for (let i = 0; i < count; i++) {
      n += 1;
      const level = levelForPoint(build, n);
      let talentId = id;
      if (variant && id === variant.swap.from && level >= variant.swap.levels[0] && level <= variant.swap.levels[1]) {
        talentId = variant.swap.to;
      }
      const talent = talentById(guide, talentId);
      const where = `${build.id}${variant ? ' (variant)' : ''} point ${n} (level ${level}, ${talent.name})`;
      const spentInTree = totals[talent.tree] ?? 0;
      const need = (talent.row - 1) * POINTS_PER_ROW;
      if (spentInTree < need) throw new Error(`${where}: row ${talent.row} needs ${need} points in ${talent.tree}, has ${spentInTree}`);
      const rank = (ranks[talentId] ?? 0) + 1;
      if (rank > talent.maxRank) throw new Error(`${where}: exceeds max rank ${talent.maxRank}`);
      if (talent.requires) {
        const req = talentById(guide, talent.requires);
        if ((ranks[req.id] ?? 0) < req.maxRank) throw new Error(`${where}: requires ${req.name} at ${req.maxRank}/${req.maxRank}`);
      }
      ranks[talentId] = rank;
      totals[talent.tree] = spentInTree + 1;
      out.push({ n, level, talent, rank, totals: { ...totals } });
    }
  }
  return out;
}

export function finalSplit(guide: ClassGuide, points: TalentPoint[]): Record<string, number> {
  const last = points.at(-1);
  return last ? last.totals : Object.fromEntries(guide.trees.map((t) => [t.id, 0]));
}

export function splitLabel(guide: ClassGuide, split: Record<string, number>): string {
  return guide.trees.map((t) => String(split[t.id] ?? 0)).join(' / ');
}

export function pointsAtLevel(points: TalentPoint[], level: number): TalentPoint[] {
  return points.filter((p) => p.level === level);
}

/** Group consecutive points on the same talent into "Ferocity 1-5/5" style runs. */
export interface PointRun {
  from: TalentPoint;
  to: TalentPoint;
}

export function runs(points: TalentPoint[]): PointRun[] {
  const out: PointRun[] = [];
  for (const p of points) {
    const prev = out.at(-1);
    if (prev && prev.to.talent.id === p.talent.id && prev.to.n === p.n - 1) prev.to = p;
    else out.push({ from: p, to: p });
  }
  return out;
}

export function levelSpan(a: number, b: number): string {
  return a === b ? String(a) : `${a}-${b}`;
}

export function trainingAt(guide: ClassGuide, level: number): TrainingLevel | undefined {
  return guide.training.find((t) => t.level === level);
}

export function nextTraining(guide: ClassGuide, level: number): TrainingLevel | undefined {
  return guide.training.find((t) => t.level > level);
}

/** Priority of a trainer spell for a spec, or null when the spec can't use it (a talent it doesn't have yet). */
export function spellPriority(guide: ClassGuide, spec: SpecGuide, spell: TrainSpell, level: number): TrainPriority | null {
  if (spell.talent) {
    const talent = guide.talents.find((t) => t.name === spell.name);
    if (!talent) return null;
    const has = expandBuild(guide, spec.build).some((p) => p.talent.id === talent.id && p.level <= level);
    if (!has) return null;
  }
  return spell.specs?.[spec.slug] ?? spell.priority;
}

export interface SpecTraining {
  core: TrainSpell[];
  situational: TrainSpell[];
  defer: TrainSpell[];
}

export function trainingFor(guide: ClassGuide, spec: SpecGuide, t: TrainingLevel): SpecTraining {
  const out: SpecTraining = { core: [], situational: [], defer: [] };
  for (const s of t.spells) {
    const p = spellPriority(guide, spec, s, t.level);
    if (p) out[p].push(s);
  }
  return out;
}

/** The next trainer visit with something new for this spec. */
export function nextTrainingFor(guide: ClassGuide, spec: SpecGuide, level: number): { level: number; training: SpecTraining } | undefined {
  for (const t of guide.training) {
    if (t.level <= level) continue;
    const training = trainingFor(guide, spec, t);
    if (training.core.length + training.situational.length > 0) return { level: t.level, training };
  }
  return undefined;
}

/**
 * When a spec first takes a talent that the trainer already sold higher ranks
 * of, the best of those ranks to buy now (e.g. Holy Shock rank 2 when Holy
 * Shock is taken at 42).
 */
export function catchUpRank(guide: ClassGuide, spec: SpecGuide, level: number): TrainSpell | undefined {
  const point = expandBuild(guide, spec.build).find((p) => p.level === level && p.rank === 1);
  if (!point) return undefined;
  let best: TrainSpell | undefined;
  for (const t of guide.training) {
    if (t.level >= level) break;
    for (const s of t.spells) {
      if (s.talent && s.name === point.talent.name && (s.rank ?? 1) > 1 && (s.rank ?? 1) > (best?.rank ?? 1)) best = s;
    }
  }
  return best;
}

export function formsAt(guide: ClassGuide, level: number): FormGuide[] {
  return guide.forms.filter((f) => f.level === level);
}

export function nextForm(guide: ClassGuide, level: number): FormGuide | undefined {
  return guide.forms.find((f) => f.level > level);
}

export function dungeonById(guide: ClassGuide, id: string): Dungeon {
  const d = guide.dungeons.find((x) => x.id === id);
  if (!d) throw new Error(`${guide.id}: unknown dungeon ${id}`);
  return d;
}

export type RangeStatus = 'in-range' | 'below' | 'above' | 'unknown';

export function rangeStatus(d: Dungeon, level: number): RangeStatus {
  if (!d.official) return 'unknown';
  if (level < d.official[0]) return 'below';
  if (level > d.official[1]) return 'above';
  return 'in-range';
}

export function rangeLabel(d: Dungeon): string {
  return d.official ? `${d.official[0]}-${d.official[1]}` : 'Classic';
}

/** Dungeons to show for a level: the bracket's picks still in (or near) range, else the next new one. */
export function dungeonsForLevel(guide: ClassGuide, level: number): { dungeon: Dungeon; note: string; status: RangeStatus }[] {
  const picks = bracketFor(guide, level).dungeons.map((p) => {
    const dungeon = dungeonById(guide, p.dungeon);
    return { dungeon, note: p.note, status: rangeStatus(dungeon, level) };
  });
  const usable = picks.filter((p) => p.status !== 'above');
  if (usable.length > 0) return usable;
  const next = guide.dungeons.find((d) => d.official && d.official[0] > level);
  return next ? [{ dungeon: next, note: 'Next new dungeon on your way up.', status: 'below' }] : [];
}

export function sourceById(guide: ClassGuide, id: string): Source {
  const s = guide.sources.find((x) => x.id === id);
  if (!s) throw new Error(`${guide.id}: unknown source ${id}`);
  return s;
}

export function noteById(guide: ClassGuide, id: string): UpdateNote {
  const n = guide.notes.find((x) => x.id === id);
  if (!n) throw new Error(`${guide.id}: unknown note ${id}`);
  return n;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}

export function classPath(guide: ClassGuide, page = ''): string {
  return `/${guide.id}/${page ? `${page}/` : ''}`;
}

export function bracketHref(guide: ClassGuide, b: Bracket): string {
  return `${classPath(guide, 'route')}#${b.id}`;
}

export function levelHref(guide: ClassGuide, level: number): string {
  return `${classPath(guide, `level/${level}`)}`;
}

/** Every structural rule the guide must satisfy. Returns a list of problems. */
export function validateGuide(guide: ClassGuide): string[] {
  const problems: string[] = [];
  const check = (cond: boolean, msg: string) => { if (!cond) problems.push(`${guide.id}: ${msg}`); };

  // Brackets: contiguous, ordered, unique ids, cover 1-60, each level maps to exactly one.
  const sorted = [...guide.brackets].sort((a, b) => a.min - b.min);
  check(sorted[0]?.min === MIN_LEVEL, 'first bracket must start at 1');
  check(sorted.at(-1)?.max === MAX_LEVEL, 'last bracket must end at 60');
  sorted.forEach((b, i) => {
    check(b.min <= b.max, `bracket ${b.id} has min > max`);
    check(b.id === `lvl-${b.min}-${b.max}`, `bracket id ${b.id} should be lvl-${b.min}-${b.max}`);
    const next = sorted[i + 1];
    if (next) check(next.min === b.max + 1, `gap or overlap between ${b.id} and ${next.id}`);
  });
  check(new Set(guide.brackets.map((b) => b.id)).size === guide.brackets.length, 'duplicate bracket ids');
  for (const level of LEVELS) {
    const matches = guide.brackets.filter((b) => level >= b.min && level <= b.max);
    check(matches.length === 1, `level ${level} maps to ${matches.length} brackets`);
  }

  // Specs: unique, non-reserved slugs and a valid default.
  const slugs = guide.specs.map((s) => s.slug);
  check(new Set(slugs).size === slugs.length, 'duplicate spec slugs');
  for (const s of slugs) check(!RESERVED_SLUGS.includes(s), `spec slug ${s} is reserved`);
  check(slugs.includes(guide.defaultSpec), `default spec ${guide.defaultSpec} is not a spec`);

  // Builds: rows, ranks, prerequisites and final splits.
  const builds: [TalentBuild, BuildVariant | undefined][] = [];
  for (const spec of guide.specs) {
    check(spec.build.startLevel === FIRST_TALENT_LEVEL, `${spec.slug} leveling build must start at ${FIRST_TALENT_LEVEL}`);
    builds.push([spec.build, undefined]);
    if (spec.variant) builds.push([spec.build, spec.variant]);
    for (const e of spec.endgameBuilds ?? []) {
      try {
        builds.push([endgameAsBuild(guide, e), undefined]);
      } catch (err) {
        problems.push(`${guide.id}: ${(err as Error).message}`);
      }
    }
  }
  for (const [build, variant] of builds) {
    try {
      const pts = expandBuild(guide, build, variant);
      const expectedTotal = MAX_LEVEL - FIRST_TALENT_LEVEL + 1;
      check(pts.length === expectedTotal, `${build.id} spends ${pts.length} points, expected ${expectedTotal}`);
      check(pts.at(-1)?.level === MAX_LEVEL, `${build.id} last point lands at ${pts.at(-1)?.level}`);
      const levels = pts.map((p) => p.level);
      check(levels.every((l, i) => i === 0 || l >= (levels[i - 1] ?? 0)), `${build.id} levels go backwards`);
      // Never more points than the character has at that level.
      for (const p of pts) check(p.n <= p.level - FIRST_TALENT_LEVEL + 1, `${build.id} point ${p.n} spent before level allows it`);
      const split = finalSplit(guide, pts);
      const want = variant ? variant.expected : build.expected;
      for (const t of guide.trees) check((split[t.id] ?? 0) === (want[t.id] ?? 0), `${build.id}${variant ? ' variant' : ''} ends ${t.id}=${split[t.id]}, expected ${want[t.id]}`);
    } catch (e) {
      problems.push(`${guide.id}: ${(e as Error).message}`);
    }
  }

  // Every bracket has advice for every spec.
  for (const b of guide.brackets) {
    for (const s of slugs) check((b.specPlan[s]?.length ?? 0) > 0, `${b.id} has no plan for ${s}`);
    for (const k of Object.keys(b.specPlan)) check(slugs.includes(k), `${b.id} plans for unknown spec ${k}`);
  }
  // Trainer overrides name real specs, and talent spells name real talents.
  for (const t of guide.training) {
    for (const s of t.spells) {
      for (const k of Object.keys(s.specs ?? {})) check(slugs.includes(k), `training ${t.level} ${s.name} overrides unknown spec ${k}`);
      if (s.talent) check(guide.talents.some((x) => x.name === s.name), `training ${t.level} ${s.name} is marked talent but no talent has that name`);
    }
  }

  // References resolve.
  const sourceIds = new Set(guide.sources.map((s) => s.id));
  const noteIds = new Set(guide.notes.map((n) => n.id));
  const refSources = (ids: readonly string[], where: string) => ids.forEach((id) => check(sourceIds.has(id), `${where} cites unknown source ${id}`));
  const refNotes = (ids: readonly string[] | undefined, where: string) => (ids ?? []).forEach((id) => check(noteIds.has(id), `${where} links unknown note ${id}`));
  const raceIds = new Set(guide.races.map((r) => r.id));
  const filterIds = new Set([...raceIds, 'alliance', 'horde']);
  for (const b of guide.brackets) {
    refSources(b.sources, b.id);
    refNotes(b.notes, b.id);
    b.dungeons.forEach((p) => check(guide.dungeons.some((d) => d.id === p.dungeon), `${b.id} picks unknown dungeon ${p.dungeon}`));
    b.raceBranches.forEach((r) => r.races.split(' ').forEach((id) => check(raceIds.has(id), `${b.id} branch for unknown race ${id}`)));
  }
  for (const d of guide.dungeons) refSources(d.sources, d.id);
  for (const f of guide.forms) {
    refSources(f.sources, f.id);
    const steps = f.quest ? [...f.quest.start, ...f.quest.steps, ...f.quest.travel] : [];
    steps.forEach((s) => (s.for ?? '').split(' ').filter(Boolean).forEach((id) => check(filterIds.has(id), `${f.id} step for unknown race/faction ${id}`)));
  }
  for (const spec of guide.specs) {
    refSources(spec.build.sources, spec.build.id);
    refNotes(spec.notes, spec.slug);
    refNotes(spec.endgameNotes, `${spec.slug} endgame`);
    const all = [...spec.sections, ...spec.endgame.sections];
    all.forEach((s) => { refSources(s.sources, `${spec.slug}#${s.id}`); refNotes(s.notes, `${spec.slug}#${s.id}`); });
    const ids = spec.sections.map((s) => s.id);
    check(new Set(ids).size === ids.length, `${spec.slug} has duplicate section ids`);
    const eids = spec.endgame.sections.map((s) => s.id);
    check(new Set(eids).size === eids.length, `${spec.slug} endgame has duplicate section ids`);
    if (spec.endgame.checklist) refSources(spec.endgame.checklist.sources, `${spec.slug} checklist`);
    if (spec.variant) refSources(spec.variant.sources, `${spec.slug} variant`);
    for (const e of spec.endgameBuilds ?? []) refSources(e.sources, `${spec.slug} ${e.id}`);
    check(spec.dualSpec.length > 0, `${spec.slug} has no dual spec advice`);
  }
  for (const s of guide.overview) { refSources(s.sources, `overview#${s.id}`); refNotes(s.notes, `overview#${s.id}`); }
  for (const n of guide.notes) refSources(n.sources, `note ${n.id}`);
  for (const s of guide.sources) check(s.url.startsWith('https://'), `source ${s.id} is not https`);
  check(new Set(guide.sources.map((s) => s.id)).size === guide.sources.length, 'duplicate source ids');

  // Training: levels ascending and within 1-60; every race belongs to a faction with a route.
  guide.training.forEach((t, i) => {
    check(t.level >= MIN_LEVEL && t.level <= MAX_LEVEL, `training level ${t.level} out of range`);
    const prev = guide.training[i - 1];
    if (prev) check(t.level > prev.level, `training levels not ascending at ${t.level}`);
  });
  for (const d of guide.dungeons) if (d.official) check(d.official[0] <= d.official[1] && d.official[1] <= MAX_LEVEL, `dungeon ${d.id} has a bad range`);

  return problems;
}
