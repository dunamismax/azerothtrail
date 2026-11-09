import type { Bracket } from '../../types.ts';

// Bracket ranges are fixed and checked by scripts/verify-content.ts. Ids are stable link targets:
// /druid/route/#lvl-10-15. Hub names marked from [08] are Classic geography
// cross-checks; new-zone details come from [07], [09] and [10].
export const brackets: Bracket[] = [
  {
    id: 'lvl-1-9', min: 1, max: 9, title: 'Starting zones',
    alliance: {
      primary: 'Teldrassil: Shadowglen down to Dolanaar.',
      hubs: ['Shadowglen', 'Dolanaar'],
      alternatives: [],
      travel: ['Darnassus has your trainer. Rut’theran Village, below it, has the boat to Auberdine.'],
    },
    horde: {
      primary: 'Mulgore: Red Cloud Mesa down to Bloodhoof Village.',
      hubs: ['Camp Narache (Red Cloud Mesa)', 'Bloodhoof Village'],
      alternatives: [],
      travel: ['Thunder Bluff, north of Bloodhoof Village, has your trainer.'],
    },
    raceBranches: [
      { races: 'nightelf', title: 'Night Elf', steps: ['Follow the Alliance column through Teldrassil.'] },
      { races: 'tauren', title: 'Tauren', steps: ['Follow the Horde column through Mulgore.'] },
      { races: 'skyborne-high skyborne-wind', title: 'Skyborne', steps: [
        'Start on Zephras Isle (1-12). Quest there until about 12 before joining your faction’s route.',
        'Your Druid trainer on the island is Lotheluum Starbreeze.',
      ] },
    ],
    plan: [
      'Open with Wrath. Use Moonfire when the mob will live long enough, or when you need an instant tag.',
      'Heal between pulls rather than mid-fight, and favor one mob at a time.',
      'Train Rejuvenation at 4, Thorns at 6 and Entangling Roots at 8. Keep Mark of the Wild and Thorns on yourself.',
    ],
    specPlan: {
      balance: [
        'Every Druid plays as a caster until 10. Water is your best friend: drink after every few mobs.',
      ],
      feral: [
        'Every Druid plays as a caster until 10. Bear Form at 10 is where Feral starts to feel fast.',
      ],
      restoration: [
        'Every Druid plays as a caster until 10. Rejuvenate yourself before each pull so you rarely stop to heal.',
      ],
    },
    dungeons: [],
    sources: ['01', '05', '08', '13', '24', '28'],
  },
  {
    id: 'lvl-10-15', min: 10, max: 15, title: 'Bear Form and a first tank run',
    alliance: {
      primary: 'Finish nearby Teldrassil quests, then move to Auberdine in Darkshore.',
      hubs: ['Dolanaar', 'Auberdine'],
      alternatives: ['Westfall from Sentinel Hill'],
      travel: ['Boat from Rut’theran Village to Auberdine.'],
    },
    horde: {
      primary: 'Finish Mulgore, then head to the Crossroads in the Barrens.',
      hubs: ['Bloodhoof Village', 'The Crossroads'],
      alternatives: ['Add Ratchet quests when you are nearby'],
      travel: ['Take the road east out of Mulgore into the Barrens. Grab the Crossroads flight path.'],
    },
    raceBranches: [
      { races: 'nightelf', title: 'Night Elf', steps: ['Bear quest: trainer → Darnassus → Moonglade → “Body and Heart” east of Auberdine (42, 45). It lines up with your move to Darkshore.'] },
      { races: 'tauren', title: 'Tauren', steps: ['Bear quest: trainer → Thunder Bluff → Moonglade → “Body and Heart” west of Camp Taurajo (42, 60). It lines up with your move to the Barrens.'] },
      { races: 'skyborne-high skyborne-wind', title: 'Skyborne', steps: [
        'Take “Strength and Mercy” from Urs’endris (east Zephras Isle). Approach the quest cave (53, 64) from the north.',
        'Finish the island to about 12, then leave as the island’s quests direct.',
      ] },
      { races: 'skyborne-high', title: 'High Order Skyborne (Alliance)', uncertain: true, steps: [
        'Reported route: boat from the Valanaar dock to Dalaran, then the Stormwind portal.',
        'From Stormwind, Westfall is next door. For Darkshore, take the Menethil Harbor boat to Auberdine, or Teleport: Moonglade and fly to Rut’theran Village.',
      ] },
      { races: 'skyborne-wind', title: 'Windshaper Skyborne (Horde)', uncertain: true, steps: [
        'Reported route: boat from the Valanaar dock to Dalaran, then the Orgrimmar portal.',
        'From Orgrimmar, take the road south through Durotar to the Crossroads.',
      ] },
    ],
    plan: [
      'Do the Bear quest at 10. Train Maul and Growl, then Enrage at 12.',
      'Train Revive and Regrowth at 12, then Bash and Cure Poison at 14.',
    ],
    specPlan: {
      balance: [
        'Talent points 10-14 go into Improved Wrath, then Nature’s Focus from 15 so damage doesn’t push your casts back.',
        'Around 10, Moonfire then auto-attacking in Bear Form can kill as fast as Wrath. It changes as your spells rank up.',
      ],
      feral: [
        'Talent points 10-14 go into Ferocity for cheaper attacks; Feral Instinct starts at 15.',
        'Bear is your main form until Cat at 20: Maul, Swipe from 16, and heal between pulls.',
      ],
      restoration: [
        'Talent points 10-14 go into Improved Wrath, then Nature’s Focus from 15.',
        'Moonfire then Bear Form auto-attacks is fine at 10-15. Wrath takes over as your gear gains Spell Power.',
      ],
    },
    dungeons: [
      { dungeon: 'hall-of-thanes', note: 'Easier Alliance access. Level 16 is a comfortable first attempt.' },
      { dungeon: 'ruins-of-lordaeron', note: 'Easier Horde access. Level 16 is a comfortable first attempt.' },
    ],
    notes: ['skyborne-exit', 'lordaeron-quest'],
    sources: ['04', '05', '07', '08', '13', '22', '24', '28'],
  },
  {
    id: 'lvl-16-19', min: 16, max: 19, title: 'Swipe, Faerie Fire and Aquatic Form',
    alliance: {
      primary: 'Darkshore out of Auberdine.',
      hubs: ['Auberdine'],
      alternatives: ['Westfall and Sentinel Hill if the coast is crowded'],
      travel: ['Pick up every flight path you pass.'],
    },
    horde: {
      primary: 'The Barrens out of the Crossroads and Ratchet.',
      hubs: ['The Crossroads', 'Ratchet'],
      alternatives: ['Save the longer southern Barrens circuits for later'],
      travel: ['Pick up every flight path you pass.'],
    },
    raceBranches: [],
    plan: [
      'Swipe at 16 and Faerie Fire at 18.',
      'Start Aquatic Form at 16 and finish the travel-heavy steps when your route passes them.',
    ],
    specPlan: {
      balance: [
        'Nature’s Focus finishes at 19. Reflection at 20-22 lets mana regeneration continue while you cast.',
        'Pull one mob at a time. Entangling Roots holds a second one if you get unlucky.',
      ],
      feral: [
        'Feral Swiftness at 18-19 for Cat speed and Dodge, ready for Cat Form at 20.',
        'Once comfortable, try Bear on two ordinary mobs.',
      ],
      restoration: [
        'Nature’s Focus finishes at 19, then Reflection at 20-22 for mana.',
        'You can already heal a Deadmines or Wailing Caverns run with Rejuvenation, Regrowth and Healing Touch.',
      ],
    },
    dungeons: [
      { dungeon: 'deadmines', note: 'Optional toward the upper end. Easier Alliance access.' },
      { dungeon: 'wailing-caverns', note: 'Optional toward the upper end. Easier Horde access.' },
      { dungeon: 'hall-of-thanes', note: 'Still in range to 18.' },
      { dungeon: 'ruins-of-lordaeron', note: 'Still in range to 20.' },
    ],
    sources: ['04', '05', '08', '24', '28'],
  },
  {
    id: 'lvl-20-24', min: 20, max: 24, title: 'Cat Form',
    alliance: {
      primary: 'Ashenvale from Astranaar.',
      hubs: ['Astranaar'],
      alternatives: ['Eastern alternative: Redridge from Lakeshire into early Duskwood'],
      travel: ['Set your Hearthstone before the Cat Form trip to Moonglade.'],
    },
    horde: {
      primary: 'Stonetalon from Sun Rock Retreat, or Ashenvale from Splintertree Post.',
      hubs: ['Sun Rock Retreat', 'Splintertree Post'],
      alternatives: ['Finish Barrens quests that share a loop'],
      travel: ['Set your Hearthstone before the Cat Form trip to Moonglade.'],
    },
    raceBranches: [],
    plan: [
      'Do the Cat Form quest at 20. Omen of Clarity and Rebirth also arrive at 20.',
      'Train Rake, Ferocious Bite and Remove Curse at 24.',
    ],
    specPlan: {
      balance: [
        'Nature’s Reach at 23-24: more range to tag mobs first in crowded zones, and spell hit.',
        'Cat Form is still worth the quest for Prowl, to sneak past packs you don’t need.',
      ],
      feral: [
        'Cat Form at 20: Prowl past extras and use Cat on single mobs, Bear on packs.',
        'Feral Charge at 20, then Savage Fury and Sharpened Claws at 21-24 for more damage in both forms.',
      ],
      restoration: [
        'Nature’s Reach at 23-24 for range and hit.',
        'Cat Form is worth the quest for Prowl. You won’t fight in it.',
      ],
    },
    dungeons: [
      { dungeon: 'excavation-site', note: 'Optional from 24 if you are near the Wetlands.' },
    ],
    sources: ['04', '05', '08', '17', '24', '28'],
  },
  {
    id: 'lvl-25-29', min: 25, max: 29, title: 'Duskwood or the Wetlands',
    alliance: {
      primary: 'Duskwood from Darkshire, or Wetlands from Menethil Harbor.',
      hubs: ['Darkshire', 'Menethil Harbor'],
      alternatives: ['Finish Ashenvale if its quests are still good'],
      travel: ['Menethil Harbor connects to Auberdine by boat.'],
    },
    horde: {
      primary: 'Southern Barrens down to Freewind Post in Thousand Needles.',
      hubs: ['Camp Taurajo', 'Freewind Post'],
      alternatives: ['Tarren Mill in Hillsbrad if you are already east'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Train Dash at 26.',
    ],
    specPlan: {
      balance: [
        'Nature’s Majesty at 25-26 for crit, then Moonglow and Nature’s Splendor at 27-30 for cheaper, longer DoTs.',
        'Keep Moonfire on everything you fight and Wrath as your filler.',
      ],
      feral: [
        'Take Lacerate at 25 for sturdy targets, then Blood Frenzy at 26-27.',
        'Use Rake and Rip when the target has time for them to tick.',
      ],
      restoration: [
        'Nature’s Majesty at 25-26, then Moonglow and Nature’s Splendor.',
        'Optional: heal the Excavation Site or Blackfathom Deeps. Healers find groups fast.',
      ],
    },
    dungeons: [
      { dungeon: 'excavation-site', note: 'In range to 29.' },
      { dungeon: 'city-of-dalaran', note: 'Optional detour from 28 with an entry quest.' },
    ],
    sources: ['05', '07', '08', '24', '28'],
  },
  {
    id: 'lvl-30-35', min: 30, max: 35, title: 'Travel Form',
    alliance: {
      primary: 'Northern Stranglethorn from the Rebel Camp, or Arathi from Refuge Pointe.',
      hubs: ['Rebel Camp', 'Refuge Pointe'],
      alternatives: [],
      travel: [],
    },
    horde: {
      primary: 'Shimmering Flats in Thousand Needles, then northern Stranglethorn from Grom’gol or Arathi from Hammerfall.',
      hubs: ['Mirage Raceway (Shimmering Flats)', 'Grom’gol Base Camp', 'Hammerfall'],
      alternatives: [],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Train Travel Form at 30: your mount until riding.',
      'Ravage and Poised arrive at 32.',
    ],
    specPlan: {
      balance: [
        'Improved Moonfire at 31-32 and Insect Swarm at 33. Keep both DoTs up and fill with Wrath.',
        'Multi-target pulls get safer now: DoT everything, then Wrath one at a time.',
      ],
      feral: [
        'Leader of the Pack at 30, Natural Instinct at 31-32.',
        'Open from Prowl with Ravage from 32. Lacerate rank 2 at 34.',
      ],
      restoration: [
        'Genesis at 31-32, Insect Swarm at 33, then Naturalist from 34 and Bloom at 36.',
        'Tranquility at 30 is strong in dungeons, on a long cooldown.',
      ],
    },
    dungeons: [
      { dungeon: 'city-of-dalaran', note: 'Finish it here (28-33), or use a nearby Classic dungeon.' },
    ],
    notes: ['ravage-poised'],
    sources: ['05', '07', '08', '17', '24', '28'],
  },
  {
    id: 'lvl-36-40', min: 36, max: 40, title: 'Riverglades, Dire Bear and dual spec',
    alliance: {
      primary: 'Riverglades from Farholde Keep in the south of the zone.',
      hubs: ['Farholde Keep (flight point 60.6, 81.6)'],
      alternatives: ['Kalimdor: Desolace into Shen’dralas if the Valley of Bones chain is available'],
      travel: [
        'Road in from northern Redridge or southern Badlands.',
        'Boat from Steamwheedle Port, Tanaris (68.6, 23.0) to Powderfuse Port (80.6, 54.6).',
      ],
    },
    horde: {
      primary: 'Riverglades from Rog’mar in the center of the zone.',
      hubs: ['Rog’mar (flight point 59.6, 45.0)'],
      alternatives: ['Kalimdor: Desolace into Shen’dralas if the Valley of Bones chain is available'],
      travel: [
        'Road in from northern Redridge or southern Badlands.',
        'Boat from Steamwheedle Port, Tanaris (68.6, 23.0) to Powderfuse Port (80.6, 54.6).',
      ],
    },
    raceBranches: [],
    plan: [
      'Train Frenzied Regeneration at 36.',
      'At 40, visit a trainer for Dire Bear Form, Innervate, Hurricane and dual spec.',
    ],
    specPlan: {
      balance: [
        'Genesis at 34-39 with Nature’s Grace at 38. Naturalist starts at 40.',
        'Hurricane at 40 is your first real area spell: use it on 3 or more mobs, with Barkskin from 44 so pushback doesn’t stop it.',
      ],
      feral: [
        'Rend and Tear at 35-39, Primal Bite at 40.',
        'Dire Bear Form at 40 is a big tanking upgrade. Put Restoration or Balance in the second slot.',
      ],
      restoration: [
        'Naturalist finishes at 39, then Gift of Nature at 40 and Swiftmend at 41.',
        'Innervate at 40: use it on cooldown when you heal, and drink between packs.',
      ],
    },
    zoneNotes: ['Riverglades: 36-44 (Wowhead).', 'Shen’dralas: 38-43, player-recorded, and a shorter midlevel detour.'],
    dungeons: [
      { dungeon: 'drowned-city', note: 'Fits a Stranglethorn detour.' },
      { dungeon: 'kroldok-stronghold', note: 'From 40, in Riverglades.' },
    ],
    notes: ['zone-ranges'],
    sources: ['02', '05', '07', '09', '10', '24', '28'],
  },
  {
    id: 'lvl-41-45', min: 41, max: 45, title: 'Finish Riverglades, sail to Tanaris',
    alliance: {
      primary: 'Finish Riverglades, then sail from Powderfuse Port to Steamwheedle Port for Tanaris.',
      hubs: ['Farholde Keep', 'Powderfuse Port'],
      alternatives: ['Feralas if you are already in western Kalimdor'],
      travel: ['Steamwheedle Port is east of Gadgetzan.'],
    },
    horde: {
      primary: 'Finish Riverglades, then sail from Powderfuse Port to Steamwheedle Port for Tanaris.',
      hubs: ['Rog’mar', 'Powderfuse Port'],
      alternatives: ['Feralas if you are already in western Kalimdor'],
      travel: ['Steamwheedle Port is east of Gadgetzan.'],
    },
    raceBranches: [],
    plan: [
      'Train Barkskin at 44.',
      'Gather a group before the Blood Master’s Ring arena chain (65.6, 21.4). It has a small entry fee.',
    ],
    specPlan: {
      balance: [
        'Eclipse at 45-47 makes Starfire part of the rotation: one Wrath, then two Starfires.',
        'Before Eclipse, mostly ignore Starfire.',
      ],
      feral: [
        'Shifting Power at 41: use it under 50 Energy when your mana is comfortable.',
        'Heart of the Wild at 42-46.',
      ],
      restoration: [
        'Swiftmend at 41: Rejuvenation then Swiftmend on someone taking sudden damage. It is too efficient to save for emergencies.',
        'Gift of Nature finishes at 45; Nature’s Swiftness at 46.',
      ],
    },
    dungeons: [
      { dungeon: 'kroldok-stronghold', note: 'Tank it as Dire Bear, or make it your first Deep Resto run.' },
    ],
    sources: ['05', '07', '09', '24', '28'],
  },
  {
    id: 'lvl-46-49', min: 46, max: 49, title: 'Tanaris and Feralas',
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
      'Start keeping gear for your level-60 role instead of vendoring it.',
    ],
    specPlan: {
      balance: [
        'Moonfury from 48 for more Arcane and Nature damage.',
        'Watch for Hit on gear: missed spells cost Balance a lot.',
      ],
      feral: [
        'Naturalist at 47-51.',
        'Build a Bear set with Armor, Stamina and Agility if you tank, separate from your Cat gear.',
      ],
      restoration: [
        'Nature’s Swiftness at 46, then Living Spirit at 47-49.',
        'Heal Zul’Farrak with its Gadgetzan quests: a good, long practice run.',
      ],
    },
    dungeons: [
      { dungeon: 'zulfarrak', note: 'Quest-stacked, and a good healing practice session.' },
      { dungeon: 'alcaz-prison', note: 'From 48, if your group is headed to Dustwallow Marsh.' },
    ],
    sources: ['05', '07', '08', '24', '28'],
  },
  {
    id: 'lvl-50-54', min: 50, max: 54, title: 'Un’Goro, then Felwood or the Plaguelands',
    alliance: {
      primary: 'Un’Goro from Marshal’s Refuge, then Felwood for a Kalimdor finish or Western Plaguelands for an eastern one.',
      hubs: ['Marshal’s Refuge', 'Talonbranch Glade (Felwood)', 'Chillwind Camp (Western Plaguelands)'],
      alternatives: [],
      travel: [],
    },
    horde: {
      primary: 'Un’Goro from Marshal’s Refuge, then Felwood for a Kalimdor finish or Western Plaguelands for an eastern one.',
      hubs: ['Marshal’s Refuge', 'Bloodvenom Post (Felwood)', 'The Bulwark (Western Plaguelands)'],
      alternatives: [],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Gift of the Wild at 50.',
      'Start comparing gear for your 60 role.',
    ],
    specPlan: {
      balance: [
        'Moonkin Form at 53: armor, double Omen of Clarity procs and a crit aura for your party. Live in it from now on.',
        'Starfire rank 5 at 50 is worth buying now that Eclipse makes you cast it.',
      ],
      feral: [
        'Primal Bite and Lacerate get new ranks at 50. Genesis from 52 also boosts your bleeds.',
        'Heart of the Wild and Naturalist are done; the rest are passive damage points.',
      ],
      restoration: [
        'Improved Rejuvenation at 50-52, then Improved Regrowth from 53.',
        'Keep healing pieces with Healing Power, Intellect and Spirit instead of vendoring them.',
      ],
    },
    dungeons: [
      { dungeon: 'blackrock-depths', note: 'Fits if you are already in the eastern zones and have quests ready.' },
      { dungeon: 'alcaz-prison', note: 'In range to 53.' },
    ],
    sources: ['05', '08', '17', '24', '28'],
  },
  {
    id: 'lvl-55-57', min: 55, max: 57, title: 'Winterspring, the Plaguelands and Hyjal',
    alliance: {
      primary: 'Winterspring from Everlook after Felwood, or Western to Eastern Plaguelands if you stayed east.',
      hubs: ['Everlook', 'Light’s Hope Chapel'],
      alternatives: ['Mount Hyjal through Darkwhisper Gorge when the approach is comfortable'],
      travel: [],
    },
    horde: {
      primary: 'Winterspring from Everlook after Felwood, or Western to Eastern Plaguelands if you stayed east.',
      hubs: ['Everlook', 'Light’s Hope Chapel'],
      alternatives: ['Mount Hyjal through Darkwhisper Gorge when the approach is comfortable'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Mount Hyjal is a 55-60 zone. Darkwhisper Gorge on the way in is a level 60 area, so travel carefully.',
    ],
    specPlan: {
      balance: [
        'Improved Starfire at 54-58 shortens Starfire further.',
        'Keep Innervate for a healer in groups; take it yourself only when you are short.',
      ],
      feral: [
        'Genesis finishes at 56.',
        'Tank a Blackmaw Hold or Stratholme run to test your Bear set before 60.',
      ],
      restoration: [
        'Improved Regrowth finishes at 57. Heal Blackmaw Hold in Azshara when a group forms on your route.',
      ],
    },
    zoneNotes: ['Mount Hyjal: 55-60 (live Group Finder).'],
    dungeons: [
      { dungeon: 'blackmaw-hold', note: 'Heal a run in Azshara.' },
      { dungeon: 'blackrock-depths', note: 'Or another Classic high-level dungeon near your route.' },
    ],
    notes: ['zone-ranges'],
    sources: ['05', '07', '10', '24', '28'],
  },
  {
    id: 'lvl-58-60', min: 58, max: 60, title: 'The finish',
    alliance: {
      primary: 'Finish in Mount Hyjal, Winterspring or Eastern Plaguelands. Pick the closest zone with quest clusters left.',
      hubs: ['Everlook', 'Light’s Hope Chapel'],
      alternatives: ['Silithus (Cenarion Hold) if you have a convenient flight path'],
      travel: [],
    },
    horde: {
      primary: 'Finish in Mount Hyjal, Winterspring or Eastern Plaguelands. Pick the closest zone with quest clusters left.',
      hubs: ['Everlook', 'Light’s Hope Chapel'],
      alternatives: ['Silithus (Cenarion Hold) if you have a convenient flight path'],
      travel: [],
    },
    raceBranches: [],
    plan: [
      'Start your faction’s Onyxia chain if you plan to raid.',
    ],
    specPlan: {
      balance: [
        'Vengeance at 59-60 finishes the build at 38 / 0 / 13. Respec into the 41 / 0 / 10 Eclipse build for groups and raids.',
      ],
      feral: [
        'Nature’s Reach and Nature’s Majesty at 57-60 finish the build at 9 / 32 / 10. Respec into Hybrid, Bear or Cat at 60 depending on your role.',
        'Primal Bite reaches rank 3 at 60.',
      ],
      restoration: [
        'Wild Growth at 58: buy rank 2 straight away, then rank 3 at 60. Genesis at 59-60 finishes the build at 18 / 0 / 33.',
        'At 60, respec into the default build: same split, but Heart of the Wild instead of Nature’s Focus and one Moonglow point moved to Genesis.',
      ],
    },
    dungeons: [
      { dungeon: 'shapers-terrace', note: 'The last new five-player leveling option.' },
      { dungeon: 'blackmaw-hold', note: 'In range to 60.' },
    ],
    sources: ['05', '07', '14', '24', '28'],
  },
];
