import type { ClassGuide } from '../../types.ts';
import { balance } from './balance.ts';
import { dungeons } from './dungeons.ts';
import { feral } from './feral.ts';
import { forms } from './forms.ts';
import { overview } from './overview.ts';
import { restoration } from './restoration.ts';
import { brackets } from './route.ts';
import { notes, sources } from './sources.ts';
import { talents, trees } from './talents.ts';
import { training } from './training.ts';

export const druid: ClassGuide = {
  id: 'druid',
  name: 'Druid',
  ruleset: 'Normal PvE',
  tagline: 'Balance, Feral or Restoration, each with its own build from 10 to 60.',
  pitch: 'The shapeshifter: Cat, Bear, Moonkin or healer, with Travel Form and a heal for every bad pull on the way to 60.',
  lastVerified: '2026-11-10',
  races: [
    { id: 'nightelf', name: 'Night Elf', faction: 'alliance', startZone: 'Teldrassil' },
    { id: 'skyborne-high', name: 'High Order Skyborne', faction: 'alliance', startZone: 'Zephras Isle' },
    { id: 'tauren', name: 'Tauren', faction: 'horde', startZone: 'Mulgore' },
    { id: 'skyborne-wind', name: 'Windshaper Skyborne', faction: 'horde', startZone: 'Zephras Isle' },
  ],
  trees,
  talents,
  specs: [balance, feral, restoration],
  defaultSpec: 'feral',
  overview,
  brackets,
  dungeons,
  training,
  forms,
  milestones: [
    { level: 10, text: 'Bear Form quest. Talents start.' },
    { level: 16, text: 'Aquatic Form quest. Swipe.' },
    { level: 20, text: 'Cat Form quest. Omen of Clarity, Rebirth, Starfire.' },
    { level: 24, text: 'Rake, Ferocious Bite, Remove Curse.' },
    { level: 25, text: 'Row-4 talents open: Lacerate, Insect Swarm, Swiftmend.' },
    { level: 30, text: 'Travel Form and Tranquility.' },
    { level: 32, text: 'Ravage opener and Poised.' },
    { level: 36, text: 'Frenzied Regeneration.' },
    { level: 40, text: 'Dire Bear Form, Innervate, Hurricane, dual spec. Row-7 talents open.' },
    { level: 44, text: 'Barkskin.' },
    { level: 50, text: 'Gift of the Wild.' },
    { level: 60, text: 'Respec into your level-60 build. Raids from December 9.' },
  ],
  sources,
  notes,
  questsLabel: 'Forms and class quests',
  questsNav: 'Forms & quests',
  sourcesLead: 'Built from Blizzard’s notes and Forever-specific guides, with patch-sensitive details rechecked against the live spell list and talent calculators. Where sources disagree, a dated note says which one this guide follows. Classic guides were used only for familiar zone geography.',
  questsLead: 'Bear, Aquatic and Cat come from class quests. Travel Form and Dire Bear come straight from the trainer.',
};
