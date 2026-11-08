import type { Talent, TalentBuild, TalentTree } from '../../types.ts';

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
  { id: 'divine-intellect', name: 'Divine Intellect', tree: 'protection', row: 1, maxRank: 5, summary: 'More Intellect. Moved to Protection row 1 at launch. Icy Veins’ overflow pick at 60.' },
  { id: 'redoubt', name: 'Redoubt', tree: 'protection', row: 1, maxRank: 5, summary: 'Melee hits against you have a chance to raise your block chance for 10 sec or 5 blocks. It no longer needs a critical hit, and it feeds Shield Specialization.' },
  { id: 'precision', name: 'Precision', tree: 'protection', row: 2, maxRank: 3, summary: '+3% hit with all spells and attacks, not just melee. A miss is lost threat.' },
  { id: 'guardians-favor', name: 'Guardian’s Favor', tree: 'protection', row: 2, maxRank: 2, summary: 'Shorter Blessing of Protection cooldown and a longer Blessing of Freedom.' },
  { id: 'sacred-duty', name: 'Sacred Duty', tree: 'protection', row: 2, maxRank: 2, summary: 'Up to 1 min off Divine Shield, Divine Protection and Templar’s Bulwark, and up to 10 sec off Forbearance.' },
  { id: 'templars-bulwark', name: 'Templar’s Bulwark', tree: 'protection', row: 3, maxRank: 1, summary: 'New. An absorb shield worth 100% of your maximum health for 8 sec on a 5 min cooldown. Applies Forbearance, so it shares the lockout with Divine Shield. It is a dispellable Magic effect.' },
  { id: 'improved-hammer-of-justice', name: 'Improved Hammer of Justice', tree: 'protection', row: 3, maxRank: 3, summary: 'Shorter Hammer of Justice cooldown. Not in these builds.' },
  { id: 'shield-specialization', name: 'Shield Specialization', tree: 'protection', row: 3, maxRank: 2, requires: 'redoubt', summary: 'Your shield absorbs 30% more, and at 2/2 each block restores 4% of your maximum mana (once every 3 sec). This is what ends drinking after every pull. Requires Redoubt 5/5.' },
  { id: 'toughness', name: 'Toughness', tree: 'protection', row: 3, maxRank: 5, summary: 'More armor from items.' },
  { id: 'swift-judgement', name: 'Swift Judgement', tree: 'protection', row: 4, maxRank: 1, requires: 'templars-bulwark', summary: 'New. Judges your active Seal without consuming it, on its own cooldown separate from Judgement. With Seal of Fury it is your second taunt. Requires Templar’s Bulwark.' },
  { id: 'improved-righteous-fury', name: 'Improved Righteous Fury', tree: 'protection', row: 4, maxRank: 3, summary: 'No longer adds threat. Instead you take 3/6/9% less damage while Righteous Fury is active.' },
  { id: 'anticipation', name: 'Anticipation', tree: 'protection', row: 4, maxRank: 5, summary: '+20 Defense at 5/5 (doubled from Classic). The flexible points once you near the 440 Defense goal at 60.' },
  { id: 'stoicism', name: 'Stoicism', tree: 'protection', row: 5, maxRank: 2, summary: 'New. Shorter Stun and Charm effects on you. Not in these builds.' },
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
  { id: 'unyielding-faith', name: 'Unyielding Faith', tree: 'retribution', row: 3, maxRank: 2, summary: 'Shorter Fear and Disorient effects on you. Not in these builds.' },
  { id: 'seal-of-command', name: 'Seal of Command', tree: 'retribution', row: 3, maxRank: 1, summary: 'A talent Seal: about 7 procs a minute of extra Holy damage worth 70% of weapon damage, so it favors slow two-handers. Its Judgement hits harder on stunned or incapacitated targets.' },
  { id: 'pursuit-of-justice', name: 'Pursuit of Justice', tree: 'retribution', row: 3, maxRank: 2, summary: '+15% run and mounted speed at 2/2 (raised from 8%). Doesn’t stack with other speed effects.' },
  { id: 'eye-for-an-eye', name: 'Eye for an Eye', tree: 'retribution', row: 4, maxRank: 2, summary: 'Critical strikes against you reflect up to 10% of the damage. Not in these builds.' },
  { id: 'sacred-arbiter', name: 'Sacred Arbiter', tree: 'retribution', row: 4, maxRank: 1, summary: 'New. +20% Holy Strike damage, and Holy Strike refreshes every Judgement on the target, including other Paladins’.' },
  { id: 'two-handed-weapon-specialization', name: 'Two-Handed Weapon Specialization', tree: 'retribution', row: 4, maxRank: 3, summary: '+2/4/6% Physical and Holy damage with a two-hander, but 7/14/20% less threat while you wield one.' },
  { id: 'turn-evil', name: 'Turn Evil', tree: 'retribution', row: 5, maxRank: 2, summary: 'New. Faster Turn Undead that also works on Demons. Not in these builds.' },
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
  { id: 'holy-shock', name: 'Holy Shock', tree: 'holy', row: 5, maxRank: 1, summary: 'Instant Holy damage or healing, 10 sec cooldown. The core of the Holy Shock tank build.' },
  { id: 'boundless-light', name: 'Boundless Light', tree: 'holy', row: 5, maxRank: 2, requires: 'holy-shock', summary: 'More Holy Shock crit chance on allies outside your Oath of Light.' },
  { id: 'holy-power', name: 'Holy Power', tree: 'holy', row: 6, maxRank: 5, summary: 'A larger critical healing bonus for Holy spells.' },
  { id: 'lights-vigil', name: 'Light’s Vigil', tree: 'holy', row: 7, maxRank: 1, requires: 'holy-shock', summary: 'New capstone. Marks a friendly target so your next Holy Shock on them has no cooldown and heals their party.' },
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
  summary: 'Protection first: Shield Specialization at 21, Templar’s Bulwark at 22, a second taunt at 25, Holy Shield at 30 and Shieldsworn at 40. Retribution after 40 for Parry, a faster Judgement, crit and run speed. Final split 0 / 39 / 12, the same as the level-60 tank build.',
  sources: ['10', '05', '14'],
};

// Retribution on the second spec: 31 points at 40, then one per level. This is
// Icy Veins' Retribution leveling order (Nov 4) [09], replayed from 40.
export const retributionSecond: TalentBuild = {
  id: 'retribution-questing',
  name: 'Retribution questing spec',
  role: 'Faster solo questing from 40 on the second spec slot',
  startLevel: 40,
  steps: [
    // 31 points at 40
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
    // 41-60: Holy
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
  summary: 'A two-hander questing spec for when you want lone mobs to die faster than Protection allows. 31 Retribution points at 40, Holy after. Final split 18 / 0 / 33.',
  sources: ['09', '14'],
};
