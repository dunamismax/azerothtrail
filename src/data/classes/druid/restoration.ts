import type { SpecGuide } from '../../types.ts';
import { restorationDefault, restorationLeveling } from './talents.ts';

// Restoration: Icy Veins' leveling guide [28] for the 10-60 order and leveling
// play, its talent page [30] and Wowhead's builds and gear [12][15] for 60.
export const restoration: SpecGuide = {
  slug: 'restoration',
  name: 'Restoration',
  role: 'healer',
  pitch: 'Quest with Wrath and damage over time, then heal every dungeon on the way. Very hard to kill, and Travel Form gets you everywhere.',
  lead: 'Restoration levels as a caster: Moonfire, Insect Swarm from 33 and Wrath, with heals over time keeping you topped up. Its talents only turn to healing from the mid-30s, and from then on you are the healer every dungeon group wants. Swiftmend at 41 is the big jump.',
  strengths: ['Easy to play and very difficult to kill', 'Heals dungeons extremely well', 'Travel Form from 30 for fast movement'],
  weaknesses: ['Lower damage than Balance or Feral', 'Mana-hungry: you will drink often'],
  compare: { solo: 'Slow but safe', groups: 'Heals every dungeon', mana: 'Drink often; Reflection from 20', endgame: 'Flexible party and raid healer' },
  build: restorationLeveling,
  endgameBuilds: [restorationDefault],
  dualSpec: [
    'Feral is the natural second spec for questing: Cat kills lone mobs much faster than Wrath, and Bear can tank.',
    'Balance instead if you prefer to stay at range.',
    'Make a second action bar layout for healing and keep your healing gear in its own bag.',
  ],
  notes: ['every-spec-levels', 'wild-growth-prereq', 'bloom-fix', 'swiftmend-tooltip'],
  sections: [
    {
      id: 'forms',
      title: 'Forms you will use',
      bullets: [
        'You heal in caster form. Every other form has a niche job.',
        'Bear Form (10): early on, auto-attacking in Bear can match Wrath. Later, shift to survive a hit.',
        'Cat Form (20): Prowl to sneak past packs you don’t need.',
        'Aquatic Form (16) underwater, Travel Form (30) outdoors.',
      ],
      sources: ['28'],
    },
    {
      id: 'questing',
      title: 'Killing things on your own',
      ordered: [
        'Keep Mark of the Wild and Thorns on yourself.',
        'Open with Moonfire in a crowded area, Wrath otherwise.',
        'Insect Swarm once you have it (33).',
        'Wrath as your filler.',
        'Packs: Moonfire and Insect Swarm on everything, then Wrath. From 40, Hurricane on 3 or more, ideally with Barkskin so pushback doesn’t stop it.',
      ],
      bullets: [
        'Rejuvenation on yourself before a pull, Regrowth if you need more mid-fight. Its heal over time lasts a long time.',
        'Nature’s Grasp roots a second mob that you pull by accident.',
        'Around 10, Moonfire then Bear Form auto-attacks is often faster than Wrath.',
      ],
      sources: ['28'],
    },
    {
      id: 'dungeon-healing',
      title: 'Healing a dungeon',
      ordered: [
        'Mark of the Wild on the group, Thorns on the tank.',
        'Rejuvenation on the tank, and on others as needed. It is mana-efficient.',
        'Regrowth for stronger targeted healing. Healing Touch only if the tank takes sustained damage with both already ticking.',
        'Swiftmend (41) on a target with your Rejuvenation or Regrowth. It is too efficient to save for emergencies.',
        'Tranquility (30) through hard area damage. It has a long cooldown.',
        'Innervate (40) on cooldown, and drink between packs, even for a few sips.',
      ],
      bullets: ['Few people level as healers, so you will find groups fast. A good healer makes friends for the rest of the trip.'],
      notes: ['swiftmend-tooltip'],
      sources: ['28'],
    },
    {
      id: 'mana',
      title: 'Mana',
      bullets: [
        'Carry several stacks of water and upgrade it about every five levels.',
        'Reflection (20-22) lets some mana regeneration continue while casting: a big cut in downtime.',
        'Spirit regenerates mana only when you haven’t cast for 5 seconds.',
        'Moonglow (27-30) makes your damage spells cheaper.',
      ],
      sources: ['28', '24'],
    },
    {
      id: 'gear',
      title: 'Stats while leveling',
      table: {
        head: ['Stat', 'Why'],
        rows: [
          ['Spell Power', 'Your top stat while leveling: it speeds up every kill, Thorns included.'],
          ['Healing Power', 'Your top stat when healing. Collect it for 60.'],
          ['Intellect', 'A bigger mana pool and a little crit.'],
          ['Spirit and MP5', 'Regeneration. Reflection lets some Spirit regeneration continue while casting.'],
          ['Haste', 'Rare on gear. Skyborne Druids get 3% on their own.'],
        ],
      },
      sources: ['28'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Always buy new ranks of Rejuvenation, Regrowth, Healing Touch, Wrath and Moonfire, plus Mark of the Wild and Thorns. Tranquility from 30, Innervate at 40.',
        'Skip the Cat and Bear attack ranks after the early levels: Claw, Rip, Rake, Shred, Ferocious Bite, Maul and Swipe. Starfire can wait.',
      ],
      notes: ['training-cost'],
      sources: ['17', '28'],
    },
  ],
  endgame: {
    lead: 'At 60, respec into the default Restoration build and heal. About 85% of a Restoration build is fixed; the choices are in the last ten points outside the tree.',
    sections: [
      {
        id: 'which-build',
        title: 'The level-60 build',
        paragraphs: [
          'Icy Veins’ default (18 / 0 / 33) leans on Regrowth, takes Nature’s Swiftness and every general healing talent, and puts the flexible points in Improved Wrath, Genesis and Nature’s Splendor. Wowhead’s Deep Resto for dungeons is the same split.',
          'For raids, Wowhead now leads with a Nature’s Grace and Improved Regrowth build (21 / 0 / 30). Icy Veins skips Nature’s Grace for now because of bugs.',
        ],
        notes: ['raid-build'],
        sources: ['30', '12'],
      },
      {
        id: 'priorities',
        title: 'Five-player healing priorities',
        table: {
          head: ['Situation', 'Action'],
          rows: [
            ['Predictable damage', 'Rejuvenation on the tank when sustained damage is coming. Regrowth for meaningful damage that also benefits from its HoT. Start a heal early if the next hit will be big.'],
            ['Urgent single target', 'Swiftmend a target with your own Rejuvenation or Regrowth; it leaves the effect in place. For a large instant save, Nature’s Swiftness into Healing Touch.'],
            ['Several players hurt', 'Wild Growth when several members of the same party will benefit. Its base cast is 3 seconds (2.5 with Naturalist 5), so plan ahead. Save Tranquility for a safe window of sustained party damage.'],
            ['Mana and utility', 'Spend Omen of Clarity procs on an expensive heal. Drink between pulls and use Innervate early enough to get the full benefit. Remove Curse or cure poisons that are dangerous. Revive out of combat, Rebirth for a valuable combat resurrection.'],
          ],
        },
        bullets: [
          'Show party health, debuffs and your own HoT timers.',
          'Put Swiftmend, Nature’s Swiftness, dispels and Innervate on easy binds.',
          'Once your gear improves, add a lower rank of Regrowth as a cheaper heal for lighter damage.',
        ],
        sources: ['02', '03', '13'],
      },
      {
        id: 'gear',
        title: 'Healing gear',
        table: {
          head: ['Set', 'Look for', 'How to use it'],
          rows: [
            ['Restoration', '+Healing first, with Intellect, Spirit and MP5 for longer fights.', 'Cloth is fine when it improves healing. Carry a healing weapon or off-hand, water and mana potions. Change sets before the first pull.'],
            ['Feral (off-role)', 'Armor, Stamina and Agility for Bear; weapon DPS, hit, Expertise and Agility for Cat.', 'Keep it in its own bag for solo farming or the odd tanking night.'],
          ],
        },
        bullets: [
          'At 60, swap a piece for a big jump in mana stats even if it costs a little +Healing.',
          'Crafted pieces worth checking: Mooncloth (Gloves, Shoulders, Boots, Vest, Circlet) and Mender’s Leather (Bracers, Gauntlets, Waistguard, Boots).',
        ],
        callout: 'The phase-one loot list is still being filled in. Use it alongside live drops and crafted options.',
        sources: ['15', '05'],
      },
      {
        id: 'raids',
        title: 'Raid preparation',
        bullets: [
          'Raids open December 9: Barrow Deeps (10 players), Hyjal Summit (20) and Onyxia’s Lair (40).',
          'Onyxia needs the Drakefire Amulet in your bags. It doesn’t need to be equipped.',
          'Alliance: start “Dragonkin Menace” from Helendis Riverhorn in the Burning Steppes.',
          'Horde: start “Blood and Thunder” from Warlord Goretooth in Kargath, Badlands.',
          'Both chains run through Blackrock Spire and end with the Blood of the Black Dragon Champion from General Drakkisath.',
          'Ask your raid leader whether you are on steady group healing or fast spike recovery before choosing a build.',
        ],
        notes: ['raid-build'],
        sources: ['14', '12'],
      },
    ],
    checklist: {
      id: 'first-week',
      title: 'Your first week at 60',
      lead: 'Heal most groups. Keep a separate Feral set so you can switch roles when a group needs you.',
      items: [
        { id: 'respec', title: 'Respec', body: 'Into the 18 / 0 / 33 default build: Heart of the Wild instead of Nature’s Focus, and one Moonglow point moved to Genesis.' },
        { id: 'list-healer', title: 'List as a healer', body: 'Run the dungeon your group is ready for: Blackmaw Hold, Shaper’s Terrace, Blackrock Depths, Stratholme or Scholomance.' },
        { id: 'weakest-slot', title: 'Upgrade your weakest healing pieces', body: 'Check crafted Mooncloth and Mender’s Leather options against live drops.' },
        { id: 'rolls', title: 'Agree on rolls', body: 'Tell the group which role you are joining as, and agree on off-spec rolls before the run.' },
        { id: 'binds', title: 'Tidy your healing binds', body: 'Swiftmend, Nature’s Swiftness, dispels and Innervate on easy keys, with party HoT timers visible.' },
        { id: 'onyxia', title: 'Start the Onyxia chain', body: 'Do it if you want to raid on December 9. Keep the Drakefire Amulet in your bags.' },
        { id: 'consumables', title: 'Stock up', body: 'Water, mana potions, and a healing weapon or off-hand.' },
      ],
      sources: ['30', '14', '15'],
    },
  },
};
