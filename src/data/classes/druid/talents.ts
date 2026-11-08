import type { Talent, TalentBuild, TalentTree } from '../../types.ts';

export const trees: TalentTree[] = [
  { id: 'balance', name: 'Balance' },
  { id: 'feral', name: 'Feral' },
  { id: 'restoration', name: 'Restoration' },
];

// Rows and max ranks come from the Forever Guide calculator [16] at launch.
// `requires` lists only prerequisites a source confirms ([02], [03]).
// Summaries describe effects stated in [02]/[03]; "(Classic)" marks an effect
// carried over from Classic that Forever sources do not restate.
export const talents: Talent[] = [
  // Feral
  { id: 'ferocity', name: 'Ferocity', tree: 'feral', row: 1, maxRank: 5, summary: 'Cheaper core Bear and Cat attacks. In Forever it also covers Primal Bite.' },
  { id: 'furor', name: 'Furor', tree: 'feral', row: 1, maxRank: 5, summary: 'Moved to Feral at launch. Energy now regenerates outside Cat Form but is lost when you shift into Bear.' },
  { id: 'feral-instinct', name: 'Feral Instinct', tree: 'feral', row: 2, maxRank: 3, summary: 'More Swipe damage. It no longer adds Bear threat.' },
  { id: 'feral-swiftness', name: 'Feral Swiftness', tree: 'feral', row: 2, maxRank: 2, summary: 'Faster outdoor Cat movement and extra Dodge (Classic).' },
  { id: 'thick-hide', name: 'Thick Hide', tree: 'feral', row: 2, maxRank: 3, summary: 'More armor from items (Classic). Not in this build.' },
  { id: 'feral-charge', name: 'Feral Charge', tree: 'feral', row: 3, maxRank: 1, summary: 'Bear charge that interrupts and roots. Forever adds a Cat version (30 s cooldown, no interrupt).' },
  { id: 'sharpened-claws', name: 'Sharpened Claws', tree: 'feral', row: 3, maxRank: 2, summary: 'Critical strike chance in Bear and Cat. Now 2 points.' },
  { id: 'savage-fury', name: 'Savage Fury', tree: 'feral', row: 3, maxRank: 2, summary: 'More damage from Claw, Rake, Maul and Swipe (Classic).' },
  { id: 'lacerate', name: 'Lacerate', tree: 'feral', row: 4, maxRank: 1, summary: 'Stacking 15 s bleed (up to 5 stacks), high threat. Trainer ranks at 34, 42, 50 and 58.' },
  { id: 'predatory-strikes', name: 'Predatory Strikes', tree: 'feral', row: 4, maxRank: 3, summary: 'Up to +20% critical strike damage.' },
  { id: 'blood-frenzy', name: 'Blood Frenzy', tree: 'feral', row: 4, maxRank: 2, summary: 'Merges Classic’s Primal Fury and Blood Frenzy: extra resource from critical strikes.' },
  { id: 'predatory-discipline', name: 'Predatory Discipline', tree: 'feral', row: 4, maxRank: 1, summary: 'Reported to let Ferocious Bite keep unused Energy. Required for Shifting Power.' },
  { id: 'leader-of-the-pack', name: 'Leader of the Pack', tree: 'feral', row: 5, maxRank: 1, summary: 'Party critical strike aura for spells and attacks. Doesn’t stack with Moonkin Aura.' },
  { id: 'rend-and-tear', name: 'Rend and Tear', tree: 'feral', row: 6, maxRank: 5, summary: '+3/6/9/12/15% melee damage against bleeding targets.' },
  { id: 'natural-reaction', name: 'Natural Reaction', tree: 'feral', row: 6, maxRank: 5, summary: 'More Dodge, and a chance for 5 Rage when you dodge. The tanking swap.' },
  { id: 'primal-bite', name: 'Primal Bite', tree: 'feral', row: 7, maxRank: 1, requires: 'leader-of-the-pack', summary: 'Bear attack for 20 Rage with very high threat. Trainer ranks at 50 and 60.' },
  { id: 'shifting-power', name: 'Shifting Power', tree: 'feral', row: 7, maxRank: 1, requires: 'predatory-discipline', summary: 'Instantly gain 40 Energy for a large Mana cost on a 16 s cooldown. Replaces Tiger’s Fury.' },

  // Restoration
  { id: 'heart-of-the-wild', name: 'Heart of the Wild', tree: 'restoration', row: 1, maxRank: 5, summary: 'Intellect and Strength bonus, plus Stamina in Bear. Moved to Restoration at launch.' },
  { id: 'natures-focus', name: 'Nature’s Focus', tree: 'restoration', row: 1, maxRank: 5, summary: 'Less pushback on Nature and Arcane casts.' },
  { id: 'naturalist', name: 'Naturalist', tree: 'restoration', row: 2, maxRank: 5, summary: '+2-10% all damage, faster Healing Touch (Classic), and up to 0.5 s off Wild Growth’s cast.' },
  { id: 'reflection', name: 'Reflection', tree: 'restoration', row: 2, maxRank: 3, summary: 'Much more Mana regeneration while casting.' },
  { id: 'gift-of-nature', name: 'Gift of Nature', tree: 'restoration', row: 3, maxRank: 5, summary: 'More healing from your heals (Classic).' },
  { id: 'bloom', name: 'Bloom', tree: 'restoration', row: 3, maxRank: 1, summary: 'When your Rejuvenation or Regrowth expires, the target is healed for 100% of your Spirit.' },
  { id: 'improved-rejuvenation', name: 'Improved Rejuvenation', tree: 'restoration', row: 4, maxRank: 3, summary: 'Stronger Rejuvenation (Classic).' },
  { id: 'swiftmend', name: 'Swiftmend', tree: 'restoration', row: 4, maxRank: 1, summary: 'Instant heal on a target with your own Rejuvenation or Regrowth. It does not consume the effect.' },
  { id: 'natures-swiftness', name: 'Nature’s Swiftness', tree: 'restoration', row: 5, maxRank: 1, summary: 'Your next Nature spell is instant. Pair it with Healing Touch.' },
  { id: 'living-spirit', name: 'Living Spirit', tree: 'restoration', row: 5, maxRank: 3, summary: 'Increases Spirit by a percentage.' },
  { id: 'improved-tranquility', name: 'Improved Tranquility', tree: 'restoration', row: 5, maxRank: 2, summary: 'Up to 60% shorter Tranquility cooldown.' },
  { id: 'improved-regrowth', name: 'Improved Regrowth', tree: 'restoration', row: 6, maxRank: 5, requires: 'improved-rejuvenation', summary: 'Higher Regrowth critical strike chance (Classic). Requires Improved Rejuvenation.' },
  { id: 'wild-growth', name: 'Wild Growth', tree: 'restoration', row: 7, maxRank: 1, summary: 'Group HoT for 7 s, strongest first. 3 s cast, 6 s cooldown, high Mana cost.' },

  // Balance
  { id: 'genesis', name: 'Genesis', tree: 'balance', row: 1, maxRank: 5, summary: '+2/4/6/8/10% periodic damage and healing, which also helps Rake, Rip and Lacerate.' },
  { id: 'improved-wrath', name: 'Improved Wrath', tree: 'balance', row: 1, maxRank: 5, summary: 'Faster (Classic) and cheaper Wrath.' },
  { id: 'natures-majesty', name: 'Nature’s Majesty', tree: 'balance', row: 2, maxRank: 2, summary: 'Critical strike chance with spells and melee attacks.' },
  { id: 'natures-reach', name: 'Nature’s Reach', tree: 'balance', row: 2, maxRank: 2, summary: 'Longer Balance spell range (Classic).' },
  { id: 'natures-splendor', name: 'Nature’s Splendor', tree: 'balance', row: 3, maxRank: 1, requires: 'natures-majesty', summary: 'Longer Moonfire, Rejuvenation, Regrowth and Insect Swarm.' },
];

// Feral, one point per level from 10 to 60. Blood Frenzy is split across 29
// and 31 around Leader of the Pack at 30.
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
    ['sharpened-claws', 2],
    ['savage-fury', 2],
    ['lacerate', 1],
    ['predatory-strikes', 3],
    ['blood-frenzy', 1],
    ['leader-of-the-pack', 1],
    ['blood-frenzy', 1],
    ['furor', 3],
    ['rend-and-tear', 5],
    ['primal-bite', 1],
    ['predatory-discipline', 1],
    ['shifting-power', 1],
    ['heart-of-the-wild', 5],
    ['naturalist', 5],
    ['reflection', 3],
    ['genesis', 5],
  ],
  expected: { balance: 5, feral: 33, restoration: 13 },
  summary: 'A solo-first build with early Swipe damage and enough Bear tools for regular five-player tanking. Final split 5 / 33 / 13.',
  sources: ['16', '03', '05'],
};

// Deep Restoration on the second spec: 31 points at 40, then one per level.
export const restorationBuild: TalentBuild = {
  id: 'restoration-deep',
  name: 'Deep Restoration (dungeons)',
  role: 'Five-player healing from 40, main group role at 60',
  startLevel: 40,
  steps: [
    // 31 points at 40
    ['heart-of-the-wild', 5],
    ['natures-focus', 5],
    ['naturalist', 5],
    ['reflection', 3],
    ['gift-of-nature', 5],
    ['bloom', 1],
    ['improved-rejuvenation', 3],
    ['swiftmend', 1],
    ['natures-swiftness', 1],
    ['improved-regrowth', 1],
    ['wild-growth', 1],
    // 41-51: Balance
    ['genesis', 5],
    ['natures-majesty', 2],
    ['natures-reach', 2],
    ['improved-wrath', 1],
    ['natures-splendor', 1],
    // 52-60: finish Restoration
    ['improved-regrowth', 4],
    ['living-spirit', 3],
    ['improved-tranquility', 2],
  ],
  expected: { balance: 11, feral: 0, restoration: 40 },
  summary: 'A dungeon-first healing build that reaches Wild Growth at 40 and grows with you. Final split 11 / 0 / 40.',
  sources: ['16', '03', '12'],
};
