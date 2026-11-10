import type { EndgameBuild, Talent, TalentBuild, TalentTree } from '../../types.ts';

export const trees: TalentTree[] = [
  { id: 'balance', name: 'Balance' },
  { id: 'feral', name: 'Feral' },
  { id: 'restoration', name: 'Restoration' },
];

// Rows and max ranks come from the Forever Guide calculator [16] at launch,
// cross-checked against the live Icy Veins calculator [23]. `requires` lists
// the prerequisites Icy Veins' calculator shows (each at max rank).
// Summaries describe effects stated in [02]/[03]; "(Classic)" marks an effect
// carried over from Classic that Forever sources do not restate.
export const talents: Talent[] = [
  // Feral
  { id: 'ferocity', name: 'Ferocity', tree: 'feral', row: 1, maxRank: 5, summary: 'Cheaper core Bear and Cat attacks. In Forever it also covers Primal Bite.' },
  { id: 'furor', name: 'Furor', tree: 'feral', row: 1, maxRank: 5, summary: 'Moved to Feral at launch. Energy now regenerates outside Cat Form but is lost when you shift into Bear.' },
  { id: 'feral-instinct', name: 'Feral Instinct', tree: 'feral', row: 2, maxRank: 3, summary: 'More Swipe damage. It no longer adds Bear threat.' },
  { id: 'feral-swiftness', name: 'Feral Swiftness', tree: 'feral', row: 2, maxRank: 2, summary: 'Faster outdoor Cat movement and extra Dodge (Classic).' },
  { id: 'thick-hide', name: 'Thick Hide', tree: 'feral', row: 2, maxRank: 3, summary: 'More base armor in Bear, Cat and Moonkin Form. A tank pick at 60.' },
  { id: 'brutal-impact', name: 'Brutal Impact', tree: 'feral', row: 2, maxRank: 2, summary: 'Longer Bash and Pounce stuns and a shorter Bash cooldown. Not in this guide’s builds.' },
  { id: 'shredding-attacks', name: 'Shredding Attacks', tree: 'feral', row: 3, maxRank: 3, summary: 'Cheaper Shred and Lacerate. A Cat pick at 60.' },
  { id: 'feral-charge', name: 'Feral Charge', tree: 'feral', row: 3, maxRank: 1, summary: 'Bear charge that interrupts and roots. Forever adds a Cat version (30 s cooldown, no interrupt).' },
  { id: 'sharpened-claws', name: 'Sharpened Claws', tree: 'feral', row: 3, maxRank: 2, summary: 'Critical strike chance in Bear and Cat. Now 2 points.' },
  { id: 'savage-fury', name: 'Savage Fury', tree: 'feral', row: 3, maxRank: 2, summary: 'More damage from Claw, Rake, Maul and Swipe (Classic).' },
  { id: 'lacerate', name: 'Lacerate', tree: 'feral', row: 4, maxRank: 1, requires: 'savage-fury', summary: 'Stacking 15 s bleed (up to 5 stacks), high threat. Trainer ranks at 34, 42, 50 and 58.' },
  { id: 'predatory-strikes', name: 'Predatory Strikes', tree: 'feral', row: 4, maxRank: 3, summary: 'Up to +20% critical strike damage.' },
  { id: 'blood-frenzy', name: 'Blood Frenzy', tree: 'feral', row: 4, maxRank: 2, requires: 'sharpened-claws', summary: 'Merges Classic’s Primal Fury and Blood Frenzy: extra resource from critical strikes.' },
  { id: 'predatory-discipline', name: 'Predatory Discipline', tree: 'feral', row: 4, maxRank: 1, summary: 'Reported to let Ferocious Bite keep unused Energy. Required for Shifting Power.' },
  { id: 'leader-of-the-pack', name: 'Leader of the Pack', tree: 'feral', row: 5, maxRank: 1, summary: 'Party critical strike aura for spells and attacks. Doesn’t stack with Moonkin Aura.' },
  { id: 'natural-instinct', name: 'Natural Instinct', tree: 'feral', row: 5, maxRank: 2, summary: 'New. +10% melee critical strike damage per rank, and spell healing increased by 12% of your Intellect. Applies to Lacerate and Pounce since the November 9 hotfix.' },
  { id: 'rend-and-tear', name: 'Rend and Tear', tree: 'feral', row: 6, maxRank: 5, requires: 'predatory-strikes', summary: '+3/6/9/12/15% melee damage against bleeding targets.' },
  { id: 'natural-reaction', name: 'Natural Reaction', tree: 'feral', row: 6, maxRank: 5, summary: 'More Dodge, and a chance for 5 Rage when you dodge. The tanking swap.' },
  { id: 'primal-bite', name: 'Primal Bite', tree: 'feral', row: 7, maxRank: 1, requires: 'leader-of-the-pack', summary: 'Bear attack for 20 Rage with very high threat. Trainer ranks at 50 and 60.' },
  { id: 'shifting-power', name: 'Shifting Power', tree: 'feral', row: 7, maxRank: 1, requires: 'predatory-discipline', summary: 'Instantly gain 40 Energy for a large Mana cost on a 16 s cooldown. Replaces Tiger’s Fury.' },

  // Restoration
  { id: 'heart-of-the-wild', name: 'Heart of the Wild', tree: 'restoration', row: 1, maxRank: 5, summary: 'Intellect and Strength bonus, plus Stamina in Bear. Moved to Restoration at launch.' },
  { id: 'natures-focus', name: 'Nature’s Focus', tree: 'restoration', row: 1, maxRank: 5, summary: 'Less pushback on Nature and Arcane casts.' },
  { id: 'naturalist', name: 'Naturalist', tree: 'restoration', row: 2, maxRank: 5, summary: '+2-10% all damage, faster Healing Touch (Classic), and up to 0.5 s off Wild Growth’s cast.' },
  { id: 'reflection', name: 'Reflection', tree: 'restoration', row: 2, maxRank: 3, summary: 'Much more Mana regeneration while casting.' },
  { id: 'natural-shapeshifter', name: 'Natural Shapeshifter', tree: 'restoration', row: 2, maxRank: 3, summary: 'Cheaper shapeshifting. A mana fix for long Cat fights.' },
  { id: 'subtlety', name: 'Subtlety', tree: 'restoration', row: 3, maxRank: 3, summary: 'Less threat from Nature and Arcane spells. A Balance swap if threat is a problem.' },
  { id: 'gift-of-nature', name: 'Gift of Nature', tree: 'restoration', row: 3, maxRank: 5, summary: 'More healing from your heals (Classic).' },
  { id: 'bloom', name: 'Bloom', tree: 'restoration', row: 3, maxRank: 1, summary: 'When your Rejuvenation or Regrowth expires, the target is healed for 100% of your Spirit.' },
  { id: 'tranquil-spirit', name: 'Tranquil Spirit', tree: 'restoration', row: 4, maxRank: 5, summary: 'Cheaper Healing Touch and Tranquility. Not in this guide’s builds.' },
  { id: 'improved-rejuvenation', name: 'Improved Rejuvenation', tree: 'restoration', row: 4, maxRank: 3, summary: 'Stronger Rejuvenation (Classic).' },
  { id: 'swiftmend', name: 'Swiftmend', tree: 'restoration', row: 4, maxRank: 1, summary: 'Instant heal on a target with your own Rejuvenation or Regrowth. It does not consume the effect.' },
  { id: 'natures-swiftness', name: 'Nature’s Swiftness', tree: 'restoration', row: 5, maxRank: 1, requires: 'naturalist', summary: 'Your next Nature spell is instant. Pair it with Healing Touch. Requires Naturalist 5/5.' },
  { id: 'living-spirit', name: 'Living Spirit', tree: 'restoration', row: 5, maxRank: 3, summary: 'Increases Spirit by a percentage.' },
  { id: 'improved-tranquility', name: 'Improved Tranquility', tree: 'restoration', row: 5, maxRank: 2, summary: 'Up to 60% shorter Tranquility cooldown.' },
  { id: 'improved-regrowth', name: 'Improved Regrowth', tree: 'restoration', row: 6, maxRank: 5, requires: 'improved-rejuvenation', summary: 'Higher Regrowth critical strike chance (Classic). Requires Improved Rejuvenation.' },
  { id: 'wild-growth', name: 'Wild Growth', tree: 'restoration', row: 7, maxRank: 1, requires: 'living-spirit', summary: 'Group HoT for 7 s, strongest first. 3 s cast, 6 s cooldown, high Mana cost. Requires Living Spirit 3/3.' },

  // Balance
  { id: 'genesis', name: 'Genesis', tree: 'balance', row: 1, maxRank: 5, summary: '+2/4/6/8/10% periodic damage and healing, which also helps Rake, Rip and Lacerate.' },
  { id: 'improved-wrath', name: 'Improved Wrath', tree: 'balance', row: 1, maxRank: 5, summary: 'Faster (Classic) and cheaper Wrath.' },
  { id: 'natures-majesty', name: 'Nature’s Majesty', tree: 'balance', row: 2, maxRank: 2, summary: 'Critical strike chance with spells and melee attacks.' },
  { id: 'natures-reach', name: 'Nature’s Reach', tree: 'balance', row: 2, maxRank: 2, summary: 'Longer Balance spell range (Classic).' },
  { id: 'moonglow', name: 'Moonglow', tree: 'balance', row: 2, maxRank: 3, summary: 'Up to 24% cheaper damaging spells.' },
  { id: 'improved-moonfire', name: 'Improved Moonfire', tree: 'balance', row: 2, maxRank: 2, summary: 'More Moonfire damage and critical strike chance.' },
  { id: 'natures-splendor', name: 'Nature’s Splendor', tree: 'balance', row: 3, maxRank: 1, requires: 'natures-majesty', summary: 'Longer Moonfire, Rejuvenation, Regrowth and Insect Swarm.' },
  { id: 'improved-entangling-roots', name: 'Improved Entangling Roots', tree: 'balance', row: 3, maxRank: 3, summary: 'Entangling Roots deals more damage and breaks less easily. Not in this guide’s builds.' },
  { id: 'insect-swarm', name: 'Insect Swarm', tree: 'balance', row: 4, maxRank: 1, summary: 'A Nature damage-over-time spell that also lowers the target’s chance to hit. Trainer ranks at 30, 40, 50 and 60.' },
  { id: 'vengeance', name: 'Vengeance', tree: 'balance', row: 4, maxRank: 5, requires: 'improved-moonfire', summary: 'Up to +100% critical strike bonus for Arcane and Nature spells. Requires Improved Moonfire.' },
  { id: 'improved-starfire', name: 'Improved Starfire', tree: 'balance', row: 4, maxRank: 5, summary: 'Faster Starfire, with a small chance to stun.' },
  { id: 'overgrowth', name: 'Overgrowth', tree: 'balance', row: 5, maxRank: 2, summary: 'Root more targets with Entangling Roots. Not in this guide’s builds.' },
  { id: 'natures-grace', name: 'Nature’s Grace', tree: 'balance', row: 5, maxRank: 1, summary: 'Spell critical strikes speed up your casting and global cooldown by 10% for 3 sec.' },
  { id: 'eclipse', name: 'Eclipse', tree: 'balance', row: 5, maxRank: 3, summary: 'New. Wrath shortens your next two Starfires, storing up to 4 charges. This is what makes Starfire part of the rotation.' },
  { id: 'moonfury', name: 'Moonfury', tree: 'balance', row: 6, maxRank: 5, summary: 'Up to 10% more Arcane and Nature damage.' },
  { id: 'moonkin-form', name: 'Moonkin Form', tree: 'balance', row: 7, maxRank: 1, summary: 'Capstone form: much more armor from items, double Omen of Clarity procs, a 3% crit aura for the party and Polymorph protection. Trainer at 40.' },
];

// Leveling builds, one point per level from 10 to 60, each the Icy Veins level
// slider for that spec (Nov 4, read Nov 8): Feral [05], Balance [24],
// Restoration [28].
export const feralLeveling: TalentBuild = {
  id: 'feral-leveling',
  name: 'Feral leveling',
  role: 'Solo questing in Cat, dungeon tanking in Bear',
  startLevel: 10,
  steps: [
    ['ferocity', 5],
    ['feral-instinct', 3],
    ['feral-swiftness', 2],
    ['feral-charge', 1],
    ['savage-fury', 2],
    ['sharpened-claws', 2],
    ['lacerate', 1],
    ['blood-frenzy', 2],
    ['predatory-discipline', 1],
    ['predatory-strikes', 1],
    ['leader-of-the-pack', 1],
    ['natural-instinct', 2],
    ['predatory-strikes', 2],
    ['rend-and-tear', 5],
    ['primal-bite', 1],
    ['shifting-power', 1],
    ['heart-of-the-wild', 5],
    ['naturalist', 5],
    ['genesis', 5],
    ['natures-reach', 2],
    ['natures-majesty', 2],
  ],
  expected: { balance: 9, feral: 32, restoration: 10 },
  summary: 'Cheaper attacks first, Cat speed for when Cat Form arrives at 20, Lacerate at 25, Leader of the Pack at 30, then Primal Bite at 40 and Shifting Power at 41. Restoration and Balance after for passive damage. Final split 9 / 32 / 10.',
  sources: ['05', '16'],
};

export const balanceLeveling: TalentBuild = {
  id: 'balance-leveling',
  name: 'Balance leveling',
  role: 'Ranged questing with damage over time, healing yourself between pulls',
  startLevel: 10,
  steps: [
    ['improved-wrath', 5],
    ['natures-focus', 5],
    ['reflection', 3],
    ['natures-reach', 2],
    ['natures-majesty', 2],
    ['moonglow', 1],
    ['natures-splendor', 1],
    ['moonglow', 2],
    ['improved-moonfire', 2],
    ['insect-swarm', 1],
    ['genesis', 4],
    ['natures-grace', 1],
    ['genesis', 1],
    ['naturalist', 5],
    ['eclipse', 3],
    ['moonfury', 5],
    ['moonkin-form', 1],
    ['improved-starfire', 5],
    ['vengeance', 2],
  ],
  expected: { balance: 38, feral: 0, restoration: 13 },
  summary: 'Faster Wrath, pushback protection and mana regeneration first, then range for tagging at 23, Insect Swarm at 33, Eclipse at 45-47 and Moonkin Form at 53. Final split 38 / 0 / 13, which also works at 60.',
  sources: ['24', '16'],
};

export const restorationLeveling: TalentBuild = {
  id: 'restoration-leveling',
  name: 'Restoration leveling',
  role: 'Questing with Wrath and damage over time, healing every dungeon on the way',
  startLevel: 10,
  steps: [
    ['improved-wrath', 5],
    ['natures-focus', 5],
    ['reflection', 3],
    ['natures-reach', 2],
    ['natures-majesty', 2],
    ['moonglow', 1],
    ['natures-splendor', 1],
    ['moonglow', 2],
    ['genesis', 2],
    ['insect-swarm', 1],
    ['naturalist', 2],
    ['bloom', 1],
    ['naturalist', 3],
    ['gift-of-nature', 1],
    ['swiftmend', 1],
    ['gift-of-nature', 4],
    ['natures-swiftness', 1],
    ['living-spirit', 3],
    ['improved-rejuvenation', 3],
    ['improved-regrowth', 5],
    ['wild-growth', 1],
    ['genesis', 2],
  ],
  expected: { balance: 18, feral: 0, restoration: 33 },
  summary: 'The same damage start as Balance to 30, then Restoration: Bloom at 36, Swiftmend at 41, Nature’s Swiftness at 46 and Wild Growth at 58. Final split 18 / 0 / 33.',
  sources: ['28', '16'],
};

// Level-60 builds from the live Icy Veins calculators (Nov 4, read Nov 8).
export const balanceDefault: EndgameBuild = {
  id: 'balance-eclipse',
  name: 'Eclipse and DoTs (Icy Veins)',
  use: 'The default level-60 Balance build',
  ranks: {
    'improved-wrath': 5, 'genesis': 5, 'moonglow': 3, 'improved-moonfire': 2, 'natures-majesty': 2, 'natures-reach': 2, 'natures-splendor': 1,
    'insect-swarm': 1, 'vengeance': 5, 'improved-starfire': 5, 'natures-grace': 1, 'eclipse': 3, 'moonfury': 5, 'moonkin-form': 1,
    'natures-focus': 5, 'naturalist': 5,
  },
  expected: { balance: 41, feral: 0, restoration: 10 },
  body: 'Every key Balance talent: Moonkin Form, Eclipse, Insect Swarm and the Wrath and Starfire cast-time cuts. The five Genesis points are the optional ones.',
  options: [
    'Threat problems: Genesis into Subtlety.',
    'Mana problems: Genesis into Reflection.',
    'Nothing interrupts your casts: Nature’s Focus into Heart of the Wild.',
  ],
  sources: ['25'],
};

export const feralHybrid: EndgameBuild = {
  id: 'feral-hybrid',
  name: 'Hybrid Bear and Cat (Icy Veins)',
  use: 'Tank or deal damage with one build',
  ranks: {
    'genesis': 5, 'natures-majesty': 1, 'natures-reach': 2,
    'ferocity': 5, 'feral-swiftness': 2, 'feral-instinct': 3, 'thick-hide': 3, 'savage-fury': 2, 'feral-charge': 1, 'sharpened-claws': 2,
    'predatory-strikes': 3, 'lacerate': 1, 'predatory-discipline': 1, 'leader-of-the-pack': 1, 'natural-instinct': 2, 'rend-and-tear': 5,
    'primal-bite': 1, 'shifting-power': 1,
    'heart-of-the-wild': 5, 'naturalist': 5,
  },
  expected: { balance: 8, feral: 33, restoration: 10 },
  body: 'Almost everything in Feral for both forms, with Genesis and Nature’s Reach in Balance and Heart of the Wild and Naturalist in Restoration. Slightly weaker than a one-role build, but it leaves your second spec free for Balance, Restoration or PvP.',
  options: [
    'Hit capped at 8% from gear? Move Nature’s Reach into the second Nature’s Majesty point and a Blood Frenzy point.',
    'Surviving everything comfortably? Thick Hide into Blood Frenzy and Nature’s Majesty for damage.',
  ],
  sources: ['29'],
};

export const feralBear: EndgameBuild = {
  id: 'feral-bear',
  name: 'Bear tank only (Icy Veins)',
  use: 'A dedicated tank',
  ranks: {
    'genesis': 5, 'natures-majesty': 2, 'natures-reach': 2,
    'ferocity': 5, 'feral-swiftness': 2, 'feral-instinct': 3, 'thick-hide': 3, 'savage-fury': 2, 'feral-charge': 1, 'sharpened-claws': 2,
    'predatory-strikes': 3, 'lacerate': 1, 'blood-frenzy': 1, 'leader-of-the-pack': 1, 'natural-instinct': 2, 'rend-and-tear': 5, 'primal-bite': 1,
    'heart-of-the-wild': 5, 'naturalist': 5,
  },
  expected: { balance: 9, feral: 32, restoration: 10 },
  body: 'Drops Predatory Discipline and Shifting Power for the rest of the Bear talents. Cat damage suffers a lot, so take it only if you just tank.',
  options: ['Single-target bosses only: Feral Instinct into the last Blood Frenzy point and two Shredding Attacks points for more Maul.'],
  sources: ['29'],
};

export const feralCat: EndgameBuild = {
  id: 'feral-cat',
  name: 'Cat DPS (Icy Veins)',
  use: 'Pure melee damage',
  ranks: {
    'genesis': 5, 'natures-majesty': 2, 'natures-reach': 1,
    'ferocity': 5, 'furor': 3, 'feral-swiftness': 2, 'shredding-attacks': 3, 'savage-fury': 2, 'feral-charge': 1, 'sharpened-claws': 2,
    'predatory-strikes': 3, 'predatory-discipline': 1, 'blood-frenzy': 2, 'leader-of-the-pack': 1, 'natural-instinct': 2, 'rend-and-tear': 5,
    'shifting-power': 1,
    'heart-of-the-wild': 5, 'naturalist': 5,
  },
  expected: { balance: 8, feral: 33, restoration: 10 },
  body: 'Drops Primal Bite and Thick Hide for every Cat talent. You lose most of your tanking tools, so only use it if you never tank.',
  options: ['Want to sneak better? Furor into Feral Instinct for Prowl.'],
  sources: ['29'],
};

export const restorationDefault: EndgameBuild = {
  id: 'restoration-default',
  name: 'Restoration default (Icy Veins)',
  use: 'Dungeons and raids',
  ranks: {
    'improved-wrath': 5, 'genesis': 5, 'moonglow': 2, 'natures-majesty': 2, 'natures-reach': 2, 'natures-splendor': 1, 'insect-swarm': 1,
    'heart-of-the-wild': 5, 'naturalist': 5, 'reflection': 3, 'gift-of-nature': 5, 'bloom': 1, 'improved-rejuvenation': 3, 'swiftmend': 1,
    'natures-swiftness': 1, 'living-spirit': 3, 'improved-regrowth': 5, 'wild-growth': 1,
  },
  expected: { balance: 18, feral: 0, restoration: 33 },
  body: 'About 85% of a Restoration build is fixed. This one leans on Regrowth, keeps Nature’s Swiftness for emergencies and spends the flexible Balance points on Improved Wrath, Genesis and Nature’s Splendor.',
  options: [
    'Never casting damage in raids? Improved Wrath can go, though nothing in reach heals much more.',
    'Icy Veins skips Nature’s Grace for now because of bugs. Check again after launch.',
  ],
  sources: ['30', '12'],
};
