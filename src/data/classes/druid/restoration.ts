import type { SpecGuide } from '../../types.ts';
import { restorationBuild } from './talents.ts';

export const restoration: SpecGuide = {
  slug: 'restoration',
  name: 'Restoration and level 60',
  nav: 'Restoration',
  blurb: 'Dual spec, the build from 40, healing priorities, gear and your first week at 60.',
  lead: 'Open a Restoration second spec at 40 and heal a few dungeons. At 60, make Restoration your main group role and keep Feral for soloing, tanking and occasional Cat DPS.',
  build: restorationBuild,
  notes: ['raid-build', 'bloom-fix', 'swiftmend-tooltip'],
  sections: [
    {
      id: 'dual-spec',
      title: 'Dual spec at 40',
      bullets: [
        'Dual Specialization unlocks at 40 from a class trainer in a major city. Talent changes also happen at a major-city trainer.',
        'Keep Feral as your open-world and off-role spec. Put Restoration in the second slot.',
        'The price wasn’t published in our sources. Read the trainer’s quote before budgeting.',
        'Make a second action bar layout for healing and keep your healing gear in its own bag.',
      ],
      notes: ['training-cost'],
      sources: ['02', '03'],
    },
    {
      id: 'practice',
      title: 'Practice before 60',
      bullets: [
        '25-29: optional healing run in caster gear if you want an early feel for it.',
        '40-45: Krol’dok Stronghold is a natural first Deep Resto run.',
        '46-49: a quest-stacked Zul’Farrak run is a good longer practice session.',
        '55-60: heal Blackmaw Hold or a Classic high-level dungeon near your route.',
        'Keep useful healing pieces from your 20s onward, and build the set deliberately in your 40s.',
      ],
      sources: ['07'],
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
      title: 'Healing gear and Bear gear',
      table: {
        head: ['Set', 'Look for', 'How to use it'],
        rows: [
          ['Restoration', 'Intellect and Spirit while leveling, then +Healing as good pieces appear. At 60, +Healing first, with Intellect, Spirit and MP5 for longer fights.', 'Cloth is fine when it improves healing. Carry a healing weapon or off-hand, water and mana potions. Change sets before the first pull.'],
          ['Bear (off-role)', 'Armor, Stamina and Agility, plus weapon DPS for threat. Expertise is extra valuable.', 'Keep it separate from the Cat set. Build a proper tank set before harder runs, and use a tank guide for encounter stat trade-offs.'],
          ['Cat (off-role)', 'Weapon DPS, then Hit, Expertise, Crit, Agility and Strength.', 'Shred from behind when someone else tanks.'],
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
        'For raid healing, ask your raid leader whether you are on steady group healing or fast spike recovery before choosing a build.',
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
      { id: 'list-healer', title: 'List as a healer', body: 'Run the dungeon your group is ready for: Blackmaw Hold, Shaper’s Terrace, Blackrock Depths, Stratholme or Scholomance.' },
      { id: 'weakest-slot', title: 'Upgrade your weakest healing pieces', body: 'Check crafted Mooncloth and Mender’s Leather options against live drops.' },
      { id: 'feral-set', title: 'Keep your off-role useful', body: 'Stay Feral for solo farming and bring the Bear set to tank. For Cat DPS in a group, use your Cat gear and Shred from behind.' },
      { id: 'rolls', title: 'Agree on rolls', body: 'Tell the group which role you are joining as, and agree on off-spec rolls before the run.' },
      { id: 'binds', title: 'Tidy your healing binds', body: 'Swiftmend, Nature’s Swiftness, dispels and Innervate on easy keys, with party HoT timers visible.' },
      { id: 'onyxia', title: 'Start the Onyxia chain', body: 'Do it if you want to raid on December 9. Keep the Drakefire Amulet in your bags.' },
      { id: 'consumables', title: 'Stock up', body: 'Water, mana potions, and a healing weapon or off-hand.' },
    ],
    sources: ['07', '14', '15'],
  },
};
