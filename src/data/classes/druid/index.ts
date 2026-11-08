import type { ClassGuide } from '../../types.ts';
import { dungeons } from './dungeons.ts';
import { feral } from './feral.ts';
import { forms } from './forms.ts';
import { restoration } from './restoration.ts';
import { brackets } from './route.ts';
import { notes, sources } from './sources.ts';
import { talents, trees } from './talents.ts';
import { training } from './training.ts';

export const druid: ClassGuide = {
  id: 'druid',
  name: 'Druid',
  ruleset: 'Normal PvE',
  tagline: 'Solo Feral to 60. Restoration after.',
  lastVerified: '2026-11-07',
  races: [
    { id: 'nightelf', name: 'Night Elf', faction: 'alliance', startZone: 'Teldrassil' },
    { id: 'skyborne-high', name: 'High Order Skyborne', faction: 'alliance', startZone: 'Zephras Isle' },
    { id: 'tauren', name: 'Tauren', faction: 'horde', startZone: 'Mulgore' },
    { id: 'skyborne-wind', name: 'Windshaper Skyborne', faction: 'horde', startZone: 'Zephras Isle' },
  ],
  trees,
  talents,
  leveling: feral,
  endgame: restoration,
  brackets,
  dungeons,
  training,
  forms,
  milestones: [
    { level: 10, text: 'Bear Form quest. Talents start.' },
    { level: 16, text: 'Aquatic Form quest. Swipe.' },
    { level: 20, text: 'Cat Form quest. Feral Charge, Omen of Clarity, Rebirth.' },
    { level: 24, text: 'Rake, Ferocious Bite, Remove Curse.' },
    { level: 25, text: 'Lacerate (talent).' },
    { level: 30, text: 'Travel Form. Leader of the Pack.' },
    { level: 32, text: 'Ravage opener and Poised.' },
    { level: 36, text: 'Frenzied Regeneration.' },
    { level: 40, text: 'Dire Bear Form, Innervate, dual spec, Primal Bite. Open Restoration.' },
    { level: 42, text: 'Shifting Power (talent).' },
    { level: 44, text: 'Barkskin.' },
    { level: 50, text: 'New ranks of Primal Bite, Lacerate and Wild Growth. Gift of the Wild.' },
    { level: 60, text: 'Restoration becomes your main group role. Raids from December 9.' },
  ],
  sources,
  notes,
  questsLabel: 'Forms and class quests',
  questsNav: 'Forms & quests',
  deferLabel: 'Skip while Feral if gold is tight',
  sourcesLead: 'Built from Blizzard’s notes and Forever-specific guides, with patch-sensitive details rechecked against the live spell list and talent calculators. Where sources disagree, a dated note says which one this guide follows. Classic guides were used only for familiar zone geography.',
  questsLead: 'Bear, Aquatic and Cat come from class quests. Travel Form and Dire Bear come straight from the trainer.',
};
