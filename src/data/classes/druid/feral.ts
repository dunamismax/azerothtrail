import type { SpecGuide } from '../../types.ts';
import { feralBear, feralCat, feralHybrid, feralLeveling } from './talents.ts';

// Feral: Icy Veins' leveling guide [05] for the 10-60 order and leveling play,
// its talent, rotation and stat pages [29][31][32] for 60.
export const feral: SpecGuide = {
  slug: 'feral',
  name: 'Feral',
  role: 'melee',
  alsoRoles: ['tank'],
  pitch: 'The most versatile Druid leveler: Cat for single mobs, Bear for packs and dungeon tanking, and Travel Form between them.',
  lead: 'Level as Feral all the way to 60. Start in caster form, use Bear from 10, and do most solo quests in Cat from 20. Tank in Bear whenever a convenient group comes together.',
  strengths: ['Good single-target damage and decent area damage in Bear', 'Prowl in Cat Form', 'Excellent mobility', 'Switches between damage and tanking with ease'],
  weaknesses: ['Slow before Bear at 10 and Cat at 20', 'No area damage in Cat Form', 'Forms and heals compete for one mana bar'],
  compare: { solo: 'Fast; Cat for one mob, Bear for packs', groups: 'Tank or melee damage', mana: 'Light; Energy and Rage do most of the work', endgame: 'Tank, melee, or both' },
  build: feralLeveling,
  endgameBuilds: [feralHybrid, feralBear, feralCat],
  dualSpec: [
    'Restoration is the usual second spec: groups always want a healer, and Druids heal well.',
    'Balance instead if you want ranged damage for groups that already have a tank.',
    'Make a second action bar layout and keep your healing or caster gear in its own bag.',
  ],
  notes: ['every-spec-levels', 'feral-order', 'lacerate-talent'],
  sections: [
    {
      id: 'cat-or-bear',
      title: 'Cat or Bear?',
      table: {
        head: ['Situation', 'Form', 'Why'],
        rows: [
          ['One ordinary quest mob', 'Cat', 'Fastest kill. Prowl past everything else.'],
          ['Two or more mobs, or a pull goes wrong', 'Bear', 'Swipe hits several targets. Cat has no area damage.'],
          ['Elite or hard-hitting mob', 'Bear', 'Armor and health. Build Lacerate stacks.'],
          ['Crowded area, need a tag', 'Caster or Bear', 'Moonfire or Faerie Fire tags at range.'],
          ['Five-player dungeon', 'Bear (tank) or Cat (damage)', 'Shred from behind when someone else tanks.'],
        ],
      },
      sources: ['05'],
    },
    {
      id: 'cat-rotation',
      title: 'Cat for regular quest mobs',
      ordered: [
        'Keep Mark of the Wild and Thorns up.',
        'Open from Prowl: Ravage from 32, Shred before that.',
        'From 41, use Shifting Power below 50 Energy when your mana is comfortable.',
        'Spend 4-5 combo points on Rip when the target will live long enough.',
        'Use Rake when it isn’t ticking and the mob will live another 9 seconds.',
        'Shred from behind, Claw face to face.',
        'Use Ferocious Bite as a finishing hit or on bleed-immune targets. Skip the finisher if an auto-attack will do it.',
      ],
      notes: ['ravage-poised', 'predatory-discipline'],
      sources: ['05'],
    },
    {
      id: 'bear-rotation',
      title: 'Bear for packs, elites and dungeon tanking',
      ordered: [
        'Keep Mark of the Wild and Thorns up. Enrage out of combat if you need starting Rage.',
        'Pull with Faerie Fire (free in forms, 6 s cooldown), or use line of sight to bring casters to you.',
        'Primal Bite on cooldown once learned at 40.',
        'Lacerate as your filler on single targets; Swipe instead on packs, and before Lacerate.',
        'Maul when you have Rage to spare. It replaces an auto-attack, so it costs more than it shows.',
        'Save Growl for a mob that leaves you, then follow with threat.',
        'Use Feral Charge or Bash to stop a cast.',
      ],
      bullets: ['Thorns damages everything that hits you, so it is strong on Bear pulls of several mobs. It lasts 10 minutes.'],
      sources: ['05', '02'],
    },
    {
      id: 'solo-pull',
      title: 'A solo pull',
      bullets: [
        'Heal between pulls, or root a mob to make room for a heal mid-fight.',
        'Pre-cast Regrowth before a tougher pull. Its heal over time lasts 21 seconds and carries into combat.',
        'Keep enough mana to heal yourself and shift back.',
        'In Cat, run or Prowl while Energy refills. Drink when low.',
        'Potions and most consumables work without leaving form.',
        'Buff players questing near you with Mark of the Wild and Thorns: they finish faster and compete less for your mobs.',
      ],
      sources: ['05', '02'],
    },
    {
      id: 'dungeon-pack',
      title: 'A dungeon pack as Bear',
      bullets: [
        'Start with small pulls, mark a kill target and check your healer’s mana before every pull.',
        'Demoralizing Roar on harder melee packs.',
        'For dangerous pulls, plan Frenzied Regeneration (36) and use Barkskin (44) before the damage, not after.',
        'Challenging Roar (28) is your emergency answer when several mobs peel off at once.',
        'Bear threat was raised to 115% to make up for the removal of Blessing of Salvation.',
      ],
      sources: ['05', '03'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Early: Wrath while you still cast to kill, then Maul, Swipe, Faerie Fire and your main self-heals. Keep current ranks of Claw, Rip and Rake once you use Cat. Pick up Prowl and key control or recovery spells as they appear. Revive at 12 and Rebirth at 20 cover different jobs.',
        'Later: buy the important new ranks for your form and the heals you actually cast. Prioritize Travel Form, Dire Bear, Innervate and Barkskin. Pick up Lacerate ranks after taking the talent, and Primal Bite’s trainer ranks at 50 and 60. Delay offensive caster ranks (Wrath, Moonfire, Starfire, Hurricane).',
      ],
      callout: 'Gold at 40: pay for your key skills and dual spec if you want a healing or caster slot straight away. Travel Form is a practical fallback if riding has to wait.',
      notes: ['training-cost'],
      sources: ['17', '03'],
    },
    {
      id: 'cat-gear',
      title: 'Cat and Bear gear',
      table: {
        head: ['Role', 'Look for', 'How to use it'],
        rows: [
          ['Cat questing', 'A strong weapon DPS upgrade first, then Agility and Strength. Stamina helps when mobs hit hard. Hit and Expertise once they appear near 60.', 'Form attacks use your equipped weapon’s DPS, and weapon speed doesn’t matter. Use a staff or mace you can equip; Classic stat sticks don’t apply.'],
          ['Bear tanking', 'Armor, Stamina and Agility for survival. Weapon DPS still matters for damage and threat. Expertise is extra valuable.', 'Keep a few sturdier pieces for your Bear swap. Build a proper tank set at 60 before harder runs.'],
        ],
      },
      sources: ['02', '05', '11'],
    },
  ],
  endgame: {
    lead: 'At 60, pick a build for the job: Hybrid if you both tank and deal damage, Bear if you only tank, Cat if you never do. Hybrid leaves your second spec free for Restoration or Balance.',
    sections: [
      {
        id: 'which-build',
        title: 'Which level-60 build',
        table: {
          head: ['Build', 'Split', 'Pick it when'],
          rows: [
            ['Hybrid Bear and Cat', '8 / 33 / 10', 'You switch roles from night to night. A little weaker in each form than a one-role build.'],
            ['Bear tank only', '9 / 32 / 10', 'You only tank. No Predatory Discipline or Shifting Power, so Cat damage drops a lot.'],
            ['Cat DPS', '8 / 33 / 10', 'You never tank. No Primal Bite or Thick Hide.'],
          ],
        },
        sources: ['29'],
      },
      {
        id: 'bear-60',
        title: 'Bear tanking at 60',
        ordered: [
          'Keep Mark of the Wild and Thorns on yourself.',
          'Keep Faerie Fire and Demoralizing Roar on your target.',
          'Lacerate if 5 stacks are about to run out.',
          'Primal Bite on cooldown.',
          'Lacerate.',
          'Maul at 35 Rage or more.',
        ],
        bullets: [
          'Packs: Swipe replaces Lacerate, Faerie Fire on as many targets as you can, and Thorns does real damage.',
          'Raid bosses can land crushing blows on a Bear, so stack enough Armor to survive several in a row.',
        ],
        sources: ['31', '32'],
      },
      {
        id: 'stats-60',
        title: 'Stats at 60',
        table: {
          head: ['For', 'Priority'],
          rows: [
            ['Damage and threat (Cat and Bear)', 'Weapon DPS > Expertise (6.5% or 14%) > hit to 8% > Agility > Strength. Crit and Attack Power about as much as Agility and Strength.'],
            ['Bear mitigation', 'Armor > Defense to 440 > Stamina > Agility > Dodge.'],
          ],
        },
        bullets: ['In Cat and Bear you are the weapon: swing speed is fixed, so only weapon DPS matters.'],
        sources: ['32'],
      },
      {
        id: 'mana-60',
        title: 'Mana as a Cat',
        bullets: [
          'Shifting Power costs as much mana as shifting into Cat, so long fights drain you.',
          'Dark Runes and Major Mana Potions are the easy refills. A Paladin’s Seal of Wisdom Judgement on the target helps every time you hit it.',
          'Still running dry? Move Naturalist points into Natural Shapeshifter or Reflection.',
          'Innervate on yourself only when no healer needs it, which is almost never.',
        ],
        sources: ['31'],
      },
      {
        id: 'utility-60',
        title: 'Utility',
        bullets: [
          'Innervate: a healer’s mana bar refilled. It takes you out of form.',
          'Nature’s Grasp roots the next enemy that hits you, and you can cast it in form.',
          'Remove Curse and Abolish Poison take you out of form. Use them when the debuff would kill someone.',
          'Rebirth is the only combat resurrection in Forever. It also takes you out of form.',
          'Raids open December 9: Barrow Deeps (10), Hyjal Summit (20) and Onyxia’s Lair (40). Onyxia needs the Drakefire Amulet from your faction’s Blackrock Spire chain.',
        ],
        sources: ['31', '14'],
      },
    ],
    checklist: {
      id: 'first-week',
      title: 'Your first week at 60',
      lead: 'Pick your build, then gear for the role you will play most.',
      items: [
        { id: 'respec', title: 'Respec', body: 'Hybrid, Bear or Cat at a capital trainer. Put Restoration or Balance in the second slot.' },
        { id: 'weapon', title: 'Upgrade your weapon', body: 'Weapon DPS is your first stat in both forms.' },
        { id: 'bear-set', title: 'Build a Bear set', body: 'Armor, Defense toward 440 and Stamina, separate from your Cat gear.' },
        { id: 'hit-expertise', title: 'Hit and Expertise', body: '8% hit, then Expertise to 6.5%, or 14% if you fight from the front as a tank does.' },
        { id: 'list', title: 'List for a dungeon', body: 'Blackmaw Hold, Shaper’s Terrace, Blackrock Depths, Stratholme or Scholomance.' },
        { id: 'consumables', title: 'Stock up', body: 'Dark Runes, Major Mana Potions and health potions.' },
        { id: 'onyxia', title: 'Start the Onyxia chain', body: 'If you want to raid on December 9. Keep the Drakefire Amulet in your bags.' },
      ],
      sources: ['29', '32', '14'],
    },
  },
};
