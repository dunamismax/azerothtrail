// Shared content types. Every class guide is a `ClassGuide` value built from
// typed, class-specific files under src/data/classes/<class>/.

export type Faction = 'alliance' | 'horde';

export const FACTIONS: readonly Faction[] = ['alliance', 'horde'];

export const FACTION_LABEL: Record<Faction, string> = {
  alliance: 'Alliance',
  horde: 'Horde',
};

/** ISO date, YYYY-MM-DD. */
export type IsoDate = string;

export interface Race {
  /** Stable id, also used in `data-race` attributes and stored preferences. */
  id: string;
  name: string;
  faction: Faction;
  startZone: string;
  note?: string;
}

export interface Source {
  /** Two-digit id, stable once published (pages link to #src-<id>). */
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** What we rely on this source for. */
  covers: string;
  /** Date we last read it, or null when it is listed for reference but not rechecked. */
  checked: IsoDate | null;
  /** Source's own "last updated" date, when it shows one. */
  sourceUpdated?: IsoDate;
}

export type NoteKind = 'update' | 'correction' | 'uncertain' | 'confirmed';

/** A short, sourced note shown next to the section it changes. */
export interface UpdateNote {
  id: string;
  kind: NoteKind;
  date: IsoDate;
  title: string;
  body: string;
  /** The earlier advice, when the note changes or qualifies it. */
  previously?: string;
  sources: string[];
}

export interface Dungeon {
  id: string;
  name: string;
  zone: string;
  /** Official level range, or null for a Classic dungeon Forever has not published a range for. */
  official: [number, number] | null;
  isNew: boolean;
  location: string;
  access?: string;
  /** Faction with the easier walk to the entrance, when the source says so. */
  easierFor?: Faction;
  sources: string[];
}

export interface DungeonPick {
  dungeon: string;
  note: string;
}

export interface FactionRoute {
  /** One-line main plan for this faction. */
  primary: string;
  hubs: string[];
  alternatives: string[];
  travel: string[];
}

export interface RaceBranch {
  /** Space-separated race ids this branch applies to. */
  races: string;
  title: string;
  steps: string[];
  uncertain?: boolean;
}

export interface Bracket {
  /** Stable slug, used for #anchors and links. Never rename a published id. */
  id: string;
  min: number;
  max: number;
  title: string;
  alliance: FactionRoute;
  horde: FactionRoute;
  raceBranches: RaceBranch[];
  /** Advice for every spec: training, class quests, travel. */
  plan: string[];
  /** Extra advice per spec slug: how that spec plays this bracket. Every spec needs an entry. */
  specPlan: Record<string, string[]>;
  dungeons: DungeonPick[];
  zoneNotes?: string[];
  notes?: string[];
  sources: string[];
}

export type TrainPriority = 'core' | 'situational' | 'defer';

export interface TrainSpell {
  name: string;
  rank?: number;
  /** Priority for every spec unless `specs` overrides it. */
  priority: TrainPriority;
  /** Per-spec priority, keyed by spec slug. */
  specs?: Partial<Record<string, TrainPriority>>;
  /**
   * Requires a talent of the same name. The spell is listed only for specs
   * whose leveling build has that talent by the trainer level.
   */
  talent?: boolean;
  note?: string;
}

export interface TrainingLevel {
  level: number;
  spells: TrainSpell[];
}

export interface QuestStep {
  text: string;
  /** Faction or race filter: space-separated faction or race ids. Omit for everyone. */
  for?: string;
}

export interface FormGuide {
  id: string;
  name: string;
  level: number;
  how: 'class quest' | 'trainer';
  summary: string;
  useFor: string[];
  keyAbilities: string[];
  quest?: {
    name: string;
    start: QuestStep[];
    steps: QuestStep[];
    travel: QuestStep[];
  };
  notes?: string[];
  sources: string[];
}

export interface TalentTree {
  id: string;
  name: string;
}

export interface Talent {
  id: string;
  name: string;
  tree: string;
  /** 1-based row. Row n unlocks at (n - 1) * 5 points in the tree. */
  row: number;
  maxRank: number;
  /** Talent id that must be at max rank first, where a source confirms it. */
  requires?: string;
  summary: string;
}

/** [talent id, ranks to add] in spending order. */
export type BuildStep = readonly [string, number];

export interface TalentBuild {
  id: string;
  name: string;
  role: string;
  /** Level of the first point. Every earlier point (from level 10) is spent at this level too. */
  startLevel: number;
  steps: readonly BuildStep[];
  /** Intended final split per tree id; verified at build time. */
  expected: Record<string, number>;
  summary: string;
  sources: string[];
}

export interface Milestone {
  level: number;
  text: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  body: string;
}

/** A compact table: first column is the row label. */
export interface GuideTable {
  head: readonly string[];
  rows: readonly (readonly string[])[];
}

/** One block of a spec page. Fill whichever parts the section needs. */
export interface GuideSection {
  id: string;
  title: string;
  lead?: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  table?: GuideTable;
  callout?: string;
  notes?: string[];
  sources: string[];
}

export interface BuildVariant {
  title: string;
  body: string;
  /** Replace these points (by level range) with another talent. */
  swap: { from: string; to: string; levels: readonly [number, number] };
  expected: Record<string, number>;
  sources: string[];
}

/** A level-60 build: ranks per talent id, spent at 60 after a respec. */
export interface EndgameBuild {
  id: string;
  name: string;
  /** What the build is for, in a few words. */
  use: string;
  ranks: Record<string, number>;
  expected: Record<string, number>;
  body: string;
  /** Talent swaps the source suggests, as short sentences. */
  options?: string[];
  sources: string[];
}

export type SpecRole = 'tank' | 'healer' | 'melee' | 'ranged';

export const ROLE_LABEL: Record<SpecRole, string> = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee damage',
  ranged: 'Ranged damage',
};

export interface SpecGuide {
  /** URL slug: /<class>/<slug>/ and /<class>/<slug>/endgame/. Also the stored preference. */
  slug: string;
  /** Spec name, e.g. "Protection". */
  name: string;
  role: SpecRole;
  /** Other roles the spec covers well, e.g. a Feral Druid tanks and deals damage. */
  alsoRoles?: SpecRole[];
  /** One line for spec cards: who should pick it. */
  pitch: string;
  /** Leveling-page lead paragraph. */
  lead: string;
  strengths: string[];
  weaknesses: string[];
  /** How the spec compares on the things a leveler cares about. Short phrases. */
  compare: { solo: string; groups: string; mana: string; endgame: string };
  /** The 10-60 leveling build. */
  build: TalentBuild;
  variant?: BuildVariant;
  /** Level-60 builds, best default first. Omit when the leveling build is the 60 build. */
  endgameBuilds?: EndgameBuild[];
  /** Advice for the second spec slot at 40. */
  dualSpec: string[];
  /** Leveling sections. */
  sections: GuideSection[];
  /** Level-60 page. */
  endgame: {
    lead: string;
    sections: GuideSection[];
    checklist?: { id: string; title: string; lead: string; items: ChecklistItem[]; sources: string[] };
  };
  notes?: string[];
  endgameNotes?: string[];
}

export interface ClassGuide {
  id: string;
  name: string;
  ruleset: string;
  tagline: string;
  lastVerified: IsoDate;
  /** Lead paragraph for the Sources page. */
  sourcesLead: string;
  races: Race[];
  trees: TalentTree[];
  talents: Talent[];
  /** Every spec, in the game's tree order. Each one has a full 10-60 leveling build. */
  specs: SpecGuide[];
  /** Slug of the spec shown before a visitor picks one. */
  defaultSpec: string;
  brackets: Bracket[];
  dungeons: Dungeon[];
  training: TrainingLevel[];
  forms: FormGuide[];
  milestones: Milestone[];
  sources: Source[];
  notes: UpdateNote[];
  /** Label for the class-quest page, so a class can name it in its own words. */
  questsLabel: string;
  /** Short nav label for the class-quest page. */
  questsNav: string;
  questsLead: string;
  /** One sentence for the class card on the home page. */
  pitch: string;
  /** Advice for every spec, shown on the spec chooser page: races, professions, time savers. */
  overview: GuideSection[];
}
