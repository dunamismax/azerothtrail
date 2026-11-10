import type { GuideSection } from '../../types.ts';

// Advice for every Paladin spec, shown on /paladin/specs/.
export const overview: GuideSection[] = [
  {
    id: 'races',
    title: 'Human, Dwarf or Undead',
    table: {
      head: ['Race', 'Racials that matter', 'Best for'],
      rows: [
        ['Human', 'Ruthless: +1% melee and spell crit with a sword. Will to Survive breaks a stun. The Human Spirit: +10% Spirit.', 'Any spec. Retribution and Holy like the crit and Spirit; use swords to keep Ruthless active.'],
        ['Dwarf', 'Stoneform removes bleeds, poisons and diseases and now cuts physical damage taken by 10%. Big Game Hunter: +5% damage to Beasts. Artisan’s Precision: +1% hit.', 'Mobalytics’ pick for Protection: a free defensive cooldown. The hit helps Retribution too.'],
        ['Undead (Horde)', 'Cannibalize now restores mana as well as health. Touch of the Grave drains health on attacks. Will of the Forsaken.', 'The only Horde Paladin, and a good one for every spec. Cannibalize’s mana helps Holy most.'],
      ],
    },
    sources: ['10', '11'],
  },
  {
    id: 'professions',
    title: 'Professions',
    bullets: [
      'Mining and Blacksmithing is the classic Paladin pair: Blacksmithing makes much of the best mail and plate, and weapons, for your level.',
      'Herbalism and Alchemy instead if you would rather brew your own mana potions and elixirs. Alchemy also makes gold.',
      'Engineering at 60: bombs for a tank, grenades for a Retribution Paladin in PvP. Save Mining materials for it if you plan to switch.',
      'Always take Cooking and First Aid. Cooked food gives bonus experience, and First Aid now makes health potions too.',
    ],
    sources: ['09', '10', '25'],
  },
  {
    id: 'save-time',
    title: 'Save time between pulls',
    bullets: [
      'Always eat: cooked food gives bonus experience in Forever. Grab campfire buffs in towns, and a Leatherworker’s Camp Tent gives rested experience once an hour.',
      'Start the Cozy Sleeping Bag chain at 14. Three minutes of sleep gives +3% XP, and it stacks with food and campfires.',
      'Keep every Waylaid Supplies crate you find. The first turn-in gives 50 Merchant Favor coins.',
      'Rotate weapon types on easy mobs to keep every weapon skill at your level. Low skill means misses.',
      'Ask any Druid you meet for Thorns: it stacks with Retribution Aura.',
      'Do every Paladin class quest, and finish a zone’s dungeon quests before you go in. Dungeon kills give 50% more experience since November 9, and dungeon quests still give the most.',
      'Log out at an inn.',
    ],
    notes: ['dungeon-xp'],
    sources: ['10', '04', '09'],
  },
  {
    id: 'utility',
    title: 'Every Paladin’s emergency buttons',
    table: {
      head: ['Spell', 'Use it for'],
      rows: [
        ['Divine Protection (6)', 'Brief immunity to all damage: cast it, then heal.'],
        ['Hammer of Justice (8)', 'Stun the hardest hitter, or stop a cast, to buy a heal.'],
        ['Lay on Hands (10)', 'A full heal every 20 minutes. It costs all your remaining mana.'],
        ['Blessing of Protection (10)', 'Physical immunity for an ally with aggro, or for you. It drops them from threat and stops their attacks.'],
        ['Blessing of Freedom (18)', 'Breaks roots and slows. With Pursuit of Justice it gets you out of most bad pulls.'],
        ['Divine Intervention (30)', 'Save the healer when a wipe is certain, so they can resurrect everyone.'],
        ['Divine Shield (34)', 'Full immunity on a long cooldown. Run, or heal to full.'],
      ],
    },
    notes: ['lay-on-hands'],
    sources: ['09', '25', '02'],
  },
];
