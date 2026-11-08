import type { Bracket } from '../../types.ts';

// The Paladin route is written for a Human first: it stays in the Eastern
// Kingdoms through the 20s, where Westfall, Duskwood and the Wetlands sit next
// to the Paladin's Stormwind and Ironforge class quests. Zone picks to 30
// follow Icy Veins [04]; bands follow Forever Mastery [18]; Classic hub names
// are geography cross-checks [19]; new zones come from [16], [22] and [23].
// Ids are stable link targets: /paladin/route/#lvl-12-15.
export const brackets: Bracket[] = [
  {
    id: 'lvl-1-5', min: 1, max: 5, title: 'The starting valley',
    alliance: {
      primary: 'Northshire Valley for Humans, Coldridge Valley for Dwarves.',
      hubs: ['Northshire Abbey', 'Coldridge Valley'],
      alternatives: [],
      travel: ['Your first Paladin trainer is inside Northshire Abbey, or in the Coldridge Valley camp.'],
    },
    horde: {
      primary: 'Deathknell in northwest Tirisfal Glades.',
      hubs: ['Deathknell'],
      alternatives: [],
      travel: ['Your first trainer is in Deathknell.'],
    },
    raceBranches: [
      { races: 'human', title: 'Human', steps: [
        'Quest Northshire to about 5, then take the road south to Goldshire.',
        'Loot every Linen Cloth from the Defias and kobolds. You need 10 for Redemption at 12.',
      ] },
      { races: 'dwarf', title: 'Dwarf', steps: ['Quest Coldridge Valley, then take the tunnel north to Kharanos.'] },
      { races: 'undead', title: 'Undead', steps: ['Quest Deathknell, then follow the road east to Brill.'] },
    ],
    plan: [
      'Seal of Righteousness and auto-attack. Heal with Holy Light between pulls, not during them.',
      'At 4, train Judgement and Blessing of Might. Judgement is off the global cooldown and no longer consumes your Seal, so press it on cooldown.',
      'Keep Devotion Aura on until Retribution Aura at 16.',
    ],
    dungeons: [],
    sources: ['04', '13', '15', '19'],
  },
  {
    id: 'lvl-6-11', min: 6, max: 11, title: 'Holy Strike, then Seal of Fury',
    alliance: {
      primary: 'Elwynn Forest from Goldshire, working east toward the Eastvale Logging Camp.',
      hubs: ['Goldshire', 'Eastvale Logging Camp'],
      alternatives: ['Dwarves: Dun Morogh from Kharanos'],
      travel: ['Stormwind is just north of Goldshire. Get the Stormwind flight path early.'],
    },
    horde: {
      primary: 'Tirisfal Glades from Brill.',
      hubs: ['Brill'],
      alternatives: [],
      travel: ['The Undercity, east of Brill, has your trainer and the zeppelins.'],
    },
    raceBranches: [
      { races: 'human', title: 'Human', steps: [
        'Brother Wilhelm, the Paladin trainer in Goldshire, covers your training until you reach Stormwind.',
        'Set your Hearthstone at the Lion’s Pride Inn in Goldshire.',
      ] },
      { races: 'dwarf', title: 'Dwarf', steps: ['Set your Hearthstone in Kharanos. Ironforge, up the road, has your trainer.'] },
    ],
    plan: [
      'Holy Strike at 6: press it on cooldown. Divine Protection at 6 is the button you press before a panic heal.',
      'Hammer of Justice and Purify at 8.',
      'At 10, train Righteous Fury, Seal of Fury, Lay on Hands and Blessing of Protection. Keep Righteous Fury and Seal of Fury up from here, solo included.',
      'Your first talent points go into Redoubt.',
    ],
    dungeons: [],
    notes: ['righteous-fury', 'seal-of-fury'],
    sources: ['02', '03', '04', '10', '15'],
  },
  {
    id: 'lvl-12-15', min: 12, max: 15, title: 'Redemption and the first new dungeon',
    alliance: {
      primary: 'Redemption in Stormwind at 12, then Loch Modan from Thelsamar.',
      hubs: ['Stormwind (Cathedral of Light)', 'Thelsamar'],
      alternatives: ['Westfall from Sentinel Hill, if you would rather stay near Stormwind'],
      travel: [
        'Take the Deeprun Tram from Stormwind to Ironforge, then the road east through Dun Morogh into Loch Modan.',
        'Grab the Ironforge and Thelsamar flight paths.',
      ],
    },
    horde: {
      primary: 'Finish Tirisfal, then Silverpine Forest from the Sepulcher.',
      hubs: ['Brill', 'The Sepulcher'],
      alternatives: ['The Barrens from the Crossroads, by zeppelin to Orgrimmar'],
      travel: ['Silverpine is south of Tirisfal along the road.'],
    },
    raceBranches: [
      { races: 'human', title: 'Human', steps: ['“The Tome of Divinity” sends you around Stormwind and Elwynn. Bring the 10 Linen Cloth.'] },
      { races: 'dwarf', title: 'Dwarf', steps: ['Your Redemption chain runs in Ironforge and Dun Morogh, and Loch Modan is next door.'] },
      { races: 'undead', title: 'Undead', steps: ['“A Lesson in Divinity” runs around Tirisfal Glades. The Ruins of Lordaeron, above the Undercity, open at 15.'] },
    ],
    plan: [
      'Do the Redemption quest at 12.',
      'Finish Redoubt at 14 and start Precision at 15.',
      'Upgrade your water at 15. Mana is what slows a Protection leveler down until Shield Specialization at 21.',
      'From 14, start the Cozy Sleeping Bag chain (+3% XP after 3 minutes of sleep). Alliance: the Nailed Plank in Westfall (37, 50). Horde: the Burned-Out Remains in the Barrens (46, 74).',
    ],
    dungeons: [
      { dungeon: 'hall-of-thanes', note: 'Beneath Ironforge, on your way to Loch Modan. A first tanking run at 15-16.' },
      { dungeon: 'ruins-of-lordaeron', note: 'Above the Undercity. Easier Horde access.' },
    ],
    notes: ['lordaeron-quest'],
    sources: ['04', '08', '10', '16', '18', '21'],
  },
  {
    id: 'lvl-16-19', min: 16, max: 19, title: 'Retribution Aura and the Deadmines',
    alliance: {
      primary: 'Westfall from Sentinel Hill, finishing with the Deadmines; start Redridge at 18-19.',
      hubs: ['Sentinel Hill', 'Lakeshire'],
      alternatives: ['Darkshore from Auberdine, by boat from Menethil Harbor'],
      travel: ['Westfall is southwest of Elwynn; Redridge is east. Pick up both flight paths.'],
    },
    horde: {
      primary: 'Silverpine Forest, then the Barrens or Stonetalon Mountains from 18.',
      hubs: ['The Sepulcher', 'The Crossroads', 'Sun Rock Retreat'],
      alternatives: [],
      travel: ['Zeppelin from Tirisfal to Orgrimmar, then south through Durotar to the Barrens.'],
    },
    raceBranches: [],
    plan: [
      'Switch to Retribution Aura at 16: it damages everything that hits you, so it is your leveling aura from here.',
      'Train Blessing of Freedom and Seal of Fury rank 2 at 18. Sacred Duty takes your points at 18-19.',
      'Collect every Deadmines quest before you run it. Start taking two mobs at a time.',
    ],
    dungeons: [
      { dungeon: 'deadmines', note: 'The end of Westfall. Grab the Whitestone Oak Lumber here if you’ll do Verigan’s Fist.' },
      { dungeon: 'hall-of-thanes', note: 'Still in range to 18.' },
      { dungeon: 'ruins-of-lordaeron', note: 'Still in range to 20.' },
      { dungeon: 'wailing-caverns', note: 'Easier Horde access.' },
    ],
    sources: ['04', '10', '15', '19'],
  },
  {
    id: 'lvl-20-24', min: 20, max: 24, title: 'Consecration and pulls of four',
    alliance: {
      primary: 'Redridge Mountains from Lakeshire, then Duskwood from Darkshire.',
      hubs: ['Lakeshire', 'Darkshire'],
      alternatives: ['Ashenvale from Astranaar, if you are chasing the Kor Gem or the Divine Storm cloak'],
      travel: ['Duskwood is south of Elwynn. Its Undead are perfect for Exorcism.'],
    },
    horde: {
      primary: 'Hillsbrad Foothills from Tarren Mill, or Stonetalon from Sun Rock Retreat; Ashenvale from Splintertree Post at 24.',
      hubs: ['Tarren Mill', 'Sun Rock Retreat', 'Splintertree Post'],
      alternatives: [],
      travel: [],
    },
    raceBranches: [
      { races: 'human dwarf', title: 'Human and Dwarf', steps: [
        'At 20, your trainer offers the Tome of Valor (a shield) and Jordan Stilwell outside Ironforge starts Verigan’s Fist.',
        'The Stockade is in Stormwind itself, a quick run while you are in town.',
      ] },
    ],
    plan: [
      'At 20: Consecration, Blessing of Kings, Exorcism and Flash of Light. Kings replaces Might as your default Blessing.',
      'Shield Specialization (20-21) makes blocks refund mana. Templar’s Bulwark at 22 is your one big panic button.',
      'Pull four, stand still, Consecration, then Holy Strike and Judgement on cooldown.',
    ],
    dungeons: [
      { dungeon: 'stockade', note: 'From about 22, in Stormwind.' },
      { dungeon: 'shadowfang-keep', note: 'Easier Horde access. Jordan’s Smithing Hammer is in its courtyard.' },
      { dungeon: 'excavation-site', note: 'From 24, in the Wetlands.' },
      { dungeon: 'wailing-caverns', note: 'Horde, in range in the low 20s.' },
    ],
    notes: ['consecration'],
    sources: ['04', '08', '10', '15', '16', '20'],
  },
  {
    id: 'lvl-25-29', min: 25, max: 29, title: 'Swift Judgement: a second taunt',
    alliance: {
      primary: 'Finish Duskwood, then the Wetlands from Menethil Harbor.',
      hubs: ['Darkshire', 'Menethil Harbor'],
      alternatives: ['Ashenvale from Astranaar for Blackfathom Deeps'],
      travel: [
        'The Wetlands are north of Loch Modan through Dun Algaz.',
        'Menethil Harbor has boats to Auberdine (Darkshore) and Theramore.',
      ],
    },
    horde: {
      primary: 'Ashenvale from Splintertree Post, then Thousand Needles or Hillsbrad.',
      hubs: ['Splintertree Post', 'Freewind Post', 'Tarren Mill'],
      alternatives: [],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Swift Judgement at 25: with Seal of Fury it is a second taunt with its own cooldown.',
      'Improved Righteous Fury at 26-28, then the first Anticipation point at 29.',
      'Upgrade your water at 25. A Lesser Arcane Elixir helps once Spell Power drives your damage.',
    ],
    dungeons: [
      { dungeon: 'excavation-site', note: 'In range to 29, right in the Wetlands.' },
      { dungeon: 'blackfathom-deeps', note: 'The Kor Gem for Verigan’s Fist is outside it.' },
      { dungeon: 'city-of-dalaran', note: 'From 28, with its entry quest from Southshore or Tarren Mill.' },
      { dungeon: 'gnomeregan', note: 'Optional at the upper end, from Ironforge.' },
    ],
    sources: ['04', '10', '15', '16'],
  },
  {
    id: 'lvl-30-35', min: 30, max: 35, title: 'Holy Shield',
    alliance: {
      primary: 'Arathi Highlands from Refuge Pointe, Hillsbrad from Southshore, then northern Stranglethorn from the Rebel Camp.',
      hubs: ['Refuge Pointe', 'Southshore', 'Rebel Camp'],
      alternatives: ['Desolace from Nijel’s Point'],
      travel: ['Southshore is also where City of Dalaran’s Alliance entry quest starts.'],
    },
    horde: {
      primary: 'Thousand Needles from Freewind Post, then Arathi from Hammerfall or northern Stranglethorn from Grom’gol.',
      hubs: ['Freewind Post', 'Hammerfall', 'Grom’gol Base Camp'],
      alternatives: ['Desolace from Shadowprey Village'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Holy Shield at 30: pre-cast it as you run in. More blocks means more mana, more Holy damage and, from 31, more Reckoning attacks.',
      'Reckoning takes your points at 31-35. Divine Intervention and Seal of Light at 30, Divine Shield at 34.',
      'Prot is a complete tank from here: say yes to dungeon groups that match your quests.',
    ],
    dungeons: [
      { dungeon: 'city-of-dalaran', note: 'In range to 33.' },
      { dungeon: 'scarlet-monastery', note: 'Graveyard and Library suit the low 30s; the Undead make it great for Exorcism.' },
      { dungeon: 'drowned-city', note: 'From 35, off Stranglethorn’s west coast.' },
    ],
    sources: ['10', '15', '16', '19'],
  },
  {
    id: 'lvl-36-40', min: 36, max: 40, title: 'Riverglades, then Shieldsworn',
    alliance: {
      primary: 'Riverglades from Farholde Keep in the south of the zone.',
      hubs: ['Farholde Keep (flight point 60.6, 81.6)'],
      alternatives: ['Stranglethorn from the Rebel Camp or Booty Bay', 'Kalimdor: Desolace into Shen’dralas'],
      travel: [
        'Road in from northern Redridge or southern Badlands.',
        'Boat from Steamwheedle Port, Tanaris (68.6, 23.0) to Powderfuse Port (80.6, 54.6).',
      ],
    },
    horde: {
      primary: 'Riverglades from Rog’mar in the center of the zone.',
      hubs: ['Rog’mar (flight point 59.6, 45.0)'],
      alternatives: ['Stranglethorn from Grom’gol or Booty Bay', 'Kalimdor: Desolace into Shen’dralas'],
      travel: [
        'Road in from northern Redridge or southern Badlands.',
        'Boat from Steamwheedle Port, Tanaris (68.6, 23.0) to Powderfuse Port (80.6, 54.6).',
      ],
    },
    raceBranches: [],
    plan: [
      'Iron Creed at 36-38: more Holy Strike threat and damage reduction.',
      'At 40, Shieldsworn makes Holy Strike your most important button. Visit your capital’s trainer for Summon Warhorse, plate and dual spec.',
      'Set Retribution as your second spec if you want faster solo questing; keep Protection for groups.',
    ],
    zoneNotes: ['Riverglades: 36-44 (Wowhead).', 'Shen’dralas: 38-43, player-recorded.'],
    dungeons: [
      { dungeon: 'drowned-city', note: 'In range to 40.' },
      { dungeon: 'scarlet-monastery', note: 'Armory and Cathedral for the late 30s.' },
      { dungeon: 'kroldok-stronghold', note: 'From 40, in Riverglades.' },
    ],
    notes: ['zone-ranges', 'mount-and-dual-spec'],
    sources: ['10', '15', '16', '22', '23'],
  },
  {
    id: 'lvl-41-45', min: 41, max: 45, title: 'Finish Riverglades, sail to Tanaris',
    alliance: {
      primary: 'Finish Riverglades, then sail from Powderfuse Port to Steamwheedle Port for Tanaris.',
      hubs: ['Farholde Keep', 'Powderfuse Port'],
      alternatives: ['Stay east: the Badlands, Swamp of Sorrows or the Hinterlands'],
      travel: ['Steamwheedle Port is east of Gadgetzan.'],
    },
    horde: {
      primary: 'Finish Riverglades, then sail from Powderfuse Port to Steamwheedle Port for Tanaris.',
      hubs: ['Rog’mar', 'Powderfuse Port'],
      alternatives: ['Stay east: the Badlands, Swamp of Sorrows or the Hinterlands'],
      travel: ['Steamwheedle Port is east of Gadgetzan.'],
    },
    raceBranches: [],
    plan: [
      'Deflection takes your points at 41-45. Cleanse at 42, Hammer of Wrath at 44.',
      'Gather a group before the Blood Master’s Ring arena chain (65.6, 21.4). It has a small entry fee.',
    ],
    dungeons: [
      { dungeon: 'kroldok-stronghold', note: 'Tank it with Shieldsworn up.' },
    ],
    sources: ['15', '16', '22'],
  },
  {
    id: 'lvl-46-49', min: 46, max: 49, title: 'Tanaris and Feralas, or the Hinterlands',
    alliance: {
      primary: 'Tanaris from Gadgetzan, then Feralas from Feathermoon Stronghold.',
      hubs: ['Gadgetzan', 'Feathermoon Stronghold'],
      alternatives: ['Staying east: Hinterlands (Aerie Peak) or Searing Gorge (Thorium Point)'],
      travel: [],
    },
    horde: {
      primary: 'Tanaris from Gadgetzan, then Feralas from Camp Mojache.',
      hubs: ['Gadgetzan', 'Camp Mojache'],
      alternatives: ['Staying east: Hinterlands (Revantusk Village) or Searing Gorge (Thorium Point)'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Improved Judgement at 46-47 and Conviction from 48.',
      'Start building a tank set: Stamina, Defense and plate. Keep Spell Power pieces too, since they drive your threat.',
    ],
    dungeons: [
      { dungeon: 'zulfarrak', note: 'Quest-stacked from Gadgetzan.' },
      { dungeon: 'alcaz-prison', note: 'From 48, in Dustwallow Marsh.' },
    ],
    sources: ['16', '19'],
  },
  {
    id: 'lvl-50-54', min: 50, max: 54, title: 'Holy Wrath and the Plaguelands',
    alliance: {
      primary: 'Western Plaguelands from Chillwind Camp, or Un’Goro from Marshal’s Refuge then Felwood.',
      hubs: ['Chillwind Camp (Western Plaguelands)', 'Marshal’s Refuge', 'Talonbranch Glade (Felwood)'],
      alternatives: [],
      travel: ['Chillwind Camp is north of Hillsbrad’s Alterac foothills. Grab its flight path.'],
    },
    horde: {
      primary: 'Western Plaguelands from the Bulwark, or Un’Goro from Marshal’s Refuge then Felwood.',
      hubs: ['The Bulwark (Western Plaguelands)', 'Marshal’s Refuge', 'Bloodvenom Post (Felwood)'],
      alternatives: [],
      travel: ['The Bulwark is on the eastern edge of Tirisfal Glades.'],
    },
    raceBranches: [],
    plan: [
      'Holy Wrath at 50, plus new ranks of Consecration, Seal of Fury, Holy Shield and Lay on Hands.',
      'The Plaguelands are full of Undead: Exorcism and Holy Wrath make them the fastest Paladin zones in the game.',
      'Pursuit of Justice at 51-52 stacks with your Warhorse. Greater Blessing of Might at 52 and of Wisdom at 54 are for groups.',
    ],
    dungeons: [
      { dungeon: 'blackrock-depths', note: 'If you are near Blackrock Mountain with quests ready.' },
      { dungeon: 'alcaz-prison', note: 'In range to 53.' },
    ],
    sources: ['10', '15', '19'],
  },
  {
    id: 'lvl-55-57', min: 55, max: 57, title: 'Eastern Plaguelands, Winterspring or Hyjal',
    alliance: {
      primary: 'Eastern Plaguelands from Light’s Hope Chapel, or Winterspring from Everlook after Felwood.',
      hubs: ['Light’s Hope Chapel', 'Everlook'],
      alternatives: ['Mount Hyjal through Darkwhisper Gorge when the approach is comfortable'],
      travel: [],
    },
    horde: {
      primary: 'Eastern Plaguelands from Light’s Hope Chapel, or Winterspring from Everlook after Felwood.',
      hubs: ['Light’s Hope Chapel', 'Everlook'],
      alternatives: ['Mount Hyjal through Darkwhisper Gorge when the approach is comfortable'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Anticipation to 5/5 by 55 for Defense, then Toughness at 56-58.',
      'Mount Hyjal is a 55-60 zone. Darkwhisper Gorge on the way in is a level 60 area, so travel carefully.',
      'Start keeping crafted or dungeon tank pieces for 60 instead of vendoring them.',
    ],
    zoneNotes: ['Mount Hyjal: 55-60 (live Group Finder).'],
    dungeons: [
      { dungeon: 'blackmaw-hold', note: 'Azshara, from 55.' },
      { dungeon: 'stratholme', note: 'At the top of Eastern Plaguelands. Undead everywhere.' },
    ],
    notes: ['zone-ranges'],
    sources: ['15', '16', '23'],
  },
  {
    id: 'lvl-58-60', min: 58, max: 60, title: 'The finish',
    alliance: {
      primary: 'Finish in Eastern Plaguelands, Winterspring or Mount Hyjal. Pick the closest zone with quest clusters left.',
      hubs: ['Light’s Hope Chapel', 'Everlook'],
      alternatives: ['Silithus (Cenarion Hold) if you have a convenient flight path'],
      travel: [],
    },
    horde: {
      primary: 'Finish in Eastern Plaguelands, Winterspring or Mount Hyjal. Pick the closest zone with quest clusters left.',
      hubs: ['Light’s Hope Chapel', 'Everlook'],
      alternatives: ['Silithus (Cenarion Hold) if you have a convenient flight path'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Guardian’s Favor at 59-60 finishes the build at 0 / 39 / 12.',
      'At 60, train Greater Blessing of Kings and the final Holy Shield and Consecration ranks.',
      'Start your faction’s Onyxia chain and the Charger quest if you plan to raid.',
    ],
    dungeons: [
      { dungeon: 'shapers-terrace', note: 'The last new five-player leveling option.' },
      { dungeon: 'blackmaw-hold', note: 'In range to 60.' },
      { dungeon: 'stratholme', note: 'Also part of the Charger chain (Stratholme Holy Water).' },
    ],
    sources: ['15', '16', '17', '20'],
  },
];
