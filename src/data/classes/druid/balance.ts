import type { SpecGuide } from '../../types.ts';
import { balanceDefault, balanceLeveling } from './talents.ts';

// Balance: Icy Veins' leveling guide [24] for the 10-60 order and leveling
// play, its talent, rotation and stat pages [25][26][27] for 60.
export const balance: SpecGuide = {
  slug: 'balance',
  name: 'Balance',
  role: 'ranged',
  pitch: 'A caster who tags mobs first, heals through anything and becomes a Moonkin. Slow at the very start, fun from about 25.',
  lead: 'Balance is a slow start: Wrath is weak until your spells rank up and you find Spell Power. From around 25, with Moonfire and Insect Swarm on everything and Wrath to finish, it becomes a fun, safe leveler. Eclipse at 45-47 brings Starfire into the rotation and Moonkin Form at 53 completes it.',
  strengths: ['Gets the first hit on mobs better than almost anyone', 'Plenty of healing makes you hard to kill', 'Crowd control for awkward pulls', 'Great mobility, especially with Travel Form from 30', 'Prowl to sneak in and out of trouble'],
  weaknesses: ['Very slow early levels', 'Spell pushback hurts before Nature’s Focus', 'Mana-hungry until late', 'Little area damage before Hurricane at 40'],
  compare: { solo: 'Slow start, solid from 25', groups: 'Ranged damage, crit aura', mana: 'Drink often; Moonglow and Reflection help', endgame: 'Ranged damage with DoTs and Eclipse' },
  build: balanceLeveling,
  endgameBuilds: [balanceDefault],
  dualSpec: [
    'Restoration is the natural second spec: you already wear caster gear, and healers find groups fastest.',
    'Feral instead if you want a tank slot, or a faster melee option for questing.',
    'Make a second action bar layout and keep your second set in its own bag.',
  ],
  notes: ['first-week-tuning', 'every-spec-levels', 'moonkin-level', 'legacy-talents'],
  sections: [
    {
      id: 'early-levels',
      title: 'The slow start',
      paragraphs: [
        'Improved Wrath comes first, but it isn’t an early-game powerhouse. Around 10, putting Moonfire on a mob and then auto-attacking in Bear Form can be as fast as casting Wrath. That flips as your spells rank up and your gear gains Spell Power.',
        'Pull one mob at a time until you are confident. Entangling Roots holds a second one that wanders in.',
      ],
      sources: ['24'],
    },
    {
      id: 'forms',
      title: 'Forms you will use',
      bullets: [
        'Moonkin Form (talent, 53 in this build): your main form once you have it. Much tougher, and a crit aura for the party.',
        'Bear Form (10): auto-attacks can rival Wrath at first. Not part of the rotation later.',
        'Cat Form (20): Prowl past packs you don’t need.',
        'Aquatic Form (16) underwater, Travel Form (30) outdoors.',
      ],
      notes: ['moonkin-level'],
      sources: ['24'],
    },
    {
      id: 'rotation',
      title: 'The leveling rotation',
      ordered: [
        'Mark of the Wild and Thorns on yourself at all times.',
        'Open with Moonfire if the area is crowded (it is instant, so you win the tag), Wrath otherwise for a free cast before the mob reaches you.',
        'Insect Swarm once you have it (33).',
        'Wrath as your filler.',
        'With 3/3 Eclipse (47), the filler becomes one Wrath, then two Starfires. Keep both damage-over-time spells up unless the mob is nearly dead.',
      ],
      bullets: [
        'Rejuvenation on yourself before the pull, Regrowth mid-fight if you need it. One of each is usually enough.',
        'Nature’s Grasp when you pull too many, or for a hard fight: it buys time for uninterrupted casts.',
      ],
      sources: ['24'],
    },
    {
      id: 'aoe',
      title: 'Several mobs at once',
      ordered: [
        'Moonfire and Insect Swarm on every mob you are fighting.',
        'From 40, Hurricane on 3 or more. Pair it with Barkskin (44) so pushback doesn’t cut it short.',
        'Before 40, Wrath until each mob is dead, refreshing DoTs on anything that will live long enough.',
      ],
      sources: ['24'],
    },
    {
      id: 'talent-notes',
      title: 'Why the talents go in this order',
      bullets: [
        'Nature’s Reach (23-24) comes early because its extra range wins tags in busy starting zones.',
        'Reflection (20-22) is optional early, but it cuts your downtime a lot.',
        'Vengeance needs crit you won’t have while leveling, so it waits until 59-60.',
        'Eclipse is what makes Starfire worth casting, which is why Starfire stays on the shelf until the mid-40s.',
      ],
      sources: ['24'],
    },
    {
      id: 'gear',
      title: 'Stats while leveling',
      table: {
        head: ['Stat', 'Why'],
        rows: [
          ['Spell Power', 'Your priority stat. Longer casts gain more from it.'],
          ['Intellect', 'A bigger mana pool and a little crit. Found on a lot of gear.'],
          ['Critical Strike', 'Crits on your spells and damage over time.'],
          ['Spirit', 'Regeneration when you haven’t cast for 5 seconds.'],
          ['MP5', 'Mana every 5 seconds, casting or not.'],
          ['Haste', 'Faster casts, but not faster DoT ticks. Rare.'],
        ],
      },
      bullets: ['You will replace items often. Do each dungeon once for its quests rather than farming one for a drop.'],
      sources: ['24'],
    },
    {
      id: 'save-time',
      title: 'Leveling tips',
      bullets: [
        'Keep several stacks of water. A better water appears roughly every five levels.',
        'Log out in an inn or a city for rested experience.',
        'Rest at campfires for the buffs other players leave there, once an hour.',
        'Grab the Cozy Sleeping Bag at 14 for a stacking experience buff.',
      ],
      sources: ['24'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Always buy new ranks of Wrath, Moonfire, Insect Swarm (from 30), Rejuvenation and Regrowth, plus Mark of the Wild and Thorns. Hurricane from 40. Starfire matters from about 50, once Eclipse makes you cast it.',
        'Skip the Cat and Bear attack ranks after the early levels: Claw, Rip, Rake, Shred, Ferocious Bite, Maul and Swipe.',
      ],
      notes: ['training-cost'],
      sources: ['17', '24'],
    },
  ],
  endgame: {
    lead: 'At 60, respec into the Eclipse and DoTs build. The Balance tree is full of small damage talents you have to take, so only about five points are really yours to place.',
    sections: [
      {
        id: 'which-build',
        title: 'The level-60 build',
        paragraphs: [
          'Eclipse and DoTs (41 / 0 / 10) takes every key talent: Moonkin Form, Eclipse, Insect Swarm, and the Wrath and Starfire cast-time cuts. The five Genesis points are the optional ones.',
        ],
        sources: ['25'],
      },
      {
        id: 'rotation-60',
        title: 'Rotation at 60',
        ordered: [
          'Cast Wrath at the end of the pull timer so it lands as the boss is pulled.',
          'Insect Swarm, then Moonfire. Keep both up all fight, without refreshing early.',
          'Wrath, then two Starfires. Each Wrath gives two Eclipse charges for faster Starfires.',
        ],
        bullets: [
          'Never cast Starfire without an Eclipse charge, and never cast Wrath when you are full on charges.',
          '2-4 targets: the single-target rotation with more DoT refreshing. 5 or more: Hurricane.',
          'Low on mana even with Major Mana Potions? Lean on Wrath outside Omen of Clarity procs, or keep Innervate for yourself, though your healers won’t thank you.',
        ],
        sources: ['26'],
      },
      {
        id: 'stats-60',
        title: 'Stats at 60',
        lead: 'Icy Veins calls this provisional until level-60 gear is known.',
        table: {
          head: ['Stat', 'Why'],
          rows: [
            ['Hit to 17%', 'A missed spell does no damage at all, and the chance to miss rises against higher-level targets such as bosses.'],
            ['Critical Strike', 'Crits on every spell and DoT, and Vengeance doubles the payoff.'],
            ['Spell Power', 'More damage on everything.'],
            ['Intellect', 'Mana to last the fight, and a little crit.'],
          ],
        },
        sources: ['27'],
      },
      {
        id: 'utility-60',
        title: 'Utility',
        bullets: [
          'Before every fight: Gift of the Wild on everyone, Thorns on the tanks.',
          'Innervate on a healer of your choice.',
          'Remove Curse and Abolish Poison when it matters.',
          'Rebirth, the only combat resurrection in Forever.',
          'Faerie Fire on the boss if you are the only Druid: it makes the target take more physical damage.',
          'Entangling Roots and Hibernate (Beasts and Dragonkin) for crowd control.',
          'Raids open December 9: Barrow Deeps (10), Hyjal Summit (20) and Onyxia’s Lair (40). Onyxia needs the Drakefire Amulet from your faction’s Blackrock Spire chain.',
        ],
        sources: ['26', '14'],
      },
    ],
    checklist: {
      id: 'first-week',
      title: 'Your first week at 60',
      lead: 'Respec, get your hit up and learn the Eclipse rhythm.',
      items: [
        { id: 'respec', title: 'Respec into Eclipse and DoTs', body: 'At a capital trainer. Restoration or Feral in the second slot.' },
        { id: 'hit', title: 'Chase hit', body: 'Up to 17%, the biggest gain on most early pieces.' },
        { id: 'swaps', title: 'Pick your flexible points', body: 'Genesis by default; Subtlety for threat, Reflection for mana.' },
        { id: 'list', title: 'List for a dungeon', body: 'Blackmaw Hold, Shaper’s Terrace, Blackrock Depths, Stratholme or Scholomance.' },
        { id: 'consumables', title: 'Stock up', body: 'Water and Major Mana Potions.' },
        { id: 'onyxia', title: 'Start the Onyxia chain', body: 'If you want to raid on December 9.' },
      ],
      sources: ['25', '26', '27', '14'],
    },
  },
};
