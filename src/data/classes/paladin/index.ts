import type { ClassGuide } from '../../types.ts';
import { dungeons } from './dungeons.ts';
import { holy } from './holy.ts';
import { overview } from './overview.ts';
import { protection } from './protection.ts';
import { quests } from './quests.ts';
import { retribution } from './retribution.ts';
import { brackets } from './route.ts';
import { notes, sources } from './sources.ts';
import { talents, trees } from './talents.ts';
import { training } from './training.ts';

export const paladin: ClassGuide = {
  id: 'paladin',
  name: 'Paladin',
  ruleset: 'Normal PvE',
  tagline: 'Holy, Protection or Retribution, each with its own build from 10 to 60.',
  pitch: 'A plate-wearing hybrid that heals itself: tank, heal or hit hard, and survive almost anything on the way to 60.',
  lastVerified: '2026-11-10',
  races: [
    { id: 'human', name: 'Human', faction: 'alliance', startZone: 'Northshire Valley, Elwynn Forest' },
    { id: 'dwarf', name: 'Dwarf', faction: 'alliance', startZone: 'Coldridge Valley, Dun Morogh' },
    { id: 'undead', name: 'Undead', faction: 'horde', startZone: 'Deathknell, Tirisfal Glades', note: 'New Paladin race in Forever.' },
  ],
  trees,
  talents,
  specs: [holy, protection, retribution],
  defaultSpec: 'protection',
  overview,
  brackets,
  dungeons,
  training,
  forms: quests,
  milestones: [
    { level: 4, text: 'Judgement. It no longer consumes your Seal.' },
    { level: 6, text: 'Holy Strike and Divine Protection.' },
    { level: 10, text: 'Righteous Fury, Seal of Fury (taunt), Lay on Hands. Talents start.' },
    { level: 12, text: 'Redemption class quest.' },
    { level: 16, text: 'Retribution Aura.' },
    { level: 20, text: 'Consecration, Blessing of Kings, Exorcism, Flash of Light. Tome of Valor and Verigan’s Fist.' },
    { level: 22, text: 'Cloak of the Divine Storm (Alliance).' },
    { level: 30, text: 'Divine Intervention, Seal of Light.' },
    { level: 34, text: 'Divine Shield.' },
    { level: 40, text: 'Summon Warhorse, plate and dual spec.' },
    { level: 42, text: 'Cleanse.' },
    { level: 44, text: 'Hammer of Wrath.' },
    { level: 50, text: 'Holy Wrath, and new ranks of Consecration and Lay on Hands.' },
    { level: 52, text: 'Greater Blessings begin.' },
    { level: 60, text: 'Greater Blessing of Kings, Charger quest. Raids from December 9.' },
  ],
  sources,
  notes,
  questsLabel: 'Class quests',
  questsNav: 'Class quests',
  questsLead: 'Redemption at 12, a shield and Verigan’s Fist at 20, a cloak at 22, the free Warhorse at 40 and the Charger at 60.',
  sourcesLead: 'Built from Blizzard’s Paladin deep dive and launch notes, the live spell list and talent calculators, and the current Icy Veins guides for all three specs and Mobalytics’ Protection guide. Where they disagree, a dated note says which one this guide follows. Classic guides were used only for zone geography and the Classic steps of class quests.',
};
