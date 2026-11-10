// Content checks that run before every build: `node scripts/verify-content.ts`.
// 1. Structural rules for every registered class (validateGuide).
// 2. Every spec's leveling build against the order its source publishes,
//    written out here independently of the build data so a typo in either fails.
// 3. Level-60 build splits and official dungeon ranges.
// 4. The class-free zone finder: zones, hubs, brackets and every dungeon's levels.
import { classes, getClass } from '../src/data/registry.ts';
import type { ClassGuide } from '../src/data/types.ts';
import { validateWorld, worldBrackets, worldDungeons } from '../src/data/world/index.ts';
import { LEVELS, bracketFor, endgameAsBuild, expandBuild, finalSplit, pointsAtLevel, specBySlug, splitLabel, validateGuide } from '../src/lib/guide.ts';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

for (const guide of classes) problems.push(...validateGuide(guide));
if (LEVELS.length !== 60 || LEVELS[0] !== 1 || LEVELS.at(-1) !== 60) fail('LEVELS must be 1..60');

/** [from, to, talent name]: one point per level in that range. */
type Order = [number, number, string][];

function checkOrder(guide: ClassGuide, slug: string, ref: Order, split: string, source: string): string {
  const spec = specBySlug(guide, slug);
  const pts = expandBuild(guide, spec.build);
  let covered = 0;
  for (const [from, to, name] of ref) {
    for (let level = from; level <= to; level++) {
      covered += 1;
      const at = pointsAtLevel(pts, level);
      if (at.length !== 1 || at[0]?.talent.name !== name) fail(`${guide.id} ${slug}: level ${level} is ${at.map((p) => p.talent.name).join(',') || 'nothing'}, ${source} says ${name}`);
    }
  }
  if (covered !== 51) fail(`${guide.id} ${slug}: reference covers ${covered} levels, expected 51`);
  const got = splitLabel(guide, finalSplit(guide, pts));
  if (got !== split) fail(`${guide.id} ${slug}: final split ${got}, ${source} says ${split}`);
  return got;
}

function checkEndgame(guide: ClassGuide, slug: string, want: Record<string, string>): void {
  const spec = specBySlug(guide, slug);
  const got = Object.fromEntries((spec.endgameBuilds ?? []).map((b) => [b.id, splitLabel(guide, finalSplit(guide, expandBuild(guide, endgameAsBuild(guide, b))))]));
  if (JSON.stringify(got) !== JSON.stringify(want)) fail(`${guide.id} ${slug}: level-60 builds ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
}

function checkBrackets(guide: ClassGuide, ref: [number, number][]): void {
  const actual = guide.brackets.map((b) => [b.min, b.max]);
  if (JSON.stringify(actual) !== JSON.stringify(ref)) fail(`${guide.id} brackets ${JSON.stringify(actual)} differ from the reference`);
  for (const [min, max] of ref) {
    for (const level of [min, max]) {
      const b = bracketFor(guide, level);
      if (b.min !== min || b.max !== max) fail(`${guide.id}: level ${level} mapped to ${b.id}, expected lvl-${min}-${max}`);
    }
  }
}

// Official dungeon ranges from Blizzard's dungeon overview.
const official: Record<string, [number, number]> = {
  'hall-of-thanes': [13, 18], 'ruins-of-lordaeron': [15, 20], 'excavation-site': [24, 29], 'city-of-dalaran': [28, 33],
  'drowned-city': [35, 40], 'kroldok-stronghold': [40, 45], 'alcaz-prison': [48, 53], 'blackmaw-hold': [55, 60], 'shapers-terrace': [58, 60],
};
function checkDungeons(guide: ClassGuide): void {
  for (const [id, range] of Object.entries(official)) {
    const d = guide.dungeons.find((x) => x.id === id);
    if (!d || JSON.stringify(d.official) !== JSON.stringify(range)) fail(`${guide.id} dungeon ${id} range ${JSON.stringify(d?.official)} != official ${JSON.stringify(range)}`);
  }
  if (guide.dungeons.filter((d) => d.isNew).length !== 9) fail(`${guide.id}: expected nine new dungeons`);
}

// ---------------------------------------------------------------- Where to level (/zones/)
problems.push(...validateWorld());
// The in-game Group Finder's levels for the Classic dungeons (Forever Mastery's
// read of client 1.60.1.70790), written out independently of the world data.
const groupFinder: Record<string, [number, number]> = {
  'ragefire-chasm': [13, 18], 'wailing-caverns': [15, 24], deadmines: [17, 26], 'shadowfang-keep': [20, 30],
  'blackfathom-deeps': [24, 32], stockade: [24, 32], gnomeregan: [29, 38], 'razorfen-kraul': [29, 38],
  'scarlet-monastery': [30, 46], 'razorfen-downs': [37, 46], uldaman: [41, 51], zulfarrak: [44, 54], maraudon: [46, 55],
  'sunken-temple': [50, 60], 'blackrock-depths': [52, 60], 'dire-maul': [54, 60], 'blackrock-spire': [55, 60],
  scholomance: [58, 60], stratholme: [58, 60],
};
for (const [id, range] of Object.entries({ ...official, ...groupFinder })) {
  const d = worldDungeons.find((x) => x.id === id);
  if (!d || JSON.stringify(d.levels) !== JSON.stringify(range)) fail(`world dungeon ${id} levels ${JSON.stringify(d?.levels)} != ${JSON.stringify(range)}`);
}
// Every level has exactly one world bracket.
for (const n of LEVELS) if (worldBrackets.filter((b) => n >= b.min && n <= b.max).length !== 1) fail(`world: level ${n} needs exactly one bracket`);

// ---------------------------------------------------------------- Paladin
const paladin = getClass('paladin');
checkBrackets(paladin, [[1, 5], [6, 11], [12, 15], [16, 19], [20, 24], [25, 29], [30, 35], [36, 40], [41, 45], [46, 49], [50, 54], [55, 57], [58, 60]]);

// Mobalytics Progress "Prot Leveling 1-60".
const prot = checkOrder(paladin, 'protection', [
  [10, 14, 'Redoubt'], [15, 17, 'Precision'], [18, 19, 'Sacred Duty'], [20, 21, 'Shield Specialization'],
  [22, 22, 'Templar’s Bulwark'], [23, 24, 'Toughness'], [25, 25, 'Swift Judgement'], [26, 28, 'Improved Righteous Fury'],
  [29, 29, 'Anticipation'], [30, 30, 'Holy Shield'], [31, 35, 'Reckoning'], [36, 38, 'Iron Creed'], [39, 39, 'Anticipation'],
  [40, 40, 'Shieldsworn'], [41, 45, 'Deflection'], [46, 47, 'Improved Judgement'], [48, 50, 'Conviction'],
  [51, 52, 'Pursuit of Justice'], [53, 55, 'Anticipation'], [56, 58, 'Toughness'], [59, 60, 'Guardian’s Favor'],
], '0 / 39 / 12', 'Mobalytics');
const protSpec = specBySlug(paladin, 'protection');
const protVariant = expandBuild(paladin, protSpec.build, protSpec.variant);
if (splitLabel(paladin, finalSplit(paladin, protVariant)) !== '0 / 39 / 12') fail('paladin protection variant split');
for (let level = 41; level <= 45; level++) if (pointsAtLevel(protVariant, level)[0]?.talent.name !== 'Benediction') fail(`paladin protection variant: level ${level} should be Benediction`);

// Icy Veins Retribution leveling slider.
const ret = checkOrder(paladin, 'retribution', [
  [10, 14, 'Deflection'], [15, 16, 'Improved Judgement'], [17, 19, 'Conviction'], [20, 21, 'Pursuit of Justice'],
  [22, 22, 'Seal of Command'], [23, 24, 'Sanctified Judgement'], [25, 25, 'Sacred Arbiter'], [26, 28, 'Two-Handed Weapon Specialization'],
  [29, 29, 'Sanctified Judgement'], [30, 32, 'Vengeance'], [33, 33, 'Repentance'], [34, 34, 'Vindication'], [35, 39, 'Champion of the Light'],
  [40, 40, 'Unsealed Wrath'], [41, 45, 'Divine Strength'], [46, 47, 'Reverence'], [48, 50, 'Improved Seals'], [51, 52, 'Holy Conduit'],
  [53, 54, 'Improved Seals'], [55, 56, 'Purifying Power'], [57, 58, 'Divine Precision'], [59, 60, 'Vindication'],
], '18 / 0 / 33', 'Icy Veins');

// Icy Veins Holy leveling slider.
const holy = checkOrder(paladin, 'holy', [
  [10, 14, 'Benediction'], [15, 17, 'Conviction'], [18, 19, 'Improved Judgement'], [20, 21, 'Pursuit of Justice'],
  [22, 26, 'Spiritual Focus'], [27, 28, 'Reverence'], [29, 31, 'Healing Light'], [32, 36, 'Illumination'], [37, 37, 'Oath of Light'],
  [38, 39, 'Infusion of Light'], [40, 41, 'Holy Conduit'], [42, 42, 'Holy Shock'], [43, 44, 'Boundless Light'], [45, 45, 'Divine Favor'],
  [46, 46, 'Consecrated Ground'], [47, 51, 'Holy Power'], [52, 52, 'Light’s Vigil'], [53, 57, 'Divine Intellect'],
  [58, 58, 'Consecrated Ground'], [59, 60, 'Improved Seals'],
], '34 / 5 / 12', 'Icy Veins');

// Key unlocks the text relies on.
const protPts = expandBuild(paladin, protSpec.build);
const firstLevel = (name: string) => protPts.find((p) => p.talent.name === name)?.level;
for (const [name, level] of [['Shield Specialization', 20], ['Templar’s Bulwark', 22], ['Swift Judgement', 25], ['Holy Shield', 30], ['Reckoning', 31], ['Iron Creed', 36], ['Shieldsworn', 40]] as const) {
  if (firstLevel(name) !== level) fail(`paladin protection: ${name} first at ${firstLevel(name)}, text says ${level}`);
}

// Icy Veins level-60 calculators.
checkEndgame(paladin, 'protection', { 'deep-protection': '0 / 35 / 16', 'deep-holy-tank': '23 / 28 / 0' });
checkEndgame(paladin, 'retribution', { 'unsealed-wrath': '12 / 8 / 31', 'shockadin': '21 / 0 / 30' });
checkEndgame(paladin, 'holy', { 'lights-vigil': '31 / 8 / 12' });
checkDungeons(paladin);

// ---------------------------------------------------------------- Druid
const druid = getClass('druid');
checkBrackets(druid, [[1, 9], [10, 15], [16, 19], [20, 24], [25, 29], [30, 35], [36, 40], [41, 45], [46, 49], [50, 54], [55, 57], [58, 60]]);

// Icy Veins Feral leveling slider.
const feral = checkOrder(druid, 'feral', [
  [10, 14, 'Ferocity'], [15, 17, 'Feral Instinct'], [18, 19, 'Feral Swiftness'], [20, 20, 'Feral Charge'], [21, 22, 'Savage Fury'],
  [23, 24, 'Sharpened Claws'], [25, 25, 'Lacerate'], [26, 27, 'Blood Frenzy'], [28, 28, 'Predatory Discipline'], [29, 29, 'Predatory Strikes'],
  [30, 30, 'Leader of the Pack'], [31, 32, 'Natural Instinct'], [33, 34, 'Predatory Strikes'], [35, 39, 'Rend and Tear'], [40, 40, 'Primal Bite'],
  [41, 41, 'Shifting Power'], [42, 46, 'Heart of the Wild'], [47, 51, 'Naturalist'], [52, 56, 'Genesis'], [57, 58, 'Nature’s Reach'],
  [59, 60, 'Nature’s Majesty'],
], '9 / 32 / 10', 'Icy Veins');

// Icy Veins Balance leveling slider.
const balance = checkOrder(druid, 'balance', [
  [10, 14, 'Improved Wrath'], [15, 19, 'Nature’s Focus'], [20, 22, 'Reflection'], [23, 24, 'Nature’s Reach'], [25, 26, 'Nature’s Majesty'],
  [27, 27, 'Moonglow'], [28, 28, 'Nature’s Splendor'], [29, 30, 'Moonglow'], [31, 32, 'Improved Moonfire'], [33, 33, 'Insect Swarm'],
  [34, 37, 'Genesis'], [38, 38, 'Nature’s Grace'], [39, 39, 'Genesis'], [40, 44, 'Naturalist'], [45, 47, 'Eclipse'], [48, 52, 'Moonfury'],
  [53, 53, 'Moonkin Form'], [54, 58, 'Improved Starfire'], [59, 60, 'Vengeance'],
], '38 / 0 / 13', 'Icy Veins');

// Icy Veins Restoration leveling slider.
const resto = checkOrder(druid, 'restoration', [
  [10, 14, 'Improved Wrath'], [15, 19, 'Nature’s Focus'], [20, 22, 'Reflection'], [23, 24, 'Nature’s Reach'], [25, 26, 'Nature’s Majesty'],
  [27, 27, 'Moonglow'], [28, 28, 'Nature’s Splendor'], [29, 30, 'Moonglow'], [31, 32, 'Genesis'], [33, 33, 'Insect Swarm'],
  [34, 35, 'Naturalist'], [36, 36, 'Bloom'], [37, 39, 'Naturalist'], [40, 40, 'Gift of Nature'], [41, 41, 'Swiftmend'], [42, 45, 'Gift of Nature'],
  [46, 46, 'Nature’s Swiftness'], [47, 49, 'Living Spirit'], [50, 52, 'Improved Rejuvenation'], [53, 57, 'Improved Regrowth'],
  [58, 58, 'Wild Growth'], [59, 60, 'Genesis'],
], '18 / 0 / 33', 'Icy Veins');

checkEndgame(druid, 'balance', { 'balance-eclipse': '41 / 0 / 10' });
checkEndgame(druid, 'feral', { 'feral-hybrid': '8 / 33 / 10', 'feral-bear': '9 / 32 / 10', 'feral-cat': '8 / 33 / 10' });
checkEndgame(druid, 'restoration', { 'restoration-default': '18 / 0 / 33' });
checkDungeons(druid);
for (const r of druid.races) if (!r.faction) fail(`race ${r.id} has no faction`);

if (problems.length > 0) {
  console.error(`Content verification failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Content verified: ${classes.length} classes, ${classes.reduce((n, c) => n + c.specs.length, 0)} specs, 60 levels. Paladin: holy ${holy}, protection ${prot}, retribution ${ret}. Druid: balance ${balance}, feral ${feral}, restoration ${resto}.`);
