import type { SpecGuide } from '../../types.ts';
import { holyLeveling, lightsVigil } from './talents.ts';

// Holy: Icy Veins' leveling guide [25] for the 10-60 order and leveling play,
// its talent, rotation and stat pages [27][28][29] for 60, and Blizzard's
// deep dive [02] for what Holy is meant to be.
export const holy: SpecGuide = {
  slug: 'holy',
  name: 'Holy',
  role: 'healer',
  pitch: 'Heal every dungeon on the way to 60 and still quest on your own. Healing gear adds Spell Power, and most Paladin damage scales with it.',
  lead: 'Holy is slower than Retribution on your own, but less than you would think: almost every Paladin ability scales with Spell Power, which healing gear also gives. Spend your first points in Retribution for cheaper spells and run speed, switch to Holy at 22, and heal any dungeon you like from 20, when Flash of Light arrives.',
  strengths: ['Extremely durable, with many ways out of trouble', 'Easy dungeon invites: groups always want a healer', 'Powerful Blessings and utility', 'Easy to gear: healing gear also helps your damage'],
  weaknesses: ['Slower kills than Retribution or Protection', 'Runs out of mana easily', 'Short range on most damage spells'],
  compare: { solo: 'Slowest; still sturdy', groups: 'Heals every dungeon', mana: 'The hardest; Illumination helps from 32', endgame: 'Strong single-target healer' },
  build: holyLeveling,
  endgameBuilds: [lightsVigil],
  dualSpec: [
    'Retribution is the natural second spec for questing: it kills lone mobs much faster, and you can keep Holy for groups.',
    'Protection instead if you would like to tank some of the dungeons you would otherwise heal.',
    'Keep your healing set in its own bag and make a second action bar layout.',
  ],
  notes: ['first-week-tuning', 'every-spec-levels', 'holy-shock-level', 'removed-blessings'],
  sections: [
    {
      id: 'how-holy-levels',
      title: 'How a Holy Paladin levels',
      paragraphs: [
        'Healers usually level slower because they kill slower. Holy closes most of that gap: Consecration, Judgement, Holy Strike and Exorcism all scale with Spell Power, and healing gear carries Spell Power too.',
        'Early on you need very little healing, so the first twelve points go into Retribution: Benediction makes your damage spells cheaper, Conviction adds crit, Improved Judgement brings Judgement back sooner and Pursuit of Justice adds 15% run speed. From 22, Holy talents build your healing for the dungeons you will be running.',
      ],
      sources: ['25'],
    },
    {
      id: 'setup',
      title: 'Before every pull',
      bullets: [
        'Blessing of Might until 20, then Blessing of Kings. Blessings last an hour, so buff everyone you pass.',
        'Devotion Aura while questing. Concentration Aura from 22 if you are healing through a lot of damage.',
        'Seal of Righteousness for damage. Judgement no longer consumes it, so you set it once.',
        'Righteous Fury and Seal of Fury are tank tools. Leave them off.',
      ],
      notes: ['removed-blessings'],
      sources: ['25'],
    },
    {
      id: 'questing-rotation',
      title: 'Killing things on your own',
      ordered: [
        'Get into melee range and auto-attack.',
        'Judgement on cooldown with Seal of Righteousness for a burst of damage.',
        'Holy Strike on cooldown.',
        'Consecration on packs, as long as your mana allows. It hits hard but is very expensive.',
        'Exorcism against Undead and Demons.',
      ],
      bullets: [
        'Heal yourself with Flash of Light between hits and Holy Light between pulls.',
        'Keep enough mana for one big heal at the end of every pull.',
      ],
      sources: ['25'],
    },
    {
      id: 'dungeon-healing',
      title: 'Healing a dungeon',
      lead: 'Flash of Light is your workhorse. Everything else is for heavier damage or emergencies.',
      ordered: [
        'Flash of Light (20) is your most efficient heal. Use it to keep health bars up.',
        'Holy Light when heavy damage comes in and you can afford it.',
        'Holy Shock (42): instant, but very inefficient. Keep it for a player about to die, or for healing on the move.',
        'Light’s Vigil (52): mark a player before damage goes out, then Holy Shock them to heal their whole party. It is your only group heal and very expensive.',
        'Lay on Hands when nothing else will save someone. It costs all your remaining mana.',
      ],
      bullets: [
        'From 37, keep Oath of Light on the tank for stronger heals on them.',
        'Seal of Light (30) if no other Paladin is using it, otherwise Seal of Wisdom (38).',
        'Divine Intervention goes on another healer, or a player who can resurrect, when a wipe is certain.',
      ],
      sources: ['25', '28'],
    },
    {
      id: 'mana',
      title: 'Mana is everything',
      bullets: [
        'Keep water on you and upgrade it every ten levels. Running dry slows you more than anything else.',
        'Five-second rule: Spirit regeneration stops for 5 seconds after any spell that costs mana. Reverence (27-28) lets some of it continue.',
        'Illumination (32-36) refunds mana on critical heals; Conviction and Holy Power add the crits.',
        'Intellect is your best leveling stat for mana. Blessing of Wisdom on yourself while you solo.',
        'Holy Conduit (40-41) makes Consecration and Exorcism cheaper.',
      ],
      sources: ['25', '29'],
    },
    {
      id: 'gear',
      title: 'Stats while leveling',
      table: {
        head: ['When', 'Look for', 'Why'],
        rows: [
          ['Early levels', 'Weapon damage, hit and crit', 'Auto-attacks are a big share of your damage at first.'],
          ['Questing', 'Spell Power and Intellect', 'Spell Power takes over as your spells rank up, and Intellect is mana.'],
          ['Healing groups', 'Healing Power, Intellect, MP5', 'Every Healing Power item also gives some Spell Power.'],
        ],
      },
      bullets: ['Icy Veins lists two-handers, one-handers, shields and helms worth picking up along the way. Don’t hold up leveling to chase a dungeon drop.'],
      sources: ['25'],
    },
    {
      id: 'utility',
      title: 'Utility worth binding',
      bullets: [
        'Blessing of Freedom: immunity to roots and slows, and it removes them.',
        'Blessing of Protection: physical immunity for a caster or healer with aggro, including you. They can’t attack while it lasts.',
        'Voice of Truth (20): immunity to silence and interrupts for a short time, so a heal gets through.',
        'Divine Intervention: sacrifice yourself to take another player out of combat before a wipe.',
      ],
      sources: ['25'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Always buy new ranks of Flash of Light, Holy Light, Seal of Righteousness, Holy Strike, Consecration and Exorcism, plus every defensive. From 30, Seal of Light and from 38 Seal of Wisdom matter in groups.',
        'Skip Seal of Fury and Righteous Fury unless you tank. Blessing of Might ranks can wait once you have Kings.',
      ],
      notes: ['training-cost'],
      sources: ['15', '25'],
    },
  ],
  endgame: {
    lead: 'At 60, respec into the Light’s Vigil build and heal. Blizzard pitches Holy as the strongest single-target healer, with Light’s Vigil for party healing. Getting the most from it means spending mana on Light’s Vigil without running dry.',
    sections: [
      {
        id: 'which-build',
        title: 'The level-60 build',
        paragraphs: [
          'Light’s Vigil (31 / 8 / 12) is the standard build: the Holy capstone, then Divine Intellect, Benediction for Holy Shock and Conviction for crit. The last three points in Sacred Duty and Guardian’s Favor are the flexible ones.',
        ],
        sources: ['27', '02'],
      },
      {
        id: 'priorities',
        title: 'Healing priorities',
        ordered: [
          'Keep Oath of Light on your tank at all times.',
          'Seal of Light if no other Paladin uses it, otherwise Seal of Wisdom.',
          'Light’s Vigil before AoE damage, then Holy Shock the same target for a burst of party healing.',
          'Flash of Light as your main heal.',
          'Spend Infusion of Light procs on Holy Light.',
          'Holy Shock when a player is in danger and there is no time to cast.',
          'Lay on Hands when there is no other choice.',
        ],
        bullets: [
          'Watch the enemy’s health. The closer it is to dying, the more mana you can spend on Light’s Vigil.',
          'Nothing to heal? Seal of Righteousness, melee, Judgement and Holy Strike on cooldown, Consecration and Exorcism. Keep enough mana to heal.',
        ],
        sources: ['28'],
      },
      {
        id: 'efficiency',
        title: 'How efficient is each heal?',
        lead: 'Icy Veins’ figures with +715 healing, 315 Intellect and 4% spell crit. Higher healing per mana is cheaper healing.',
        table: {
          head: ['Spell', 'Healing per mana', 'Healing per second of cast'],
          rows: [
            ['Flash of Light', '5.75', '498'],
            ['Light’s Vigil', '4.44', '2898'],
            ['Holy Light', '4.15', '1018'],
            ['Holy Shock', '2.79', '501'],
          ],
        },
        sources: ['28'],
      },
      {
        id: 'stats-60',
        title: 'Stats at 60',
        table: {
          head: ['Stat', 'Why'],
          rows: [
            ['Healing Power', 'More healing from every spell, though not equally for each.'],
            ['Intellect', 'A bigger mana pool, and spell crit.'],
            ['Spirit', 'Regeneration while you are not casting; Reverence keeps some of it going.'],
            ['MP5', 'Mana every 5 seconds whether you cast or not.'],
            ['Critical Strike', 'Feeds Illumination and Infusion of Light. Heals crit for 50% more.'],
            ['Haste', 'Faster casts. Rare.'],
          ],
        },
        sources: ['29'],
      },
      {
        id: 'raid-prep',
        title: 'Raid preparation',
        bullets: [
          'Raids open December 9: Barrow Deeps (10 players), Hyjal Summit (20) and Onyxia’s Lair (40).',
          'Onyxia needs the Drakefire Amulet in your bags. Alliance: “Dragonkin Menace” from Helendis Riverhorn in the Burning Steppes. Horde: “Blood and Thunder” from Warlord Goretooth in Kargath.',
          'Agree Blessings and Auras with the other Paladins before the pull: one of each per Paladin on a target, and Auras don’t stack.',
        ],
        sources: ['17', '28', '04'],
      },
    ],
    checklist: {
      id: 'first-week',
      title: 'Your first week at 60',
      lead: 'Respec, build a healing set and heal everything you can.',
      items: [
        { id: 'respec', title: 'Respec into Light’s Vigil', body: 'At a capital trainer. Keep Retribution on the second slot for farming.' },
        { id: 'list-healer', title: 'List as a healer', body: 'Blackmaw Hold, Shaper’s Terrace, Blackrock Depths, Stratholme or Scholomance.' },
        { id: 'healing-set', title: 'Build the healing set', body: 'Healing Power first, then Intellect, Spirit and MP5.' },
        { id: 'binds', title: 'Tidy your binds', body: 'Holy Shock, Light’s Vigil, Cleanse, Blessing of Protection and Lay on Hands on easy keys.' },
        { id: 'greater-blessings', title: 'Train Greater Blessings', body: 'Kings at 60, Wisdom from 54.' },
        { id: 'consumables', title: 'Stock up', body: 'Water and Major Mana Potions.' },
        { id: 'onyxia', title: 'Start the Onyxia chain', body: 'If you want to raid on December 9.' },
      ],
      sources: ['27', '28', '29', '17'],
    },
  },
};
