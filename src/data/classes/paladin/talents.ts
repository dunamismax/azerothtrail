import type { EndgameBuild, Talent, TalentBuild, TalentTree } from '../../types.ts';

export const trees: TalentTree[] = [
  { id: 'holy', name: 'Holy' },
  { id: 'protection', name: 'Protection' },
  { id: 'retribution', name: 'Retribution' },
];

// Rows, max ranks and prerequisites come from the live Icy Veins calculator
// (Nov 4 build) [05], cross-checked against the Forever Guide calculator [14].
// Rows follow the calculator grid: 4 columns per row, row n unlocks at
// 5 × (n − 1) points. Summaries use Blizzard's numbers [02][03] where they
// state them and avoid numbers where the two calculators disagree.
export const talents: Talent[] = [
  // Protection
  { id: 'divine-intellect', name: 'Divine Intellect', tree: 'protection', row: 1, maxRank: 5, summary: 'More Intellect. Moved to Protection row 1 at launch. Taken by Holy and by Retribution’s Unsealed Wrath build at 60.' },
  { id: 'redoubt', name: 'Redoubt', tree: 'protection', row: 1, maxRank: 5, summary: 'Melee hits against you have a chance to raise your block chance for 10 sec or 5 blocks. It no longer needs a critical hit, and it feeds Shield Specialization.' },
  { id: 'precision', name: 'Precision', tree: 'protection', row: 2, maxRank: 3, summary: '+3% hit with all spells and attacks, not just melee. A miss is lost threat.' },
  { id: 'guardians-favor', name: 'Guardian’s Favor', tree: 'protection', row: 2, maxRank: 2, summary: 'Shorter Blessing of Protection cooldown and a longer Blessing of Freedom.' },
  { id: 'sacred-duty', name: 'Sacred Duty', tree: 'protection', row: 2, maxRank: 2, summary: 'Up to 1 min off Divine Shield, Divine Protection and Templar’s Bulwark, and up to 10 sec off Forbearance.' },
  { id: 'templars-bulwark', name: 'Templar’s Bulwark', tree: 'protection', row: 3, maxRank: 1, summary: 'New. An absorb shield worth 100% of your maximum health for 8 sec on a 5 min cooldown. Applies Forbearance, so it shares the lockout with Divine Shield. It is a dispellable Magic effect.' },
  { id: 'improved-hammer-of-justice', name: 'Improved Hammer of Justice', tree: 'protection', row: 3, maxRank: 3, summary: 'Shorter Hammer of Justice cooldown. Not in this guide’s builds.' },
  { id: 'shield-specialization', name: 'Shield Specialization', tree: 'protection', row: 3, maxRank: 2, requires: 'redoubt', summary: 'Your shield absorbs 30% more, and at 2/2 each block restores 4% of your maximum mana (once every 3 sec). This is what ends drinking after every pull. Requires Redoubt 5/5.' },
  { id: 'toughness', name: 'Toughness', tree: 'protection', row: 3, maxRank: 5, summary: 'More armor from items.' },
  { id: 'swift-judgement', name: 'Swift Judgement', tree: 'protection', row: 4, maxRank: 1, requires: 'templars-bulwark', summary: 'New. Judges your active Seal without consuming it, on its own cooldown separate from Judgement. With Seal of Fury it is your second taunt. Requires Templar’s Bulwark.' },
  { id: 'improved-righteous-fury', name: 'Improved Righteous Fury', tree: 'protection', row: 4, maxRank: 3, summary: 'No longer adds threat. Instead you take 3/6/9% less damage while Righteous Fury is active.' },
  { id: 'anticipation', name: 'Anticipation', tree: 'protection', row: 4, maxRank: 5, summary: '+20 Defense at 5/5 (doubled from Classic). The flexible points once you near the 440 Defense goal at 60.' },
  { id: 'stoicism', name: 'Stoicism', tree: 'protection', row: 5, maxRank: 2, summary: 'New. Shorter Stun and Charm effects on you. Not in this guide’s builds.' },
  { id: 'holy-shield', name: 'Holy Shield', tree: 'protection', row: 5, maxRank: 1, summary: '+30% block chance for 10 sec with 4 charges. Each block deals Holy damage with 20% extra threat. Trainer ranks at 40, 50 and 60.' },
  { id: 'reckoning', name: 'Reckoning', tree: 'protection', row: 5, maxRank: 5, summary: 'A 40% chance after a block (at most once every 1.5 sec) and 100% after a non-periodic critical hit taken to gain an extra attack, storing up to 4. It now uses every stored attack and no longer builds while sitting.' },
  { id: 'iron-creed', name: 'Iron Creed', tree: 'protection', row: 6, maxRank: 3, summary: 'New. +10/20/30% Holy Strike threat. While Righteous Fury is active, Holy Strike also cuts your damage taken by 2/4/6% for 6 sec.' },
  { id: 'shieldsworn', name: 'Shieldsworn', tree: 'protection', row: 7, maxRank: 1, requires: 'holy-shield', summary: 'New capstone. Holy Strike’s cooldown drops by 4 sec and it strikes with your shield, triggering Holy Shield and Shield Specialization without spending charges, and letting you block spells for 6 sec. Requires Holy Shield.' },

  // Retribution
  { id: 'deflection', name: 'Deflection', tree: 'retribution', row: 1, maxRank: 5, summary: '+5% Parry at 5/5. Moved to row 1.' },
  { id: 'benediction', name: 'Benediction', tree: 'retribution', row: 1, maxRank: 5, summary: 'Up to 10% cheaper instant spells and abilities, which includes Consecration, Holy Strike, Judgement and Seals.' },
  { id: 'improved-judgement', name: 'Improved Judgement', tree: 'retribution', row: 2, maxRank: 2, summary: 'Judgement’s cooldown is 2 sec shorter at 2/2: more damage and a taunt that is ready more often.' },
  { id: 'conviction', name: 'Conviction', tree: 'retribution', row: 2, maxRank: 3, summary: '+2/4/6% critical strike chance with all spells and attacks.' },
  { id: 'sanctified-judgement', name: 'Sanctified Judgement', tree: 'retribution', row: 2, maxRank: 3, summary: 'Judgement refunds up to 60% of the judged Seal’s mana cost.' },
  { id: 'vindication', name: 'Vindication', tree: 'retribution', row: 3, maxRank: 3, summary: 'Damaging melee attacks can lower the target’s Attack Power for 30 sec, scaled by level to roughly a Demoralizing Shout.' },
  { id: 'unyielding-faith', name: 'Unyielding Faith', tree: 'retribution', row: 3, maxRank: 2, summary: 'Shorter Fear and Disorient effects on you. One point in Icy Veins’ level-60 Retribution builds.' },
  { id: 'seal-of-command', name: 'Seal of Command', tree: 'retribution', row: 3, maxRank: 1, summary: 'A talent Seal: about 7 procs a minute of extra Holy damage worth 70% of weapon damage, so it favors slow two-handers. Its Judgement hits harder on stunned or incapacitated targets.' },
  { id: 'pursuit-of-justice', name: 'Pursuit of Justice', tree: 'retribution', row: 3, maxRank: 2, summary: '+15% run and mounted speed at 2/2 (raised from 8%). Doesn’t stack with other speed effects.' },
  { id: 'eye-for-an-eye', name: 'Eye for an Eye', tree: 'retribution', row: 4, maxRank: 2, summary: 'Critical strikes against you reflect up to 10% of the damage. Not in this guide’s builds.' },
  { id: 'sacred-arbiter', name: 'Sacred Arbiter', tree: 'retribution', row: 4, maxRank: 1, summary: 'New. +20% Holy Strike damage, and Holy Strike refreshes every Judgement on the target, including other Paladins’.' },
  { id: 'two-handed-weapon-specialization', name: 'Two-Handed Weapon Specialization', tree: 'retribution', row: 4, maxRank: 3, summary: '+2/4/6% Physical and Holy damage with a two-hander, but 7/14/20% less threat while you wield one.' },
  { id: 'turn-evil', name: 'Turn Evil', tree: 'retribution', row: 5, maxRank: 2, summary: 'New. Faster Turn Undead that also works on Demons. Not in this guide’s builds.' },
  { id: 'repentance', name: 'Repentance', tree: 'retribution', row: 5, maxRank: 1, summary: 'Incapacitates a Humanoid for up to 6 sec; damage breaks it. Now a 21-point talent.' },
  { id: 'vengeance', name: 'Vengeance', tree: 'retribution', row: 5, maxRank: 3, requires: 'seal-of-command', summary: 'A stacking Physical and Holy damage bonus for 30 sec after a non-periodic critical strike, up to 5 stacks. Requires Seal of Command.' },
  { id: 'champion-of-the-light', name: 'Champion of the Light', tree: 'retribution', row: 6, maxRank: 5, summary: 'New. Spell damage from a share of your Intellect, and a faster Hammer of Wrath.' },
  { id: 'unsealed-wrath', name: 'Unsealed Wrath', tree: 'retribution', row: 7, maxRank: 1, requires: 'repentance', summary: 'New capstone. Melee attacks store your active Seal for 15 sec (3 stacks); attacking under a different Seal fires the stored copies. Requires Repentance.' },

  // Holy
  { id: 'spiritual-focus', name: 'Spiritual Focus', tree: 'holy', row: 1, maxRank: 5, summary: 'Less pushback on Flash of Light, Holy Light and Light’s Vigil.' },
  { id: 'divine-strength', name: 'Divine Strength', tree: 'holy', row: 1, maxRank: 5, summary: '+10% Strength at 5/5.' },
  { id: 'healing-light', name: 'Healing Light', tree: 'holy', row: 2, maxRank: 3, summary: 'More healing from Holy Light, Flash of Light and Holy Shock.' },
  { id: 'reverence', name: 'Reverence', tree: 'holy', row: 2, maxRank: 2, summary: 'Lets up to 30% of your mana regeneration continue while casting.' },
  { id: 'improved-seals', name: 'Improved Seals', tree: 'holy', row: 2, maxRank: 5, summary: 'Up to 15% more damage from all Seals and Judgements.' },
  { id: 'purifying-power', name: 'Purifying Power', tree: 'holy', row: 2, maxRank: 2, summary: 'Cheaper Cleanse and Purify, and up to 33% shorter Exorcism and Holy Wrath cooldowns.' },
  { id: 'divine-favor', name: 'Divine Favor', tree: 'holy', row: 3, maxRank: 1, summary: 'Your next Flash of Light, Holy Light or Holy Shock is a guaranteed critical.' },
  { id: 'illumination', name: 'Illumination', tree: 'holy', row: 3, maxRank: 5, requires: 'reverence', summary: 'Critical heals can refund half the spell’s base mana cost. Requires Reverence.' },
  { id: 'holy-conduit', name: 'Holy Conduit', tree: 'holy', row: 3, maxRank: 2, summary: 'Up to 40% cheaper Consecration, Holy Wrath, Exorcism and Hammer of Wrath. Icy Veins’ answer to mana trouble.' },
  { id: 'divine-precision', name: 'Divine Precision', tree: 'holy', row: 4, maxRank: 2, summary: '+4/8% hit with Holy spells and shorter Silence effects on you.' },
  { id: 'infusion-of-light', name: 'Infusion of Light', tree: 'holy', row: 4, maxRank: 2, summary: 'Critical Holy Shock or Flash of Light shortens your next Holy Light.' },
  { id: 'oath-of-light', name: 'Oath of Light', tree: 'holy', row: 4, maxRank: 1, summary: 'New. Bonds one ally for 5 min, raising your Holy Light, Flash of Light and Holy Shock healing on them.' },
  { id: 'consecrated-ground', name: 'Consecrated Ground', tree: 'holy', row: 5, maxRank: 2, summary: 'Holy spells deal up to 10% more damage to the first 4 enemies standing in your Consecration.' },
  { id: 'holy-shock', name: 'Holy Shock', tree: 'holy', row: 5, maxRank: 1, summary: 'Instant Holy damage or healing, 10 sec cooldown. Expensive: Holy keeps it for emergencies and for Light’s Vigil; Shockadin and Deep Holy tanks use it for damage. Trainer ranks at 40, 48 and 56.' },
  { id: 'boundless-light', name: 'Boundless Light', tree: 'holy', row: 5, maxRank: 2, requires: 'holy-shock', summary: 'More Holy Shock crit chance on allies outside your Oath of Light.' },
  { id: 'holy-power', name: 'Holy Power', tree: 'holy', row: 6, maxRank: 5, summary: 'A larger critical healing bonus for Holy spells.' },
  { id: 'lights-vigil', name: 'Light’s Vigil', tree: 'holy', row: 7, maxRank: 1, requires: 'holy-shock', summary: 'New capstone. A 1.5 sec cast that marks a friendly target: your next Holy Shock on them has no cooldown and heals their party. Very expensive. Trainer ranks at 50 and 60.' },
];

// Protection leveling, one point per level from 10 to 60. This is the
// Mobalytics Progress "Prot Leveling 1-60" order (updated Nov 3, read Nov 8)
// [10], which also ends on its level-60 dungeon and raid build. Every step was
// checked against the row gates and prerequisites above.
export const protectionLeveling: TalentBuild = {
  id: 'protection-leveling',
  name: 'Protection leveling',
  role: 'Solo questing with pulls of four, dungeon tanking, and the level-60 tank build',
  startLevel: 10,
  steps: [
    ['redoubt', 5],
    ['precision', 3],
    ['sacred-duty', 2],
    ['shield-specialization', 2],
    ['templars-bulwark', 1],
    ['toughness', 2],
    ['swift-judgement', 1],
    ['improved-righteous-fury', 3],
    ['anticipation', 1],
    ['holy-shield', 1],
    ['reckoning', 5],
    ['iron-creed', 3],
    ['anticipation', 1],
    ['shieldsworn', 1],
    ['deflection', 5],
    ['improved-judgement', 2],
    ['conviction', 3],
    ['pursuit-of-justice', 2],
    ['anticipation', 3],
    ['toughness', 3],
    ['guardians-favor', 2],
  ],
  expected: { holy: 0, protection: 39, retribution: 12 },
  summary: 'Protection first: Shield Specialization at 20-21, Templar’s Bulwark at 22, a second taunt at 25, Holy Shield at 30 and Shieldsworn at 40. Retribution after 40 for Parry, a faster Judgement, crit and run speed. Final split 0 / 39 / 12, the same as the level-60 tank build.',
  sources: ['10', '05', '14'],
};

// Retribution leveling, one point per level from 10 to 60: the Icy Veins
// Retribution leveling slider (Nov 4, read Nov 8) [09]. Retribution to 40 for
// Pursuit of Justice, Seal of Command, Repentance and Unsealed Wrath, then Holy.
export const retributionLeveling: TalentBuild = {
  id: 'retribution-leveling',
  name: 'Retribution leveling',
  role: 'Fast solo questing with a two-hander',
  startLevel: 10,
  steps: [
    ['deflection', 5],
    ['improved-judgement', 2],
    ['conviction', 3],
    ['pursuit-of-justice', 2],
    ['seal-of-command', 1],
    ['sanctified-judgement', 2],
    ['sacred-arbiter', 1],
    ['two-handed-weapon-specialization', 3],
    ['sanctified-judgement', 1],
    ['vengeance', 3],
    ['repentance', 1],
    ['vindication', 1],
    ['champion-of-the-light', 5],
    ['unsealed-wrath', 1],
    ['divine-strength', 5],
    ['reverence', 2],
    ['improved-seals', 3],
    ['holy-conduit', 2],
    ['improved-seals', 2],
    ['purifying-power', 2],
    ['divine-precision', 2],
    ['vindication', 2],
  ],
  expected: { holy: 18, protection: 0, retribution: 33 },
  summary: 'Deflection for safety, then a faster Judgement, crit and Pursuit of Justice by 21, Seal of Command at 22, Repentance at 33 and Unsealed Wrath at 40. Holy after 40 for Strength, mana and stronger Seals. Final split 18 / 0 / 33.',
  sources: ['09', '14'],
};

// Holy leveling, one point per level from 10 to 60: the Icy Veins Holy
// leveling slider (Nov 4, read Nov 8) [25]. Retribution first for cheaper
// spells, crit and run speed, then Holy for healing; Holy Shock at 42.
export const holyLeveling: TalentBuild = {
  id: 'holy-leveling',
  name: 'Holy leveling',
  role: 'Questing in healing gear and healing every dungeon on the way',
  startLevel: 10,
  steps: [
    ['benediction', 5],
    ['conviction', 3],
    ['improved-judgement', 2],
    ['pursuit-of-justice', 2],
    ['spiritual-focus', 5],
    ['reverence', 2],
    ['healing-light', 3],
    ['illumination', 5],
    ['oath-of-light', 1],
    ['infusion-of-light', 2],
    ['holy-conduit', 2],
    ['holy-shock', 1],
    ['boundless-light', 2],
    ['divine-favor', 1],
    ['consecrated-ground', 1],
    ['holy-power', 5],
    ['lights-vigil', 1],
    ['divine-intellect', 5],
    ['consecrated-ground', 1],
    ['improved-seals', 2],
  ],
  expected: { holy: 34, protection: 5, retribution: 12 },
  summary: 'Benediction, Conviction, a faster Judgement and Pursuit of Justice first, because early on you kill more than you heal. Holy from 22: Illumination at 36, Holy Shock at 42 and Light’s Vigil at 52. Final split 34 / 5 / 12.',
  sources: ['25', '14'],
};

// Level-60 builds, all from the live Icy Veins calculators (Nov 4, read Nov 8).
export const deepProtection: EndgameBuild = {
  id: 'deep-protection',
  name: 'Deep Protection (Icy Veins)',
  use: 'The sturdiest tank build while you gear',
  ranks: {
    'redoubt': 5, 'precision': 3, 'sacred-duty': 2, 'templars-bulwark': 1, 'shield-specialization': 2, 'toughness': 3,
    'swift-judgement': 1, 'improved-righteous-fury': 3, 'anticipation': 5, 'holy-shield': 1, 'reckoning': 5, 'iron-creed': 3, 'shieldsworn': 1,
    'benediction': 5, 'improved-judgement': 2, 'conviction': 3, 'sanctified-judgement': 3, 'pursuit-of-justice': 2, 'sacred-arbiter': 1,
  },
  expected: { holy: 0, protection: 35, retribution: 16 },
  body: 'Two fewer Toughness points and no Guardian’s Favor than the leveling build, traded for Benediction, Sanctified Judgement and Sacred Arbiter in Retribution. Anticipation holds the flexible points.',
  options: [
    'Move Anticipation points into Divine Intellect or Toughness once you are near 440 Defense.',
    'If mana is the problem, keep the 5 Benediction points and put the rest in Divine Strength, Improved Seals and Holy Conduit.',
  ],
  sources: ['05'],
};

export const deepHolyTank: EndgameBuild = {
  id: 'deep-holy-tank',
  name: 'Deep Holy tank (Icy Veins)',
  use: 'Much more damage for a well-geared tank',
  ranks: {
    'divine-strength': 5, 'reverence': 2, 'improved-seals': 5, 'purifying-power': 2, 'divine-favor': 1, 'holy-conduit': 2, 'divine-precision': 2,
    'oath-of-light': 1, 'consecrated-ground': 2, 'holy-shock': 1,
    'redoubt': 5, 'precision': 3, 'sacred-duty': 2, 'templars-bulwark': 1, 'shield-specialization': 2, 'toughness': 2, 'swift-judgement': 1,
    'improved-righteous-fury': 3, 'anticipation': 5, 'holy-shield': 1, 'iron-creed': 3,
  },
  expected: { holy: 23, protection: 28, retribution: 0 },
  body: 'Holy Shock and Holy Conduit carry the damage and threat. It gives up Shieldsworn, spell blocking and Reckoning, so only consider it once you are very well geared.',
  sources: ['05'],
};

export const unsealedWrath: EndgameBuild = {
  id: 'unsealed-wrath',
  name: 'Unsealed Wrath (Icy Veins)',
  use: 'The main level-60 Retribution build, built on Seal swapping',
  ranks: {
    'divine-strength': 5, 'improved-seals': 5, 'holy-conduit': 2,
    'divine-intellect': 5, 'precision': 3,
    'benediction': 5, 'improved-judgement': 2, 'conviction': 3, 'sanctified-judgement': 3, 'unyielding-faith': 1, 'seal-of-command': 1,
    'pursuit-of-justice': 2, 'sacred-arbiter': 1, 'two-handed-weapon-specialization': 3, 'repentance': 1, 'vengeance': 3,
    'champion-of-the-light': 5, 'unsealed-wrath': 1,
  },
  expected: { holy: 12, protection: 8, retribution: 31 },
  body: 'Deep Retribution for Unsealed Wrath, Divine Intellect and Precision in Protection for Intellect and hit, and Divine Strength, Improved Seals and Holy Conduit in Holy.',
  options: [
    'Already at 8% hit from gear? Move Precision into Reverence for mana, or Purifying Power for fights against Undead and Demons.',
    'No Warrior or Feral tank to lower the boss’s Attack Power? Drop one Unyielding Faith and two Sanctified Judgement points for Vindication, and bring more mana consumables.',
  ],
  sources: ['26'],
};

export const shockadin: EndgameBuild = {
  id: 'shockadin',
  name: 'Shockadin (Icy Veins)',
  use: 'A Holy Shock Retribution build that leans on Spell Power',
  ranks: {
    'divine-strength': 5, 'reverence': 2, 'improved-seals': 5, 'purifying-power': 2, 'divine-favor': 1, 'holy-conduit': 2, 'divine-precision': 2,
    'oath-of-light': 1, 'holy-shock': 1,
    'benediction': 5, 'improved-judgement': 2, 'conviction': 3, 'sanctified-judgement': 3, 'unyielding-faith': 1, 'seal-of-command': 1,
    'pursuit-of-justice': 2, 'sacred-arbiter': 1, 'two-handed-weapon-specialization': 3, 'repentance': 1, 'vengeance': 3, 'champion-of-the-light': 5,
  },
  expected: { holy: 21, protection: 0, retribution: 30 },
  body: 'Holy Shock and Seal of Righteousness instead of Unsealed Wrath. It still keeps Champion of the Light, so Intellect turns into Spell Power.',
  options: ['Need an Attack Power reduction on the boss? Take Vindication from Unyielding Faith and Sanctified Judgement.'],
  sources: ['26'],
};

export const lightsVigil: EndgameBuild = {
  id: 'lights-vigil',
  name: 'Light’s Vigil (Icy Veins)',
  use: 'The standard level-60 healing build',
  ranks: {
    'spiritual-focus': 5, 'healing-light': 3, 'reverence': 2, 'purifying-power': 2, 'divine-favor': 1, 'illumination': 5, 'holy-conduit': 1,
    'infusion-of-light': 2, 'oath-of-light': 1, 'holy-shock': 1, 'boundless-light': 2, 'holy-power': 5, 'lights-vigil': 1,
    'divine-intellect': 5, 'guardians-favor': 1, 'sacred-duty': 2,
    'benediction': 5, 'improved-judgement': 2, 'conviction': 3, 'pursuit-of-justice': 2,
  },
  expected: { holy: 31, protection: 8, retribution: 12 },
  body: 'Thirty-one Holy points for Light’s Vigil, then Divine Intellect, Benediction and Conviction. The last three points sit in Sacred Duty and Guardian’s Favor.',
  options: ['PvP: two points in Unyielding Faith instead of Sacred Duty or Sanctified Judgement.'],
  sources: ['27'],
};
