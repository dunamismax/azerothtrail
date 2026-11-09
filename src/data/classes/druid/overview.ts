import type { GuideSection } from '../../types.ts';

// Advice for every Druid spec, shown on /druid/specs/.
export const overview: GuideSection[] = [
  {
    id: 'races',
    title: 'Which race',
    table: {
      head: ['Race', 'Faction', 'Starts in', 'Notes'],
      rows: [
        ['Night Elf', 'Alliance', 'Teldrassil', 'The classic Alliance Druid. Bear quest from Darnassus.'],
        ['High Order Skyborne', 'Alliance', 'Zephras Isle', 'New in Forever. Skyborne Druids get 3% haste on their own, which casters and healers like.'],
        ['Tauren', 'Horde', 'Mulgore', 'The classic Horde Druid. Bear quest from Thunder Bluff.'],
        ['Windshaper Skyborne', 'Horde', 'Zephras Isle', 'New in Forever, with the same 3% haste.'],
      ],
    },
    notes: ['skyborne-exit'],
    sources: ['21', '28', '04'],
  },
  {
    id: 'professions',
    title: 'Professions',
    bullets: [
      'Skinning and Leatherworking: gear for yourself, and the Camp Tent for campfires is one of the strongest campfire items.',
      'Herbalism and Alchemy: your own potions and elixirs, mana potions included.',
      'Engineering appeals for its gadgets, but most only matter at 60. Consider switching near the end of leveling.',
      'First Aid as well: bandages matter less to a healer, but it also makes health potions.',
    ],
    sources: ['24'],
  },
  {
    id: 'save-time',
    title: 'Save time between pulls',
    bullets: [
      'Keep Track Humanoids, Dash and Aquatic Form available when the route benefits.',
      'Log out at an inn for rested experience. Buy enough bag space to avoid frequent vendor trips.',
      'Cooking buffs add 5% experience from kills. Leatherworkers can place a Camp Tent once an hour.',
      'Grab the Cozy Sleeping Bag at 14 for a stacking experience buff.',
      'Gather quests before a dungeon: kill experience inside is low, and quests are where the experience is.',
      'Buff players near you with Mark of the Wild and Thorns, even outside a group.',
    ],
    sources: ['05', '24'],
  },
];
