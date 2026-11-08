import type { Source, UpdateNote } from '../../types.ts';

// `checked` is the date each page was read for this guide; null means the
// source is listed for reference but was not rechecked.
export const sources: Source[] = [
  {
    id: '01', checked: '2026-11-07',
    title: 'World of Warcraft: Forever is now live', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-us/article/24315820/world-of-warcraft-forever-now-live',
    covers: 'Rulesets (Normal, PvP, Roleplay), new zones, Zephras Isle 1-12, Riverglades mid-30s to mid-40s, nine new dungeons, raid access from December 9.',
  },
  {
    id: '02', checked: '2026-11-07',
    title: 'Class deep dives: Hunter and Druid', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-us/article/24301515/world-of-warcraft-forever-class-deep-dives-hunter-and-druid',
    covers: 'Dual spec at 40, form attacks use equipped weapon DPS, Shifting Power replaces Tiger’s Fury, Wild Growth, Swiftmend redesign. Some tree details were superseded by [03].',
  },
  {
    id: '03', checked: '2026-11-07', sourceUpdated: '2026-11-02',
    title: 'WoW Forever beta development notes (updated November 2)', publisher: 'Blizzard forums',
    url: 'https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-%E2%80%93-updated-november-2/2360696/9',
    covers: 'Launch tree reshuffle: Lacerate becomes a Feral talent, Heart of the Wild and Furor swap trees, Primal Bite and Shifting Power move to row 7, Bloom replaces Gift of the Earthmother, Wild Growth 3 s cast, Poised at 32, total training cost about 206 gold.',
  },
  {
    id: '04', checked: '2026-11-07', sourceUpdated: '2026-11-04',
    title: 'Druid class quests guide', publisher: 'Icy Veins',
    url: 'https://www.icy-veins.com/wow-forever/druid-class-quests',
    covers: 'Bear (Night Elf, Tauren, Skyborne), Aquatic and Cat Form walkthroughs with coordinates.',
  },
  {
    id: '05', checked: '2026-11-07', sourceUpdated: '2026-11-04',
    title: 'Feral Druid leveling guide', publisher: 'Icy Veins',
    url: 'https://www.icy-veins.com/wow-forever/feral-druid-leveling/',
    covers: 'Bear and Cat priorities, Ravage opener, Shifting Power under 50 Energy, weapon DPS over weapon speed, leveling milestones.',
  },
  {
    id: '06', checked: '2026-11-07', sourceUpdated: '2026-11-05',
    title: 'Leveling routes', publisher: 'Forever Mastery',
    url: 'https://forevermastery.com/en/guides/leveling',
    covers: 'Faction-specific zone routes and level bands. New zones had no route yet when checked.',
  },
  {
    id: '07', checked: '2026-11-07',
    title: 'Explore the new dungeons of World of Warcraft: Forever', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-us/article/24301455/explore-the-new-dungeons-of-world-of-warcraft-forever',
    covers: 'Official level ranges and locations for the nine new dungeons; City of Dalaran entry quests.',
  },
  {
    id: '08', checked: null,
    title: 'Alliance and Horde leveling guides (Classic)', publisher: 'Wowhead Classic',
    url: 'https://www.wowhead.com/classic/guide/alliance-leveling-classic-wow',
    covers: 'Classic zone geography and hub names, used only as a cross-check. Horde: https://www.wowhead.com/classic/guide/horde-leveling-classic-wow',
  },
  {
    id: '09', checked: '2026-11-07', sourceUpdated: '2026-11-07',
    title: 'Riverglades zone overview', publisher: 'Wowhead',
    url: 'https://www.wowhead.com/forever/guide/riverglades-zone-overview',
    covers: 'Riverglades 36-44, hubs, flight points, road entrances, Tanaris boat docks, Blood Master’s Ring, Krol’dok entrance.',
  },
  {
    id: '10', checked: '2026-11-07', sourceUpdated: '2026-11-06',
    title: 'WoW Forever zones by level', publisher: 'ByteTavern',
    url: 'https://bytetavern.com/wow-forever-zones-by-level/',
    covers: 'Mount Hyjal 55-60 (live Group Finder), Shen’dralas 38-43 (player-recorded), Classic zone ranges.',
  },
  {
    id: '11', checked: '2026-11-07', sourceUpdated: '2026-11-04',
    title: 'Feral Druid tank talent builds', publisher: 'Wowhead',
    url: 'https://www.wowhead.com/forever/guide/classes/druid/feral/talent-builds-pve-tank',
    covers: 'Dedicated Bear builds. The guide body did not load when checked, so the tank variant here rests on the talent calculator.',
  },
  {
    id: '12', checked: '2026-11-07', sourceUpdated: '2026-11-04',
    title: 'Restoration Druid healer talent builds', publisher: 'Wowhead',
    url: 'https://www.wowhead.com/forever/guide/classes/druid/restoration/talent-builds-pve-healer',
    covers: 'Deep Resto (18/0/33) for dungeons; NG/RG (21/0/30) now recommended for raids.',
  },
  {
    id: '13', checked: '2026-11-07',
    title: 'WoW Forever hotfixes, November 6, 2026', publisher: 'Blizzard forums',
    url: 'https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-6-2026/2403040',
    covers: 'Bloom now heals, Swiftmend tooltip corrected, Zephras Druid trainer fixed (Nov 5), Ruins of Lordaeron quest at 15 for Horde.',
  },
  {
    id: '14', checked: '2026-11-07',
    title: 'Raid overview: locations, raid sizes and attunement', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-gb/article/24303009/world-of-warcraft-forever-raid-overviewlocations-raid-sizes-and-attunement',
    covers: 'Barrow Deeps (10), Hyjal Summit (20), Onyxia’s Lair (40), December 9; both Onyxia attunement chains.',
  },
  {
    id: '15', checked: '2026-11-07',
    title: 'Restoration Druid phase 1 best in slot gear', publisher: 'Wowhead',
    url: 'https://www.wowhead.com/forever/guide/classes/druid/restoration/bis-gear',
    covers: 'Healing first, then Intellect, Spirit and MP5; list still being filled in. Mooncloth and Mender’s Leather crafted options.',
  },
  {
    id: '16', checked: '2026-11-07',
    title: 'Druid talent calculator', publisher: 'Forever Guide',
    url: 'https://foreverguide.net/tools/talent-calculator/druid/',
    covers: 'Launch talent rows, max ranks and row thresholds (5 points per row), used to check every point in both builds.',
  },
  {
    id: '17', checked: '2026-11-07',
    title: 'Druid spells by level (build 1.60.1.70862)', publisher: 'The Forever Era',
    url: 'https://theforeverera.com/en/spells/druid/levels/',
    covers: 'Trainer levels and ranks for every Druid spell, including talent ranks for Lacerate and Primal Bite.',
  },
  {
    id: '18', checked: null,
    title: 'Restoration Druid healer rotation and cooldowns', publisher: 'Icy Veins',
    url: 'https://www.icy-veins.com/wow-forever/restoration-druid-healer-pve-rotation-cooldowns-abilities',
    covers: 'Healing priorities, as a cross-check.',
  },
  {
    id: '19', checked: null,
    title: 'Druid leveling guide 1-60', publisher: 'Mobalytics',
    url: 'https://mobalytics.gg/wow-forever/classes/druid-leveling-guide-1-60',
    covers: 'Feral leveling, as a cross-check.',
  },
  {
    id: '20', checked: null,
    title: 'Feral leveling tips (Classic)', publisher: 'Wowhead Classic',
    url: 'https://www.wowhead.com/classic/guide/classes/druid/feral/leveling-tips',
    covers: 'Classic Feral habits, used only as background.',
  },
  {
    id: '21', checked: '2026-11-07',
    title: 'Druid guide: talent builds, races, forms and changes', publisher: 'Warcraft Tavern',
    url: 'https://www.warcrafttavern.com/forever/guides/druid/',
    covers: 'Druid races per faction (High Order Skyborne Alliance, Windshaper Skyborne Horde); Predatory Discipline keeps unused Energy after Ferocious Bite.',
  },
  {
    id: '22', checked: '2026-11-07', sourceUpdated: '2026-10-26',
    title: 'How to get from Zephras Isle to Stormwind or Orgrimmar', publisher: 'Gamer Guides',
    url: 'https://gamer-guides.com/warcraft-forever/zephras-isle-to-stormwind-orgrimmar/',
    covers: 'Boat from the Valanaar dock to Dalaran, then the faction portal. Written during beta.',
  },
];

export const notes: UpdateNote[] = [
  {
    id: 'lacerate-talent', kind: 'confirmed', date: '2026-11-07',
    title: 'Lacerate is a level-25 talent, not a level-42 spell',
    body: 'Blizzard’s class deep dive listed Lacerate as baseline at 42. The November 2 notes made it a row-4 Feral talent, and the live spell list has rank 1 at 25 with trainer ranks at 34, 42, 50 and 58. This guide’s talent order already reflects that.',
    sources: ['03', '17', '16'],
  },
  {
    id: 'raid-build', kind: 'update', date: '2026-11-07',
    title: 'Raid healing: Wowhead now leads with NG/RG',
    body: 'Wowhead’s November 4 build page recommends Nature’s Grace / Improved Regrowth (21/0/30) for raids, because Wild Growth now has a 3-second cast and Bloom replaced Gift of the Earthmother. Deep Resto (18/0/33 there) remains its dungeon pick. Keep this guide’s Deep Resto build for five-player runs.',
    previously: 'Compare Deep Resto with Nature’s Grace / Improved Regrowth for raids.',
    sources: ['12'],
  },
  {
    id: 'bloom-fix', kind: 'update', date: '2026-11-06',
    title: 'Bloom now heals',
    body: 'The November 6 hotfix made Bloom correctly heal its target, so the 1-point Bloom in the Restoration build now does its job. It heals for 100% of your Spirit when your Rejuvenation or Regrowth expires.',
    sources: ['13', '03'],
  },
  {
    id: 'swiftmend-tooltip', kind: 'confirmed', date: '2026-11-06',
    title: 'Swiftmend keeps your HoT',
    body: 'Swiftmend needs your own Rejuvenation or Regrowth on the target and does not consume it. The tooltip that said otherwise was fixed in the November 6 hotfix.',
    sources: ['13', '03'],
  },
  {
    id: 'ravage-poised', kind: 'update', date: '2026-11-07',
    title: 'New at 32: Ravage and Poised',
    body: 'Ravage (rank 1 at 32) is the Prowl opener Icy Veins now recommends, and Shred stays the opener until then. Poised is a new passive at 32 that triggers while you are out of combat at full Energy. Its exact effect isn’t confirmed in our sources.',
    sources: ['17', '03', '05'],
  },
  {
    id: 'zone-ranges', kind: 'update', date: '2026-11-07',
    title: 'Zone ranges for the new zones',
    body: 'Riverglades is 36-44 per Wowhead (Blizzard says mid-30s to mid-40s). Mount Hyjal shows 55-60 in the live Group Finder. Shen’dralas is 38-43 from player-recorded quests and may rise. Darkwhisper Gorge, on the way to Hyjal, is a level 60 area.',
    sources: ['09', '10', '01'],
  },
  {
    id: 'skyborne-exit', kind: 'uncertain', date: '2026-11-07',
    title: 'Leaving Zephras Isle',
    body: 'Sources disagree on how Skyborne leave Zephras Isle. The most detailed (a beta-era guide) says to take the boat from the Valanaar dock to Dalaran, then your faction’s portal to Stormwind or Orgrimmar. Others mention skyboats to Dalaran or Thunder Bluff. Follow the in-game quest that sends you off the island.',
    sources: ['22', '21'],
  },
  {
    id: 'zephras-trainer', kind: 'update', date: '2026-11-05',
    title: 'Zephras Druid trainer fixed',
    body: 'Lotheluum Starbreeze on Zephras Isle offers Druid training as of the November 5 hotfix.',
    sources: ['13'],
  },
  {
    id: 'lordaeron-quest', kind: 'update', date: '2026-11-06',
    title: 'Ruins of Lordaeron quest at 15 for Horde',
    body: 'The Abomination’s Head offers “Unending Torment” to Horde players from level 15 (previously 16).',
    sources: ['13'],
  },
  {
    id: 'training-cost', kind: 'update', date: '2026-11-02',
    title: 'Training costs',
    body: 'Training every class ability from 1 to 60 costs about 206-207 gold in total for every class. The dual spec price was not published in our sources, so read the trainer’s quote.',
    sources: ['03'],
  },
  {
    id: 'predatory-discipline', kind: 'uncertain', date: '2026-11-07',
    title: 'What Predatory Discipline does',
    body: 'Predatory Discipline is a new row-4 Feral talent and the prerequisite for Shifting Power. Warcraft Tavern says it lets Ferocious Bite keep your unused Energy. Blizzard’s notes don’t describe it.',
    sources: ['03', '21'],
  },
];
