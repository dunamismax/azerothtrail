import type { Dungeon } from '../../types.ts';

// New dungeons: official ranges from Blizzard [07]. Classic dungeons keep
// `official: null`; pages show the in-game Group Finder levels from the world
// list (src/data/world, [34]).
export const dungeons: Dungeon[] = [
  { id: 'hall-of-thanes', name: 'Hall of Thanes', zone: 'Dun Morogh', official: [13, 18], isNew: true, location: 'Beneath Ironforge', easierFor: 'alliance', sources: ['07'] },
  { id: 'ruins-of-lordaeron', name: 'Ruins of Lordaeron', zone: 'Tirisfal Glades', official: [15, 20], isNew: true, location: 'The ruined city above the Undercity', easierFor: 'horde', access: 'Horde can pick up “Unending Torment” from the Abomination’s Head from level 15.', sources: ['07', '13'] },
  { id: 'deadmines', name: 'The Deadmines', zone: 'Westfall', official: null, isNew: false, location: 'Moonbrook, Westfall', easierFor: 'alliance', sources: ['08', '34'] },
  { id: 'wailing-caverns', name: 'Wailing Caverns', zone: 'The Barrens', official: null, isNew: false, location: 'Southwest of the Crossroads', easierFor: 'horde', sources: ['08', '34'] },
  { id: 'excavation-site', name: 'Excavation Site', zone: 'Wetlands', official: [24, 29], isNew: true, location: 'Near Thelgen Rock and Dun Algaz', sources: ['07'] },
  { id: 'city-of-dalaran', name: 'City of Dalaran', zone: 'Alterac Mountains', official: [28, 33], isNew: true, location: 'Alterac Mountains', access: 'Entry quest chain. Alliance: “An Alarming Request” from Emissary Jacques in Southshore. Horde: “Key to the City” and “Prison Break-In” from Magus Wordeen Voidglare in Tarren Mill.', sources: ['07'] },
  { id: 'drowned-city', name: 'The Drowned City', zone: 'Stranglethorn Vale', official: [35, 40], isNew: true, location: 'Off the coast, west of Grom’gol', sources: ['07', '13'] },
  { id: 'kroldok-stronghold', name: 'Krol’dok Stronghold', zone: 'Riverglades', official: [40, 45], isNew: true, location: 'Hills northeast of Twilight’s Shroud (37.5, 37.5)', sources: ['07', '09'] },
  { id: 'zulfarrak', name: 'Zul’Farrak', zone: 'Tanaris', official: null, isNew: false, location: 'Northwest Tanaris', sources: ['08', '34'] },
  { id: 'alcaz-prison', name: 'Alcaz Prison', zone: 'Dustwallow Marsh', official: [48, 53], isNew: true, location: 'Alcaz Island', sources: ['07'] },
  { id: 'blackrock-depths', name: 'Blackrock Depths', zone: 'Blackrock Mountain', official: null, isNew: false, location: 'Between Searing Gorge and Burning Steppes', sources: ['08', '34'] },
  { id: 'blackmaw-hold', name: 'Blackmaw Hold', zone: 'Azshara', official: [55, 60], isNew: true, location: 'Azshara', sources: ['07', '13'] },
  { id: 'shapers-terrace', name: 'Shaper’s Terrace', zone: 'Un’Goro Crater', official: [58, 60], isNew: true, location: 'Northern hills of Un’Goro Crater', sources: ['07'] },
];
