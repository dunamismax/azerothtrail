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
  pdf: {
    path: '/guides/druid/WoW-Forever-Druid-Leveling-Guide.pdf',
    title: 'WoW Forever Druid Leveling Guide (original PDF)',
    bytes: 122673,
    sha256: 'ea9b6cef43898460c2e6090c3ae34a10365b32d7ed1938f784422d4498510fe6',
    pages: 7,
    dated: '2026-11-07',
  },
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
  questsLead: 'Bear, Aquatic and Cat come from class quests. Travel Form and Dire Bear come straight from the trainer.',
};
