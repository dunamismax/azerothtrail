import type { Faction, IsoDate, Source, UpdateNote } from '../types.ts';

// Where to level, for any class: every leveling zone with its hubs per
// faction, all 28 dungeons with their levels, and a level-by-level pick of
// where to go. It powers /zones/ and the finder on the home page. The class
// guides keep their own, class-specific routes; this page is the quick answer.

export type Continent = 'Eastern Kingdoms' | 'Kalimdor' | 'Skywall';

export interface Zone {
  /** Stable id, also the #anchor on /zones/. */
  id: string;
  name: string;
  continent: Continent;
  /** Questing range. */
  levels: readonly [number, number];
  /** Quest hubs (with flight points where there is one) per faction. A faction without hubs has nowhere to start there. */
  hubs: Partial<Record<Faction, readonly string[]>>;
  isNew?: boolean;
  note?: string;
  sources: string[];
}

export interface WorldDungeon {
  /** Matches the class guides' dungeon ids. */
  id: string;
  name: string;
  /** Id of the zone the entrance is in, or a city name. */
  zone: string;
  levels: readonly [number, number];
  /** Where the levels come from: Blizzard's announcement (new dungeons) or the in-game Group Finder (Classic ones). */
  levelSource: 'blizzard' | 'group-finder';
  isNew: boolean;
  location: string;
  easierFor?: Faction;
  note?: string;
  sources: string[];
}

export interface WorldPick {
  /** One line: where to go and in what order. */
  go: string;
  /** Zone ids for the main plan, in order. */
  zones: readonly string[];
  /** Zone ids that work just as well when the main ones are crowded. */
  also: readonly string[];
  travel?: string;
}

export interface WorldBracket {
  /** Stable link target, /zones/#lvl-20-24. Never rename a published id. */
  id: string;
  min: number;
  max: number;
  title: string;
  alliance: WorldPick;
  horde: WorldPick;
  tips: string[];
  /** Dungeon ids to call out first; every other dungeon in range is listed after them. */
  best: readonly string[];
  notes?: string[];
  sources: string[];
}

export const worldVerified: IsoDate = '2026-11-10';

export const worldSources: Source[] = [
  {
    id: 'w1', checked: '2026-11-10', sourceUpdated: '2026-11-06',
    title: 'WoW Forever zones by level', publisher: 'ByteTavern',
    url: 'https://bytetavern.com/wow-forever-zones-by-level/',
    covers: 'Level ranges for all 44 zones (Classic zones from Warcraft Wiki), the new zones’ ranges and where they come from, and the best zones per bracket.',
  },
  {
    id: 'w2', checked: '2026-11-10', sourceUpdated: '2026-11-03',
    title: 'WoW Forever dungeons by level', publisher: 'Forever Mastery',
    url: 'https://forevermastery.com/en/dungeons',
    covers: 'All 28 dungeons: Blizzard’s levels for the nine new ones, the in-game Group Finder’s levels for the 19 Classic ones (client 1.60.1.70790).',
  },
  {
    id: 'w3', checked: '2026-11-10', sourceUpdated: '2026-11-05',
    title: 'Leveling routes', publisher: 'Forever Mastery',
    url: 'https://forevermastery.com/en/guides/leveling',
    covers: 'Zone bands per faction. The new zones had no route yet on November 10.',
  },
  {
    id: 'w4', checked: '2026-11-07',
    title: 'Explore the new dungeons of World of Warcraft: Forever', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-us/article/24301455/explore-the-new-dungeons-of-world-of-warcraft-forever',
    covers: 'Official levels and locations of the nine new dungeons; City of Dalaran entry quests.',
  },
  {
    id: 'w5', checked: '2026-11-07', sourceUpdated: '2026-11-07',
    title: 'Riverglades zone overview', publisher: 'Wowhead',
    url: 'https://www.wowhead.com/forever/guide/riverglades-zone-overview',
    covers: 'Riverglades 36-44, Farholde Keep and Rog’mar flight points, Powderfuse Port boat to Tanaris, Krol’dok entrance.',
  },
  {
    id: 'w6', checked: '2026-11-10', sourceUpdated: '2026-11-09',
    title: 'WoW Forever hotfixes, November 5-9, 2026', publisher: 'Blizzard forums',
    url: 'https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-9-2026/2403040',
    covers: 'Dungeon kill experience +50%, Drowned City and Deathless Marrow tuning, Shaper’s Terrace and Alcaz Prison loot, no mounts in Stratholme, lower player caps in crowded zones.',
  },
  {
    id: 'w7', checked: '2026-11-07',
    title: 'World of Warcraft: Forever is now live', publisher: 'Blizzard',
    url: 'https://news.blizzard.com/en-us/article/24315820/world-of-warcraft-forever-now-live',
    covers: 'Zephras Isle 1-12, Riverglades mid-30s to mid-40s, nine new dungeons, raids from December 9.',
  },
];

export const worldNotes: UpdateNote[] = [
  {
    id: 'dungeon-xp', kind: 'update', date: '2026-11-09',
    title: 'Dungeon kills give 50% more experience',
    body: 'Forever launched with much lower experience for dungeon kills. Since the November 9 hotfix every enemy killed in a dungeon gives 50% more. Quest in the world first, and run a dungeon in range with its quests in your log: it is now worth the time, not just a gear run.',
    sources: ['w6'],
  },
  {
    id: 'classic-ranges', kind: 'uncertain', date: '2026-11-10',
    title: 'Classic zone levels are Classic’s',
    body: 'Blizzard has not published new levels for the 40 Classic zones, and the beta stopped at 30. Zone ranges here are Classic’s, and Forever’s 1,000+ new quests may move some by a level or two. Classic dungeon levels are the in-game Group Finder’s, so they are Forever’s own.',
    sources: ['w1', 'w2'],
  },
  {
    id: 'crowded-zones', kind: 'update', date: '2026-11-09',
    title: 'Crowded zones',
    body: 'On November 9 Blizzard lowered how many players share a zone where it was congested, more so on PvP realms. If a zone is still crowded, every bracket has a twin on the other continent at the same levels: switch instead of waiting for respawns.',
    sources: ['w6', 'w1'],
  },
  {
    id: 'new-zone-ranges', kind: 'uncertain', date: '2026-11-07',
    title: 'Levels of the new zones',
    body: 'Riverglades is 36-44 per Wowhead (Blizzard: mid-30s to mid-40s). Shen’dralas is 38-43 from player-recorded quests and may rise. Mount Hyjal shows 55-60 in the Group Finder, but Darkwhisper Gorge on the way in is level 60: go at 58 or later.',
    sources: ['w5', 'w1', 'w7'],
  },
];

const EK = 'Eastern Kingdoms';
const KAL = 'Kalimdor';

export const zones: Zone[] = [
  // Starting zones
  { id: 'zephras-isle', name: 'Zephras Isle', continent: 'Skywall', levels: [1, 12], isNew: true, hubs: { alliance: ['Valanaar'], horde: ['Valanaar'] }, note: 'Skyborne only. At 12 the boat from the Valanaar dock takes you to the mainland.', sources: ['w7', 'w1'] },
  { id: 'elwynn-forest', name: 'Elwynn Forest', continent: EK, levels: [1, 10], hubs: { alliance: ['Northshire Abbey', 'Goldshire'] }, note: 'Human start.', sources: ['w1'] },
  { id: 'dun-morogh', name: 'Dun Morogh', continent: EK, levels: [1, 10], hubs: { alliance: ['Coldridge Valley', 'Kharanos'] }, note: 'Dwarf and Gnome start. Hall of Thanes is beneath Ironforge.', sources: ['w1'] },
  { id: 'teldrassil', name: 'Teldrassil', continent: KAL, levels: [1, 10], hubs: { alliance: ['Shadowglen', 'Dolanaar'] }, note: 'Night Elf start.', sources: ['w1'] },
  { id: 'durotar', name: 'Durotar', continent: KAL, levels: [1, 10], hubs: { horde: ['Valley of Trials', 'Razor Hill'] }, note: 'Orc and Troll start. Ragefire Chasm is in Orgrimmar.', sources: ['w1'] },
  { id: 'mulgore', name: 'Mulgore', continent: KAL, levels: [1, 10], hubs: { horde: ['Camp Narache', 'Bloodhoof Village'] }, note: 'Tauren start. Horde Skyborne arrive at Skywatcher Plateau.', sources: ['w1'] },
  { id: 'tirisfal-glades', name: 'Tirisfal Glades', continent: EK, levels: [1, 10], hubs: { horde: ['Deathknell', 'Brill'] }, note: 'Undead start. Ruins of Lordaeron (15-20) is above the Undercity.', sources: ['w1'] },
  // 10-30
  { id: 'westfall', name: 'Westfall', continent: EK, levels: [10, 20], hubs: { alliance: ['Sentinel Hill'] }, note: 'Ends with the Deadmines.', sources: ['w1'] },
  { id: 'loch-modan', name: 'Loch Modan', continent: EK, levels: [10, 20], hubs: { alliance: ['Thelsamar'] }, sources: ['w1'] },
  { id: 'darkshore', name: 'Darkshore', continent: KAL, levels: [10, 20], hubs: { alliance: ['Auberdine'] }, note: 'Boat from Auberdine to Menethil Harbor in the Wetlands.', sources: ['w1'] },
  { id: 'silverpine-forest', name: 'Silverpine Forest', continent: EK, levels: [10, 20], hubs: { horde: ['The Sepulcher'] }, note: 'Shadowfang Keep is above Pyrewood Village.', sources: ['w1'] },
  { id: 'the-barrens', name: 'The Barrens', continent: KAL, levels: [10, 25], hubs: { horde: ['The Crossroads', 'Camp Taurajo'], alliance: ['Ratchet'] }, note: 'Home of Wailing Caverns, Razorfen Kraul and Razorfen Downs.', sources: ['w1'] },
  { id: 'redridge-mountains', name: 'Redridge Mountains', continent: EK, levels: [15, 25], hubs: { alliance: ['Lakeshire'] }, note: 'Now borders the Riverglades.', sources: ['w1'] },
  { id: 'stonetalon-mountains', name: 'Stonetalon Mountains', continent: KAL, levels: [15, 27], hubs: { alliance: ['Stonetalon Peak'], horde: ['Sun Rock Retreat'] }, sources: ['w1'] },
  { id: 'ashenvale', name: 'Ashenvale', continent: KAL, levels: [18, 30], hubs: { alliance: ['Astranaar'], horde: ['Splintertree Post'] }, note: 'Blackfathom Deeps is on Zoram Strand.', sources: ['w1'] },
  { id: 'duskwood', name: 'Duskwood', continent: EK, levels: [18, 30], hubs: { alliance: ['Darkshire'] }, sources: ['w1'] },
  { id: 'wetlands', name: 'Wetlands', continent: EK, levels: [20, 30], hubs: { alliance: ['Menethil Harbor'] }, note: 'Excavation Site (24-29) is near Thelgen Rock.', sources: ['w1', 'w4'] },
  { id: 'hillsbrad-foothills', name: 'Hillsbrad Foothills', continent: EK, levels: [20, 35], hubs: { alliance: ['Southshore'], horde: ['Tarren Mill'] }, note: 'Both factions pick up the City of Dalaran chain here.', sources: ['w1', 'w4'] },
  { id: 'thousand-needles', name: 'Thousand Needles', continent: KAL, levels: [25, 35], hubs: { alliance: ['Mirage Raceway'], horde: ['Freewind Post', 'Mirage Raceway'] }, sources: ['w1'] },
  // 30-45
  { id: 'alterac-mountains', name: 'Alterac Mountains', continent: EK, levels: [30, 40], hubs: { alliance: ['Southshore (Hillsbrad)'], horde: ['Tarren Mill (Hillsbrad)'] }, note: 'Dalaran is a city again, hostile to the Horde. Alliance Skyborne arrive here.', sources: ['w1', 'w4'] },
  { id: 'arathi-highlands', name: 'Arathi Highlands', continent: EK, levels: [30, 40], hubs: { alliance: ['Refuge Pointe'], horde: ['Hammerfall'] }, sources: ['w1'] },
  { id: 'desolace', name: 'Desolace', continent: KAL, levels: [30, 40], hubs: { alliance: ['Nijel’s Point'], horde: ['Shadowprey Village'] }, note: 'The Valley of Bones now leads south into Shen’dralas.', sources: ['w1'] },
  { id: 'stranglethorn-vale', name: 'Stranglethorn Vale', continent: EK, levels: [30, 45], hubs: { alliance: ['Rebel Camp', 'Booty Bay'], horde: ['Grom’gol Base Camp', 'Booty Bay'] }, note: 'The Drowned City (35-40) is off the west coast.', sources: ['w1', 'w4'] },
  { id: 'dustwallow-marsh', name: 'Dustwallow Marsh', continent: KAL, levels: [35, 45], hubs: { alliance: ['Theramore Isle'], horde: ['Brackenwall Village'] }, note: 'Alcaz Prison (48-53) is on Alcaz Island.', sources: ['w1', 'w4'] },
  { id: 'riverglades', name: 'Riverglades', continent: EK, levels: [36, 44], isNew: true, hubs: { alliance: ['Farholde Keep'], horde: ['Rog’mar'] }, note: 'New, 150+ quests. Walk in from Redridge, or take the goblin boat between Powderfuse Port and Steamwheedle Port in Tanaris. Krol’dok Stronghold (40-45) is here.', sources: ['w5', 'w7', 'w1'] },
  { id: 'badlands', name: 'Badlands', continent: EK, levels: [35, 45], hubs: { alliance: ['Thelsamar (Loch Modan)'], horde: ['Kargath'] }, note: 'Uldaman is in the northeast.', sources: ['w1'] },
  { id: 'swamp-of-sorrows', name: 'Swamp of Sorrows', continent: EK, levels: [35, 45], hubs: { alliance: ['Darkshire (Duskwood)'], horde: ['Stonard'] }, note: 'The Sunken Temple is here.', sources: ['w1'] },
  { id: 'shendralas', name: 'Shen’dralas', continent: KAL, levels: [38, 43], isNew: true, hubs: { alliance: ['Nijel’s Point (Desolace)'], horde: ['Shadowprey Village (Desolace)'] }, note: 'New. No flight point: ride south from Desolace through the Valley of Bones. Continues the Magram and Gelkis centaur chains.', sources: ['w1'] },
  // 40-60
  { id: 'feralas', name: 'Feralas', continent: KAL, levels: [40, 50], hubs: { alliance: ['Feathermoon Stronghold'], horde: ['Camp Mojache'] }, note: 'Dire Maul is in the center.', sources: ['w1'] },
  { id: 'tanaris', name: 'Tanaris', continent: KAL, levels: [40, 50], hubs: { alliance: ['Gadgetzan'], horde: ['Gadgetzan'] }, note: 'Boat from Steamwheedle Port to the Riverglades.', sources: ['w1', 'w5'] },
  { id: 'the-hinterlands', name: 'The Hinterlands', continent: EK, levels: [40, 50], hubs: { alliance: ['Aerie Peak'], horde: ['Revantusk Village'] }, sources: ['w1'] },
  { id: 'searing-gorge', name: 'Searing Gorge', continent: EK, levels: [45, 50], hubs: { alliance: ['Thorium Point'], horde: ['Thorium Point'] }, note: 'Blackrock Mountain is at its south edge.', sources: ['w1'] },
  { id: 'azshara', name: 'Azshara', continent: KAL, levels: [45, 55], hubs: { alliance: ['Talrendis Point'], horde: ['Valormok'] }, note: 'Blackmaw Hold (55-60) is in the north.', sources: ['w1', 'w4'] },
  { id: 'blasted-lands', name: 'Blasted Lands', continent: EK, levels: [45, 55], hubs: { alliance: ['Nethergarde Keep'], horde: ['Stonard (Swamp of Sorrows)'] }, sources: ['w1'] },
  { id: 'ungoro-crater', name: 'Un’Goro Crater', continent: KAL, levels: [48, 55], hubs: { alliance: ['Marshal’s Refuge'], horde: ['Marshal’s Refuge'] }, note: 'Shaper’s Terrace (58-60) is in the northern hills.', sources: ['w1', 'w4'] },
  { id: 'felwood', name: 'Felwood', continent: KAL, levels: [48, 55], hubs: { alliance: ['Talonbranch Glade'], horde: ['Bloodvenom Post'] }, sources: ['w1'] },
  { id: 'burning-steppes', name: 'Burning Steppes', continent: EK, levels: [50, 58], hubs: { alliance: ['Morgan’s Vigil'], horde: ['Flame Crest'] }, sources: ['w1'] },
  { id: 'western-plaguelands', name: 'Western Plaguelands', continent: EK, levels: [51, 58], hubs: { alliance: ['Chillwind Camp'], horde: ['The Bulwark'] }, note: 'Scholomance is in Caer Darrow.', sources: ['w1'] },
  { id: 'eastern-plaguelands', name: 'Eastern Plaguelands', continent: EK, levels: [53, 60], hubs: { alliance: ['Light’s Hope Chapel'], horde: ['Light’s Hope Chapel'] }, note: 'Stratholme is in the north.', sources: ['w1'] },
  { id: 'winterspring', name: 'Winterspring', continent: KAL, levels: [53, 60], hubs: { alliance: ['Everlook'], horde: ['Everlook'] }, note: 'Darkwhisper Gorge, in the south, leads to Mount Hyjal.', sources: ['w1'] },
  { id: 'silithus', name: 'Silithus', continent: KAL, levels: [55, 60], hubs: { alliance: ['Cenarion Hold'], horde: ['Cenarion Hold'] }, sources: ['w1'] },
  { id: 'mount-hyjal', name: 'Mount Hyjal', continent: KAL, levels: [55, 60], isNew: true, hubs: { alliance: ['Tainted Foothills', 'Summit of Eternity'], horde: ['Tainted Foothills', 'Summit of Eternity'] }, note: 'New. Through Darkwhisper Gorge (level 60) in Winterspring; Tainted Foothills flies to Everlook. Raids here from December 9.', sources: ['w1', 'w7'] },
];

export const worldDungeons: WorldDungeon[] = [
  { id: 'ragefire-chasm', name: 'Ragefire Chasm', zone: 'Orgrimmar', levels: [13, 18], levelSource: 'group-finder', isNew: false, location: 'Cleft of Shadow, Orgrimmar', easierFor: 'horde', sources: ['w2'] },
  { id: 'hall-of-thanes', name: 'Hall of Thanes', zone: 'dun-morogh', levels: [13, 18], levelSource: 'blizzard', isNew: true, location: 'Beneath Ironforge', easierFor: 'alliance', sources: ['w4'] },
  { id: 'ruins-of-lordaeron', name: 'Ruins of Lordaeron', zone: 'tirisfal-glades', levels: [15, 20], levelSource: 'blizzard', isNew: true, location: 'The ruined city above the Undercity', easierFor: 'horde', note: 'Horde get “Unending Torment” from the Abomination’s Head at 15.', sources: ['w4', 'w6'] },
  { id: 'wailing-caverns', name: 'Wailing Caverns', zone: 'the-barrens', levels: [15, 24], levelSource: 'group-finder', isNew: false, location: 'Southwest of the Crossroads', easierFor: 'horde', sources: ['w2'] },
  { id: 'deadmines', name: 'The Deadmines', zone: 'westfall', levels: [17, 26], levelSource: 'group-finder', isNew: false, location: 'Moonbrook, Westfall', easierFor: 'alliance', sources: ['w2'] },
  { id: 'shadowfang-keep', name: 'Shadowfang Keep', zone: 'silverpine-forest', levels: [20, 30], levelSource: 'group-finder', isNew: false, location: 'Above Pyrewood Village', easierFor: 'horde', sources: ['w2'] },
  { id: 'excavation-site', name: 'Excavation Site', zone: 'wetlands', levels: [24, 29], levelSource: 'blizzard', isNew: true, location: 'Near Thelgen Rock and Dun Algaz', note: 'The live Group Finder lists it at 26-31.', sources: ['w4', 'w1'] },
  { id: 'blackfathom-deeps', name: 'Blackfathom Deeps', zone: 'ashenvale', levels: [24, 32], levelSource: 'group-finder', isNew: false, location: 'Zoram Strand, western Ashenvale', sources: ['w2'] },
  { id: 'stockade', name: 'The Stockade', zone: 'Stormwind City', levels: [24, 32], levelSource: 'group-finder', isNew: false, location: 'Mage Quarter canals, Stormwind', easierFor: 'alliance', sources: ['w2'] },
  { id: 'city-of-dalaran', name: 'City of Dalaran', zone: 'alterac-mountains', levels: [28, 33], levelSource: 'blizzard', isNew: true, location: 'Alterac Mountains', note: 'Entry quests. Alliance: “An Alarming Request” from Emissary Jacques in Southshore. Horde: “Key to the City” and “Prison Break-In” from Magus Wordeen Voidglare in Tarren Mill.', sources: ['w4'] },
  { id: 'gnomeregan', name: 'Gnomeregan', zone: 'dun-morogh', levels: [29, 38], levelSource: 'group-finder', isNew: false, location: 'Western Dun Morogh', easierFor: 'alliance', sources: ['w2'] },
  { id: 'razorfen-kraul', name: 'Razorfen Kraul', zone: 'the-barrens', levels: [29, 38], levelSource: 'group-finder', isNew: false, location: 'Southern Barrens', easierFor: 'horde', sources: ['w2'] },
  { id: 'scarlet-monastery', name: 'Scarlet Monastery', zone: 'tirisfal-glades', levels: [30, 46], levelSource: 'group-finder', isNew: false, location: 'Northeastern Tirisfal Glades', easierFor: 'horde', note: 'Four wings, lowest to highest: Graveyard, Library, Armory, Cathedral.', sources: ['w2'] },
  { id: 'drowned-city', name: 'The Drowned City', zone: 'stranglethorn-vale', levels: [35, 40], levelSource: 'blizzard', isNew: true, location: 'Off the coast, west of Grom’gol', note: 'Easier since November 9: its creatures were dealing about 30% too much damage, and the Deathless Marrow fight was toned down.', sources: ['w4', 'w6'] },
  { id: 'razorfen-downs', name: 'Razorfen Downs', zone: 'the-barrens', levels: [37, 46], levelSource: 'group-finder', isNew: false, location: 'Where the Barrens meet Thousand Needles', sources: ['w2'] },
  { id: 'kroldok-stronghold', name: 'Krol’dok Stronghold', zone: 'riverglades', levels: [40, 45], levelSource: 'blizzard', isNew: true, location: 'Hills northeast of Twilight’s Shroud (37.5, 37.5)', sources: ['w4', 'w5'] },
  { id: 'uldaman', name: 'Uldaman', zone: 'badlands', levels: [41, 51], levelSource: 'group-finder', isNew: false, location: 'Northeastern Badlands', sources: ['w2'] },
  { id: 'zulfarrak', name: 'Zul’Farrak', zone: 'tanaris', levels: [44, 54], levelSource: 'group-finder', isNew: false, location: 'Northwest Tanaris', sources: ['w2'] },
  { id: 'maraudon', name: 'Maraudon', zone: 'desolace', levels: [46, 55], levelSource: 'group-finder', isNew: false, location: 'Southwestern Desolace', sources: ['w2'] },
  { id: 'alcaz-prison', name: 'Alcaz Prison', zone: 'dustwallow-marsh', levels: [48, 53], levelSource: 'blizzard', isNew: true, location: 'Alcaz Island', sources: ['w4'] },
  { id: 'sunken-temple', name: 'Sunken Temple', zone: 'swamp-of-sorrows', levels: [50, 60], levelSource: 'group-finder', isNew: false, location: 'The Pool of Tears, Swamp of Sorrows', sources: ['w2'] },
  { id: 'blackrock-depths', name: 'Blackrock Depths', zone: 'searing-gorge', levels: [52, 60], levelSource: 'group-finder', isNew: false, location: 'Blackrock Mountain, between Searing Gorge and Burning Steppes', sources: ['w2'] },
  { id: 'dire-maul', name: 'Dire Maul', zone: 'feralas', levels: [54, 60], levelSource: 'group-finder', isNew: false, location: 'Central Feralas. Three wings: East, West, North', sources: ['w2'] },
  { id: 'blackmaw-hold', name: 'Blackmaw Hold', zone: 'azshara', levels: [55, 60], levelSource: 'blizzard', isNew: true, location: 'Northern Azshara', sources: ['w4'] },
  { id: 'blackrock-spire', name: 'Blackrock Spire', zone: 'burning-steppes', levels: [55, 60], levelSource: 'group-finder', isNew: false, location: 'Blackrock Mountain. Lower (5 players) and Upper (10)', sources: ['w2'] },
  { id: 'scholomance', name: 'Scholomance', zone: 'western-plaguelands', levels: [58, 60], levelSource: 'group-finder', isNew: false, location: 'Caer Darrow, Western Plaguelands', sources: ['w2'] },
  { id: 'stratholme', name: 'Stratholme', zone: 'eastern-plaguelands', levels: [58, 60], levelSource: 'group-finder', isNew: false, location: 'Northern Eastern Plaguelands. Two gates: Main and Service', note: 'No mounting inside since November 9.', sources: ['w2', 'w6'] },
  { id: 'shapers-terrace', name: 'Shaper’s Terrace', zone: 'ungoro-crater', levels: [58, 60], levelSource: 'blizzard', isNew: true, location: 'Northern hills of Un’Goro Crater', note: 'Its bosses’ loot was fixed on November 9.', sources: ['w4', 'w6'] },
];

export const worldBrackets: WorldBracket[] = [
  {
    id: 'lvl-1-9', min: 1, max: 9, title: 'Your starting zone',
    alliance: { go: 'Quest your race’s starting zone: Humans in Elwynn Forest, Dwarves and Gnomes in Dun Morogh, Night Elves in Teldrassil. Skyborne start on Zephras Isle and stay to 12.', zones: ['elwynn-forest', 'dun-morogh', 'teldrassil', 'zephras-isle'], also: [] },
    horde: { go: 'Quest your race’s starting zone: Orcs and Trolls in Durotar, Tauren in Mulgore, Undead in Tirisfal Glades. Skyborne start on Zephras Isle and stay to 12.', zones: ['durotar', 'mulgore', 'tirisfal-glades', 'zephras-isle'], also: [] },
    tips: [
      'Nothing else is in range yet. Do every quest in your start zone and its second town.',
      'Train every two levels, and pick up Cooking and First Aid early: cooked food gives bonus experience.',
    ],
    best: [],
    sources: ['w1', 'w3', 'w7'],
  },
  {
    id: 'lvl-10-14', min: 10, max: 14, title: 'Your first zone away from home',
    alliance: { go: 'Westfall from Sentinel Hill or Loch Modan from Thelsamar. Night Elves cross to Darkshore first.', zones: ['westfall', 'loch-modan'], also: ['darkshore'], travel: 'From Teldrassil, take the boat from Rut’theran Village to Auberdine.' },
    horde: { go: 'The Barrens from the Crossroads. Undead can stay east in Silverpine Forest first.', zones: ['the-barrens'], also: ['silverpine-forest'], travel: 'The zeppelin outside Brill links Tirisfal and Orgrimmar.' },
    tips: [
      'The first new dungeons open at 13: Hall of Thanes for the Alliance, Ragefire Chasm for the Horde.',
      'From 14, start the Cozy Sleeping Bag chain (+3% experience after 3 minutes asleep).',
    ],
    best: ['hall-of-thanes', 'ragefire-chasm'],
    sources: ['w1', 'w3', 'w4'],
  },
  {
    id: 'lvl-15-19', min: 15, max: 19, title: 'Finish your first zones, first real dungeons',
    alliance: { go: 'Finish Westfall or Loch Modan (Darkshore for Night Elves), then Redridge from Lakeshire at 18.', zones: ['westfall', 'redridge-mountains'], also: ['loch-modan', 'darkshore'] },
    horde: { go: 'Keep working the Barrens, or Silverpine Forest. Stonetalon Mountains from Sun Rock Retreat opens around 18.', zones: ['the-barrens', 'silverpine-forest'], also: ['stonetalon-mountains'] },
    tips: [
      'Collect a dungeon’s quests before you run it: the quests are where most of the experience is.',
      'Ruins of Lordaeron (15-20) and Wailing Caverns are the Horde’s runs; the Deadmines (17-26) is the Alliance’s.',
    ],
    best: ['ruins-of-lordaeron', 'deadmines', 'wailing-caverns'],
    notes: ['dungeon-xp'],
    sources: ['w1', 'w2', 'w3', 'w4'],
  },
  {
    id: 'lvl-20-24', min: 20, max: 24, title: 'Redridge, Duskwood and Ashenvale',
    alliance: { go: 'Redridge from Lakeshire, then Duskwood from Darkshire. Ashenvale from Astranaar works just as well on Kalimdor.', zones: ['redridge-mountains', 'duskwood'], also: ['ashenvale', 'wetlands'] },
    horde: { go: 'Stonetalon from Sun Rock Retreat and the end of the Barrens, then Ashenvale from Splintertree Post or Hillsbrad from Tarren Mill.', zones: ['stonetalon-mountains', 'ashenvale'], also: ['the-barrens', 'hillsbrad-foothills'] },
    tips: [
      'Blizzard sped up respawns in Redridge, Stonetalon, Duskwood, Ashenvale and the Wetlands during the beta, so their quests are easier to finish.',
      'Shadowfang Keep (20-30) is the Horde’s run here, and the Deadmines is still in range for the Alliance.',
    ],
    best: ['shadowfang-keep', 'deadmines', 'wailing-caverns'],
    sources: ['w1', 'w2', 'w3'],
  },
  {
    id: 'lvl-25-29', min: 25, max: 29, title: 'Duskwood, the Wetlands and Hillsbrad',
    alliance: { go: 'Finish Duskwood, then the Wetlands from Menethil Harbor and Hillsbrad from Southshore.', zones: ['duskwood', 'wetlands', 'hillsbrad-foothills'], also: ['ashenvale'] },
    horde: { go: 'Hillsbrad from Tarren Mill, Ashenvale from Splintertree Post, then Thousand Needles from Freewind Post.', zones: ['hillsbrad-foothills', 'ashenvale', 'thousand-needles'], also: ['stonetalon-mountains'] },
    tips: [
      'The new Excavation Site (24-29) is in the Wetlands. Pick up the City of Dalaran chain in Southshore or Tarren Mill for 28.',
    ],
    best: ['excavation-site', 'blackfathom-deeps', 'shadowfang-keep', 'stockade'],
    sources: ['w1', 'w2', 'w3', 'w4'],
  },
  {
    id: 'lvl-30-35', min: 30, max: 35, title: 'Arathi, Alterac and Thousand Needles',
    alliance: { go: 'Arathi from Refuge Pointe and Alterac, then northern Stranglethorn from the Rebel Camp. Desolace from Nijel’s Point on Kalimdor.', zones: ['arathi-highlands', 'alterac-mountains', 'stranglethorn-vale'], also: ['thousand-needles', 'desolace'] },
    horde: { go: 'Thousand Needles from Freewind Post, then Arathi from Hammerfall or northern Stranglethorn from Grom’gol. Desolace from Shadowprey Village.', zones: ['thousand-needles', 'arathi-highlands', 'stranglethorn-vale'], also: ['desolace', 'alterac-mountains'] },
    tips: [
      'City of Dalaran (28-33) is the new dungeon here; its entry quests start in Hillsbrad.',
      'Scarlet Monastery opens at 30: start with the Graveyard and Library.',
    ],
    best: ['city-of-dalaran', 'scarlet-monastery', 'razorfen-kraul', 'gnomeregan'],
    sources: ['w1', 'w2', 'w3', 'w4'],
  },
  {
    id: 'lvl-36-40', min: 36, max: 40, title: 'The Riverglades',
    alliance: { go: 'The new Riverglades from Farholde Keep in the south of the zone.', zones: ['riverglades'], also: ['stranglethorn-vale', 'desolace', 'shendralas', 'dustwallow-marsh'], travel: 'Walk in from Redridge through Blackrock Pass or Redridge Pass. Farholde Keep flies to Lakeshire and Thelsamar.' },
    horde: { go: 'The new Riverglades from Rog’mar in the center of the zone.', zones: ['riverglades'], also: ['stranglethorn-vale', 'desolace', 'shendralas', 'dustwallow-marsh'], travel: 'Rog’mar flies to Stonard, Hammerfall and Kargath. From Kalimdor, take the boat from Steamwheedle Port in Tanaris.' },
    tips: [
      'The Riverglades has 150+ new quests built for exactly these levels. If it’s crowded, Stranglethorn and Desolace cover the same levels, and Shen’dralas adds a short run from 38.',
      'The Drowned City (35-40) is off Stranglethorn’s coast, and it got easier on November 9.',
      'At 40: your mount, dual spec, and Krol’dok Stronghold.',
    ],
    best: ['drowned-city', 'scarlet-monastery', 'razorfen-downs', 'kroldok-stronghold'],
    notes: ['new-zone-ranges', 'crowded-zones'],
    sources: ['w5', 'w1', 'w2', 'w4', 'w6'],
  },
  {
    id: 'lvl-41-45', min: 41, max: 45, title: 'Finish the Riverglades',
    alliance: { go: 'Finish the Riverglades, then the Badlands or Dustwallow Marsh from Theramore. At 44-45 sail from Powderfuse Port to Tanaris.', zones: ['riverglades', 'badlands', 'dustwallow-marsh'], also: ['shendralas', 'swamp-of-sorrows', 'stranglethorn-vale'] },
    horde: { go: 'Finish the Riverglades, then the Badlands from Kargath, the Swamp of Sorrows from Stonard or Dustwallow from Brackenwall. At 44-45 sail from Powderfuse Port to Tanaris.', zones: ['riverglades', 'badlands', 'swamp-of-sorrows'], also: ['shendralas', 'dustwallow-marsh', 'stranglethorn-vale'] },
    tips: [
      'Krol’dok Stronghold (40-45) is the new dungeon; Uldaman opens at 41 and Zul’Farrak at 44.',
    ],
    best: ['kroldok-stronghold', 'uldaman', 'scarlet-monastery', 'razorfen-downs'],
    sources: ['w5', 'w1', 'w2', 'w4'],
  },
  {
    id: 'lvl-46-49', min: 46, max: 49, title: 'Tanaris, Feralas and the Hinterlands',
    alliance: { go: 'Tanaris from Gadgetzan, then Feralas from Feathermoon Stronghold or the Hinterlands from Aerie Peak.', zones: ['tanaris', 'feralas', 'the-hinterlands'], also: ['azshara', 'searing-gorge'] },
    horde: { go: 'Tanaris from Gadgetzan, then Feralas from Camp Mojache or the Hinterlands from Revantusk Village.', zones: ['tanaris', 'feralas', 'the-hinterlands'], also: ['azshara', 'searing-gorge'] },
    tips: [
      'Zul’Farrak is right next to Gadgetzan. Alcaz Prison (48-53) opens at 48 in Dustwallow Marsh.',
    ],
    best: ['zulfarrak', 'maraudon', 'alcaz-prison', 'uldaman'],
    sources: ['w1', 'w2', 'w3', 'w4'],
  },
  {
    id: 'lvl-50-54', min: 50, max: 54, title: 'Un’Goro, Felwood and the Plaguelands',
    alliance: { go: 'Un’Goro from Marshal’s Refuge, then Felwood from Talonbranch Glade, or Western Plaguelands from Chillwind Camp if you stay east.', zones: ['ungoro-crater', 'felwood', 'western-plaguelands'], also: ['azshara', 'blasted-lands', 'searing-gorge', 'burning-steppes'] },
    horde: { go: 'Un’Goro from Marshal’s Refuge, then Felwood from Bloodvenom Post, or Western Plaguelands from the Bulwark if you stay east.', zones: ['ungoro-crater', 'felwood', 'western-plaguelands'], also: ['azshara', 'blasted-lands', 'searing-gorge', 'burning-steppes'] },
    tips: [
      'Alcaz Prison (48-53) is the new dungeon in this band. Blackrock Depths opens at 52 and Dire Maul at 54.',
    ],
    best: ['alcaz-prison', 'blackrock-depths', 'sunken-temple', 'maraudon'],
    sources: ['w1', 'w2', 'w3', 'w4'],
  },
  {
    id: 'lvl-55-57', min: 55, max: 57, title: 'Winterspring or the Plaguelands',
    alliance: { go: 'Winterspring from Everlook after Felwood, or Eastern Plaguelands from Light’s Hope Chapel. Burning Steppes from Morgan’s Vigil fills gaps.', zones: ['winterspring', 'eastern-plaguelands', 'western-plaguelands'], also: ['burning-steppes', 'silithus'] },
    horde: { go: 'Winterspring from Everlook after Felwood, or Eastern Plaguelands from Light’s Hope Chapel. Burning Steppes from Flame Crest fills gaps.', zones: ['winterspring', 'eastern-plaguelands', 'western-plaguelands'], also: ['burning-steppes', 'silithus'] },
    tips: [
      'Blackmaw Hold (55-60) in Azshara is the new dungeon; Lower Blackrock Spire and Dire Maul are good gear runs.',
      'Mount Hyjal is listed from 55, but Darkwhisper Gorge on the way in is level 60. Wait until 58.',
    ],
    best: ['blackmaw-hold', 'blackrock-depths', 'blackrock-spire', 'dire-maul'],
    notes: ['new-zone-ranges'],
    sources: ['w1', 'w2', 'w4'],
  },
  {
    id: 'lvl-58-60', min: 58, max: 60, title: 'Mount Hyjal and the finish',
    alliance: { go: 'Mount Hyjal through Darkwhisper Gorge, or finish Winterspring, Eastern Plaguelands or Silithus: whichever has quests left nearest you.', zones: ['mount-hyjal', 'winterspring', 'eastern-plaguelands'], also: ['silithus', 'burning-steppes'] },
    horde: { go: 'Mount Hyjal through Darkwhisper Gorge, or finish Winterspring, Eastern Plaguelands or Silithus: whichever has quests left nearest you.', zones: ['mount-hyjal', 'winterspring', 'eastern-plaguelands'], also: ['silithus', 'burning-steppes'] },
    tips: [
      'Shaper’s Terrace (58-60) in Un’Goro is the last new dungeon; Stratholme and Scholomance open at 58.',
      'At 60: raids open on December 9 (Barrow Deeps, Hyjal Summit, Onyxia’s Lair).',
    ],
    best: ['shapers-terrace', 'blackmaw-hold', 'stratholme', 'scholomance'],
    notes: ['new-zone-ranges'],
    sources: ['w1', 'w2', 'w4', 'w7'],
  },
];

export function zoneById(id: string): Zone {
  const z = zones.find((x) => x.id === id);
  if (!z) throw new Error(`Unknown zone ${id}`);
  return z;
}

export function worldDungeonById(id: string): WorldDungeon | undefined {
  return worldDungeons.find((d) => d.id === id);
}

export function worldBracketFor(level: number): WorldBracket {
  const b = worldBrackets.find((x) => level >= x.min && level <= x.max);
  if (!b) throw new Error(`No world bracket for level ${level}`);
  return b;
}

/** Name of a dungeon's entrance zone: a zone id resolves to its name, a city stays as written. */
export function dungeonZoneName(d: WorldDungeon): string {
  return zones.find((z) => z.id === d.zone)?.name ?? d.zone;
}

/** Dungeons whose levels overlap a bracket: its best picks first, then the rest by level. */
export function dungeonsForBracket(b: WorldBracket): WorldDungeon[] {
  const overlap = worldDungeons.filter((d) => d.levels[0] <= b.max && d.levels[1] >= b.min);
  const best = b.best.map((id) => overlap.find((d) => d.id === id)).filter((d): d is WorldDungeon => d !== undefined);
  return [...best, ...overlap.filter((d) => !best.includes(d)).sort((a, z) => a.levels[0] - z.levels[0])];
}

/** Every structural rule the world data must satisfy. */
export function validateWorld(): string[] {
  const problems: string[] = [];
  const check = (cond: boolean, msg: string) => { if (!cond) problems.push(`world: ${msg}`); };
  const sourceIds = new Set(worldSources.map((s) => s.id));
  const noteIds = new Set(worldNotes.map((n) => n.id));
  const zoneIds = new Set(zones.map((z) => z.id));
  check(zoneIds.size === zones.length, 'duplicate zone ids');
  check(new Set(worldDungeons.map((d) => d.id)).size === worldDungeons.length, 'duplicate dungeon ids');
  check(worldDungeons.length === 28, `expected 28 dungeons, got ${worldDungeons.length}`);
  check(worldDungeons.filter((d) => d.isNew).length === 9, 'expected nine new dungeons');
  for (const z of zones) {
    check(z.levels[0] <= z.levels[1] && z.levels[1] <= 60, `zone ${z.id} has a bad range`);
    check((z.hubs.alliance?.length ?? 0) + (z.hubs.horde?.length ?? 0) > 0, `zone ${z.id} has no hubs`);
    z.sources.forEach((s) => check(sourceIds.has(s), `zone ${z.id} cites unknown source ${s}`));
  }
  for (const d of worldDungeons) {
    check(d.levels[0] <= d.levels[1] && d.levels[1] <= 60, `dungeon ${d.id} has a bad range`);
    check(d.isNew === (d.levelSource === 'blizzard'), `dungeon ${d.id}: new dungeons use Blizzard's levels, Classic ones the Group Finder's`);
    d.sources.forEach((s) => check(sourceIds.has(s), `dungeon ${d.id} cites unknown source ${s}`));
  }
  const sorted = [...worldBrackets].sort((a, b) => a.min - b.min);
  check(sorted[0]?.min === 1 && sorted.at(-1)?.max === 60, 'brackets must cover 1-60');
  sorted.forEach((b, i) => {
    check(b.id === `lvl-${b.min}-${b.max}`, `bracket id ${b.id} should be lvl-${b.min}-${b.max}`);
    const next = sorted[i + 1];
    if (next) check(next.min === b.max + 1, `gap or overlap between ${b.id} and ${next.id}`);
    for (const f of ['alliance', 'horde'] as const) {
      for (const id of [...b[f].zones, ...b[f].also]) {
        if (!zoneIds.has(id)) { check(false, `${b.id} ${f} names unknown zone ${id}`); continue; }
        const z = zoneById(id);
        check((z.hubs[f]?.length ?? 0) > 0, `${b.id}: ${f} has no hub in ${id}`);
        check(z.levels[0] <= b.max && z.levels[1] >= b.min, `${b.id}: ${id} (${z.levels.join('-')}) doesn't overlap the bracket`);
      }
    }
    for (const id of b.best) {
      const d = worldDungeonById(id);
      check(d !== undefined, `${b.id} picks unknown dungeon ${id}`);
      if (d) check(d.levels[0] <= b.max && d.levels[1] >= b.min, `${b.id}: best pick ${id} is out of range`);
    }
    b.sources.forEach((s) => check(sourceIds.has(s), `${b.id} cites unknown source ${s}`));
    (b.notes ?? []).forEach((n) => check(noteIds.has(n), `${b.id} links unknown note ${n}`));
  });
  for (const n of worldNotes) n.sources.forEach((s) => check(sourceIds.has(s), `note ${n.id} cites unknown source ${s}`));
  return problems;
}
