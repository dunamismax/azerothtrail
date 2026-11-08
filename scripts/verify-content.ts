// Content checks that run before every build: `node scripts/verify-content.ts`.
// 1. Structural rules for every registered class (validateGuide).
// 2. Druid cross-checks against the PDF's own wording, written out
//    independently of the build data so a typo in either one fails.
import { classes, getClass } from '../src/data/registry.ts';
import { LEVELS, bracketFor, expandBuild, finalSplit, pointsAtLevel, splitLabel, validateGuide } from '../src/lib/guide.ts';

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

for (const guide of classes) problems.push(...validateGuide(guide));

const druid = getClass('druid');

// PDF page 2-3 bracket ranges.
const pdfBrackets: [number, number][] = [
  [1, 9], [10, 15], [16, 19], [20, 24], [25, 29], [30, 35],
  [36, 40], [41, 45], [46, 49], [50, 54], [55, 57], [58, 60],
];
const actual = druid.brackets.map((b) => [b.min, b.max]);
if (JSON.stringify(actual) !== JSON.stringify(pdfBrackets)) fail(`druid brackets ${JSON.stringify(actual)} differ from the PDF`);

// Boundary spot checks: each level lands in the right bracket.
for (const [min, max] of pdfBrackets) {
  for (const level of [min, max]) {
    const b = bracketFor(druid, level);
    if (b.min !== min || b.max !== max) fail(`level ${level} mapped to ${b.id}, expected lvl-${min}-${max}`);
  }
}
if (LEVELS.length !== 60 || LEVELS[0] !== 1 || LEVELS.at(-1) !== 60) fail('LEVELS must be 1..60');

// PDF page 4: "Every talent point".
const pdfFeral: [number, number, string][] = [
  [10, 14, 'Ferocity'], [15, 17, 'Feral Instinct'], [18, 19, 'Feral Swiftness'],
  [20, 20, 'Feral Charge'], [21, 22, 'Sharpened Claws'], [23, 24, 'Savage Fury'], [25, 25, 'Lacerate'],
  [26, 28, 'Predatory Strikes'], [29, 29, 'Blood Frenzy'],
  [30, 30, 'Leader of the Pack'], [31, 31, 'Blood Frenzy'], [32, 34, 'Furor'], [35, 39, 'Rend and Tear'],
  [40, 40, 'Primal Bite'], [41, 41, 'Predatory Discipline'], [42, 42, 'Shifting Power'],
  [43, 47, 'Heart of the Wild'], [48, 52, 'Naturalist'], [53, 55, 'Reflection'], [56, 60, 'Genesis'],
];
const feral = expandBuild(druid, druid.leveling.build);
for (const [from, to, name] of pdfFeral) {
  for (let level = from; level <= to; level++) {
    const at = pointsAtLevel(feral, level);
    if (at.length !== 1) fail(`feral: level ${level} has ${at.length} points`);
    else if (at[0]?.talent.name !== name) fail(`feral: level ${level} is ${at[0]?.talent.name}, PDF says ${name}`);
  }
}
const feralSplit = splitLabel(druid, finalSplit(druid, feral));
if (feralSplit !== '5 / 33 / 13') fail(`feral final split ${feralSplit}, PDF says 5 / 33 / 13`);

const tank = expandBuild(druid, druid.leveling.build, druid.leveling.variant);
const tankSplit = splitLabel(druid, finalSplit(druid, tank));
if (tankSplit !== '0 / 38 / 13') fail(`tank variant split ${tankSplit}, expected 0 / 38 / 13`);
for (let level = 56; level <= 60; level++) {
  if (pointsAtLevel(tank, level)[0]?.talent.name !== 'Natural Reaction') fail(`tank variant: level ${level} should be Natural Reaction`);
}

// PDF page 6: Restoration from 40.
const pdfResto40: [string, number][] = [
  ['Heart of the Wild', 5], ['Nature’s Focus', 5], ['Naturalist', 5], ['Reflection', 3], ['Gift of Nature', 5],
  ['Bloom', 1], ['Improved Rejuvenation', 3], ['Swiftmend', 1], ['Nature’s Swiftness', 1], ['Improved Regrowth', 1], ['Wild Growth', 1],
];
const resto = expandBuild(druid, druid.endgame.build);
const at40 = pointsAtLevel(resto, 40);
if (at40.length !== 31) fail(`resto: ${at40.length} points at 40, expected 31`);
const order40: [string, number][] = [];
for (const p of at40) {
  const last = order40.at(-1);
  if (last && last[0] === p.talent.name) last[1] += 1;
  else order40.push([p.talent.name, 1]);
}
if (JSON.stringify(order40) !== JSON.stringify(pdfResto40)) fail(`resto 40 order ${JSON.stringify(order40)} differs from the PDF`);
const pdfResto: [number, number, string][] = [
  [41, 45, 'Genesis'], [46, 47, 'Nature’s Majesty'], [48, 49, 'Nature’s Reach'], [50, 50, 'Improved Wrath'], [51, 51, 'Nature’s Splendor'],
  [52, 55, 'Improved Regrowth'], [56, 58, 'Living Spirit'], [59, 60, 'Improved Tranquility'],
];
for (const [from, to, name] of pdfResto) {
  for (let level = from; level <= to; level++) {
    const at = pointsAtLevel(resto, level);
    if (at.length !== 1 || at[0]?.talent.name !== name) fail(`resto: level ${level} is ${at.map((p) => p.talent.name).join(',')}, PDF says ${name}`);
  }
}
const at40Split = splitLabel(druid, at40.at(-1)?.totals ?? {});
if (at40Split !== '0 / 0 / 31') fail(`resto at 40 split ${at40Split}, PDF says 31 Restoration`);
const at51 = pointsAtLevel(resto, 51)[0];
if (splitLabel(druid, at51?.totals ?? {}) !== '11 / 0 / 31') fail('resto at 51 should be 11 / 0 / 31');
const restoSplit = splitLabel(druid, finalSplit(druid, resto));
if (restoSplit !== '11 / 0 / 40') fail(`resto final split ${restoSplit}, PDF says 11 / 0 / 40`);

// Official dungeon ranges from Blizzard's dungeon overview [07].
const official: Record<string, [number, number]> = {
  'hall-of-thanes': [13, 18], 'ruins-of-lordaeron': [15, 20], 'excavation-site': [24, 29], 'city-of-dalaran': [28, 33],
  'drowned-city': [35, 40], 'kroldok-stronghold': [40, 45], 'alcaz-prison': [48, 53], 'blackmaw-hold': [55, 60], 'shapers-terrace': [58, 60],
};
for (const [id, range] of Object.entries(official)) {
  const d = druid.dungeons.find((x) => x.id === id);
  if (!d || JSON.stringify(d.official) !== JSON.stringify(range)) fail(`dungeon ${id} range ${JSON.stringify(d?.official)} != official ${JSON.stringify(range)}`);
}
if (druid.dungeons.filter((d) => d.isNew).length !== 9) fail('expected nine new dungeons');

// Every race has a faction column and a start; every level renders a panel's inputs.
for (const r of druid.races) if (!r.faction) fail(`race ${r.id} has no faction`);
for (const level of LEVELS) bracketFor(druid, level);

if (problems.length > 0) {
  console.error(`Content verification failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Content verified: ${classes.length} class(es), 60 levels, ${druid.brackets.length} brackets, feral ${feralSplit}, tank variant ${tankSplit}, restoration ${restoSplit}.`);
