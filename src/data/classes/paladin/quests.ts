import type { FormGuide } from '../../types.ts';

// Paladin class quests. Names, levels and starting points come from Forever
// guides [08][10][13]; the step-by-step detail is the Classic chain [20],
// which the note `class-quest-steps` flags. `for` filters a step by faction or
// race id. Coordinates are (x, y) on the zone map.
export const quests: FormGuide[] = [
  {
    id: 'redemption',
    name: 'Redemption',
    level: 12,
    how: 'class quest',
    summary: 'Your out-of-combat resurrection. Do it before your first dungeon: a group expects the Paladin to bring people back.',
    useFor: ['Resurrecting party members after a wipe', 'Saving everyone a corpse run, which matters more with Divine Intervention from 30'],
    keyAbilities: ['Redemption (12)', 'New ranks at 24, 36, 48 and 60'],
    quest: {
      name: 'The Tome of Divinity',
      start: [
        { for: 'human', text: 'At 12, your Paladin trainer (Brother Wilhelm in Goldshire) sends you to Duthorian Rall in the Cathedral of Light, Stormwind.' },
        { for: 'dwarf', text: 'At 12, your trainer sends you to Tiza Battleforge in the Hall of Mysteries, Ironforge.' },
        { for: 'undead', text: 'At 12, take “A Lesson in Divinity” from your trainer. It runs around Tirisfal Glades and ends with Redemption.' },
      ],
      steps: [
        { for: 'human', text: 'Bring 10 Linen Cloth to Stephanie Turner in Stormwind, then return to Duthorian Rall for the Symbol of Life.' },
        { for: 'human', text: 'Ride to Heroes’ Vigil in Elwynn Forest and use the Symbol of Life on Henze Faulk.' },
        { for: 'human', text: 'Henze asks for an item from the Defias Rogue Wizards in Elwynn. It only drops while you have the quest.' },
        { for: 'dwarf', text: 'Bring 10 Linen Cloth to John Turner in the Commons, take the Symbol of Life to Narm Faulk at Helm’s Bed Lake (Dun Morogh), then kill Dark Iron Spies for his item.' },
        { for: 'undead', text: 'Follow the quest log around Tirisfal Glades. Forever guides don’t list the steps yet.' },
        { text: 'Return to the capital and learn Redemption.' },
      ],
      travel: [
        { for: 'human', text: 'Carry 10 Linen Cloth from your first humanoid kills so you don’t have to come back for it.' },
        { for: 'human dwarf', text: 'Fits a capital visit for training at 12. Set your Hearthstone in Goldshire or Kharanos first.' },
      ],
    },
    notes: ['If an NPC or step differs from this list, follow the quest log: the steps are from the Classic chain.'],
    sources: ['08', '13', '20'],
  },
  {
    id: 'tome-of-valor',
    name: 'Tome of Valor',
    level: 20,
    how: 'class quest',
    summary: 'An Alliance chain that ends with a shield. For a Protection Paladin that is the reward that matters at 20.',
    useFor: ['A shield upgrade right as Consecration arrives', 'An excuse to finish Westfall’s coast'],
    keyAbilities: ['Bastion of Stormwind (shield, Classic reward)'],
    quest: {
      name: 'The Tome of Valor → Daphne Stilwell',
      start: [
        { for: 'alliance', text: 'At 20, your Paladin trainer in Stormwind or Ironforge offers the Tome of Valor and sends you to Duthorian Rall.' },
        { for: 'horde', text: 'Alliance only. Horde Paladins have their own level-20 chain (see Verigan’s Fist below).' },
      ],
      steps: [
        { for: 'alliance', text: 'Travel to Daphne Stilwell’s house on the Westfall coast (Longshore) and defend it against waves of Defias.' },
        { for: 'alliance', text: 'Pull the waves to the doorway one at a time, drop Consecration, and heal Daphne and yourself between waves.' },
        { for: 'alliance', text: 'Return to Duthorian Rall in Stormwind for the shield.' },
      ],
      travel: [
        { for: 'alliance', text: 'Do it when you come back through Westfall for the Deadmines, so one trip covers both.' },
      ],
    },
    notes: ['Forever guides list the Tome of Valor as a level-20 reward but not its item, so the shield named here is the Classic reward.'],
    sources: ['13', '20'],
  },
  {
    id: 'verigans-fist',
    name: 'Verigan’s Fist',
    level: 20,
    how: 'class quest',
    summary: 'A long chain through four dungeons for one of the best two-handers of its level. Optional for a Protection leveler, worth it if you’ll quest as Retribution.',
    useFor: ['Your Retribution second spec from 40', 'Solo questing with a two-hander before then, if you prefer'],
    keyAbilities: ['Verigan’s Fist (two-handed mace, Alliance)', 'Wolfsbane (Horde)'],
    quest: {
      name: 'The Test of Righteousness',
      start: [
        { for: 'alliance', text: 'Talk to Jordan Stilwell just outside the gates of Ironforge (52, 36). He needs four items.' },
        { for: 'horde', text: 'Horde Paladins get Wolfsbane from the “Old Fire-Eye” chain instead. Forever guides name it but don’t describe it yet.' },
      ],
      steps: [
        { for: 'alliance', text: 'Whitestone Oak Lumber: from the Goblin Woodcarvers in the Mast Room of the Deadmines, near Sneed.' },
        { for: 'alliance', text: 'Jordan’s Refined Ore Shipment: take “Bailor’s Ore Shipment” from Bailor Stonehand in Thelsamar, open the crate by the trees in Mo’grosh Stronghold (northeast Loch Modan), and hand it back to Bailor.' },
        { for: 'alliance', text: 'Jordan’s Smithing Hammer: on a box in the stables of Shadowfang Keep’s courtyard, before the ramp.' },
        { for: 'alliance', text: 'Purified Kor Gem: take “Seeking the Kor Gem” from Thundris Windweaver in Auberdine, take the Corrupted Kor Gem from the naga outside Blackfathom Deeps, and bring it back to Thundris.' },
        { for: 'alliance', text: 'Bring all four to Jordan Stilwell and he forges Verigan’s Fist.' },
      ],
      travel: [
        { for: 'alliance', text: 'Icy Veins says it is hard before 22. Collect the pieces as your route passes each dungeon instead of making special trips.' },
        { for: 'alliance', text: 'Shadowfang Keep is in Silverpine Forest, deep in Horde land. Go with a group that already has SFK quests.' },
      ],
    },
    sources: ['08', '09', '10', '20'],
  },
  {
    id: 'divine-storm',
    name: 'Cloak of the Divine Storm',
    level: 22,
    how: 'class quest',
    summary: 'New in Forever: a Paladin cloak at the end of a travel-heavy chain. Strong for its level, but you will replace it.',
    useFor: ['A strong cloak from 22 into your 30s'],
    keyAbilities: ['Cloak of the Divine Storm (Alliance)'],
    quest: {
      name: 'A Strange Artifact',
      start: [
        { for: 'alliance', text: 'Climb the Tower of Althalaxx in northern Darkshore (56.2, 26.4) and click the Althalaxx Orb.' },
        { for: 'horde', text: 'Our sources list the cloak for Alliance Paladins only.' },
      ],
      steps: [
        { for: 'alliance', text: 'The chain sends you to Ashenvale, Stormwind, Redridge Mountains and back to Ashenvale. Follow the quest log.' },
      ],
      travel: [
        { for: 'alliance', text: 'Set your Hearthstone in Astranaar before the Eastern Kingdoms steps so you can hearth straight back.' },
        { for: 'alliance', text: 'A Human route stays east for most of the 20s. Take it on only if you are going to Darkshore or Ashenvale anyway, for example for Blackfathom Deeps.' },
      ],
    },
    sources: ['08', '10'],
  },
  {
    id: 'warhorse',
    name: 'Summon Warhorse',
    level: 40,
    how: 'trainer',
    summary: 'Your free level-40 mount, plus plate armor and dual spec, all from the trainer in your capital.',
    useFor: ['Riding from 40 without buying a mount', 'Pairs with Pursuit of Justice at 51-52 for even more speed'],
    keyAbilities: ['Summon Warhorse (40)', 'Plate Mail (40)', 'Dual Specialization (40)'],
    notes: [
      'Mobalytics reports the Warhorse is free at the Paladin trainer in your main city. Don’t buy a horse from the vendor the riding NPC points you to.',
      'Dual spec is reported at 50 gold, which the free mount makes affordable at 40.',
      'Start wearing plate as soon as you find pieces, and keep an eye on Blacksmithing plate.',
    ],
    sources: ['10', '15', '11', '02'],
  },
  {
    id: 'charger',
    name: 'Summon Charger',
    level: 60,
    how: 'class quest',
    summary: 'The epic Paladin mount. A long, expensive chain through several level-60 dungeons; plan it with your guild.',
    useFor: ['Epic mounted speed without buying an epic mount'],
    keyAbilities: ['Summon Charger (Alliance)', 'Summon Forsaken Charger (Horde)'],
    quest: {
      name: 'Summoning the Charger',
      start: [
        { for: 'alliance', text: 'Lord Grayson Shadowbreaker in Stormwind starts two independent parts, the Censer and the Barding.' },
        { for: 'horde', text: 'Undead Paladins have their own chain for the Forsaken Charger. Follow your trainer’s quest at 60.' },
      ],
      steps: [
        { for: 'alliance', text: 'Censer: buy back High Priest Rohan’s censer in Ironforge (150 gold), return it, then use it in Terrordale (Eastern Plaguelands) and kill 25 Terrordale Spirits.' },
        { for: 'alliance', text: 'Barding: Grimand Elmore in Ironforge’s Dwarven District wants 150 gold, 6 Arcanite Bars, 5 Stratholme Holy Water, 40 Runecloth and 10 Arthas’ Tears.' },
        { for: 'alliance', text: 'Then Merideth Carlson in Southshore wants 50 gold and 20 Enriched Manna Biscuits (Argent Dawn quartermaster, Friendly), and you free an equine spirit by killing Tendris Warpwood in Dire Maul.' },
        { for: 'alliance', text: 'Scryer: an Azerothian Diamond and a Pristine Black Diamond, then a five-player Scholomance run to Rattlegore and the final summoning. A wipe sends you back for a new Scryer.' },
      ],
      travel: [
        { for: 'alliance', text: 'Start banking Runecloth, Arcanite and gold in your 50s. Stratholme and Scholomance runs double as gear runs for your tank set.' },
      ],
    },
    notes: ['These are the Classic steps. Forever guides confirm a level-60 epic mount quest, not its details.'],
    sources: ['08', '13', '20'],
  },
];
