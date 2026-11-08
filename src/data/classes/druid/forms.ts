import type { FormGuide } from '../../types.ts';

// Quest walkthroughs from Icy Veins [04] (updated Nov 4, 2026). `for` filters a
// step by faction or race id. Coordinates are (x, y) on the zone map.
export const forms: FormGuide[] = [
  {
    id: 'bear',
    name: 'Bear Form',
    level: 10,
    how: 'class quest',
    summary: 'Your tanking and multi-mob form. Do the quest the moment you hit 10.',
    useFor: ['Packs, elites and anything that hits hard', 'Five-player tanking', 'Two ordinary mobs at once from about 16'],
    keyAbilities: ['Maul (10)', 'Growl (10)', 'Demoralizing Roar (10)', 'Enrage (12)', 'Bash (14)', 'Swipe (16)', 'Faerie Fire (18)', 'Feral Charge (20, talent)', 'Lacerate (25, talent)', 'Frenzied Regeneration (36)'],
    quest: {
      name: 'Heeding the Call → Moonglade → Great Bear Spirit → Body and Heart',
      start: [
        { for: 'nightelf', text: 'Accept “Heeding the Call” from your Druid trainer. It sends you to Darnassus.' },
        { for: 'tauren', text: 'Accept “Heeding the Call” from your Druid trainer. It sends you to Thunder Bluff.' },
        { for: 'skyborne-high skyborne-wind', text: 'Talk to Urs’endris in the eastern part of Zephras Isle and accept “Strength and Mercy”. Your trainer points you there, but you can go straight to him.' },
      ],
      steps: [
        { for: 'nightelf tauren', text: 'In the city, pick up “Moonglade” and cast Teleport: Moonglade.' },
        { for: 'nightelf tauren', text: 'Accept “Great Bear Spirit” and speak to the Bear Spirit in the northeast of Moonglade.' },
        { for: 'nightelf', text: 'Accept “Body and Heart”. The spirit is in a cave east of Auberdine, Darkshore (42, 45). Pull one mob at a time and use Entangling Roots for breathing room.' },
        { for: 'tauren', text: 'Accept “Body and Heart”. The spirit is in a cave west of Camp Taurajo in the Barrens (42, 60). Pull one mob at a time and use Entangling Roots for breathing room.' },
        { for: 'skyborne-high skyborne-wind', text: 'Go to the marked cave in the middle of the island (53, 64). Approach from the north side: the southern side has no way in. Kill Ur’endra.' },
        { text: 'Turn in to learn Bear Form, then train Maul and Growl.' },
      ],
      travel: [
        { for: 'nightelf', text: 'From Moonglade, hearth if it is set to Darnassus or Dolanaar, or take the free Moonglade flight back.' },
        { for: 'tauren', text: 'Hearth back to Mulgore from Moonglade. Body and Heart fits your move into the Barrens.' },
        { for: 'skyborne-high skyborne-wind', text: 'No Moonglade trip. Skyborne is the fastest race to Bear Form.' },
      ],
    },
    sources: ['04'],
  },
  {
    id: 'aquatic',
    name: 'Aquatic Form',
    level: 16,
    how: 'class quest',
    summary: 'Fast swimming with no breath bar. Worth it if your route has coastal or underwater quests.',
    useFor: ['Underwater quest objectives', 'Crossing lakes and coastlines quickly'],
    keyAbilities: ['No combat abilities'],
    quest: {
      name: 'A Lesson to Learn → Trial of the Sea Lion',
      start: [
        { for: 'alliance', text: 'Your Druid trainer in Darnassus starts “A Lesson to Learn”.' },
        { for: 'horde', text: 'Your Druid trainer in Thunder Bluff starts “A Lesson to Learn”.' },
      ],
      steps: [
        { text: 'Cast Teleport: Moonglade and find Dendrite Starblaze.' },
        { text: 'Find the Bauble at the bottom of the big lake in central Moonglade. It can spawn in a few spots, so come up for air.' },
        { text: 'Bring it to the Shrine of Remulos in western Moonglade, then accept “Trial of the Sea Lion”.' },
        { for: 'alliance', text: 'Pendant half 1: northern Darkshore (49, 11), beside a pair of large rocks.' },
        { for: 'alliance', text: 'Pendant half 2: off the west coast of Westfall (18, 33), west of a broken ship. Watch for murlocs.' },
        { for: 'horde', text: 'Pendant half 1: a chest in the Sludge Fen pond, the Barrens (57, 8).' },
        { for: 'horde', text: 'Pendant half 2: far out in the sea west of Silverpine Forest (30, 29).' },
        { text: 'Return both halves to Moonglade as the quest log directs to learn Aquatic Form.' },
      ],
      travel: [
        { text: 'It’s a long chain. Start it at 16 and pick up each half when your route passes nearby, finishing around 18-20.' },
        { for: 'tauren skyborne-high skyborne-wind', text: 'Moonglade is far from your zones. Set your Hearthstone before teleporting.' },
      ],
    },
    sources: ['04', '05'],
  },
  {
    id: 'cat',
    name: 'Cat Form',
    level: 20,
    how: 'class quest',
    summary: 'Your main solo questing form from 20. Stealth, energy and combo points.',
    useFor: ['Single quest mobs', 'Prowling past extras', 'Group DPS from behind'],
    keyAbilities: ['Claw, Shred, Rip, Prowl (20)', 'Rake, Ferocious Bite (24)', 'Dash (26)', 'Ravage, Track Humanoids (32)', 'Pounce (36)', 'Shifting Power (42, talent)'],
    quest: {
      name: 'The Great Cat Spirit',
      start: [
        { text: 'Set your Hearthstone where you’re questing, then cast Teleport: Moonglade.' },
        { text: 'The quest giver is in southern Moonglade (44, 73). Accept “The Great Cat Spirit”.' },
      ],
      steps: [
        { text: 'Go to the Stormrage Barrow Dens in the east of Moonglade and recover all three relics inside.' },
        { text: 'Return to the quest giver to learn Cat Form.' },
        { text: 'Put Prowl, Claw and Rip on your Cat bar. Omen of Clarity is now a baseline passive at 20.' },
      ],
      travel: [
        { text: 'The quest is the same for every race. Hearth straight back afterwards.' },
      ],
    },
    sources: ['04'],
  },
  {
    id: 'travel',
    name: 'Travel Form',
    level: 30,
    how: 'trainer',
    summary: 'Outdoor running speed form. Your practical mount if riding has to wait.',
    useFor: ['Running between hubs', 'Escaping when a pull goes wrong outdoors'],
    keyAbilities: ['No combat abilities'],
    notes: ['No class quest in Forever: buy it from any Druid trainer at 30.', 'Prioritize it over most rank upgrades when gold is tight.'],
    sources: ['04', '17'],
  },
  {
    id: 'dire-bear',
    name: 'Dire Bear Form',
    level: 40,
    how: 'trainer',
    summary: 'The upgraded Bear Form. It replaces Bear Form on your bar once trained.',
    useFor: ['All Bear play from 40', 'Krol’dok Stronghold and later dungeons as tank'],
    keyAbilities: ['Primal Bite (40, talent)', 'Barkskin (44)', 'Lacerate ranks at 42, 50, 58'],
    notes: ['No class quest: train it at 40 alongside Innervate and dual spec.', 'Form attacks use your equipped weapon’s DPS, as in Bear and Cat.'],
    sources: ['02', '17'],
  },
];
