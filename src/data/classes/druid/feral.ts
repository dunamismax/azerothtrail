import type { SpecGuide } from '../../types.ts';
import { feralLeveling } from './talents.ts';

export const feral: SpecGuide = {
  slug: 'feral',
  name: 'Feral talents and play',
  nav: 'Feral',
  blurb: 'Point-by-point talents, Cat or Bear, solo pulls, dungeon packs, training on a budget.',
  lead: 'Level as Feral all the way to 60. Start in caster form, use Bear from 10, and do most solo quests in Cat from 20. Tank in Bear whenever a convenient group comes together.',
  build: feralLeveling,
  variant: {
    title: 'If tanking becomes your second job',
    body: 'Swap the five late Genesis points (56-60) for Natural Reaction in Feral for Bear dodge and rage. For a dedicated level-60 Bear build, start from Wowhead’s tank guide and decide how much Cat damage you want to keep.',
    swap: { from: 'genesis', to: 'natural-reaction', levels: [56, 60] },
    expected: { balance: 0, feral: 38, restoration: 13 },
    sources: ['11', '16'],
  },
  sections: [
    {
      id: 'cat-or-bear',
      title: 'Cat or Bear?',
      table: {
        head: ['Situation', 'Form', 'Why'],
        rows: [
          ['One ordinary quest mob', 'Cat', 'Fastest kill. Prowl past everything else.'],
          ['Two or more mobs, or a pull goes wrong', 'Bear', 'Swipe hits several targets. Cat has no area damage.'],
          ['Elite or hard-hitting mob', 'Bear', 'Armor and health. Build Lacerate stacks.'],
          ['Crowded area, need a tag', 'Caster or Bear', 'Moonfire or Faerie Fire tags at range.'],
          ['Five-player dungeon', 'Bear (tank) or Cat (DPS)', 'Shred from behind when someone else tanks.'],
        ],
      },
      sources: ['05'],
    },
    {
      id: 'cat-rotation',
      title: 'Cat for regular quest mobs',
      ordered: [
        'Keep Mark of the Wild and Thorns up.',
        'Open from Prowl if it saves travel, gets you behind the target, or sets up a useful opener: Ravage from 32, Shred before that.',
        'Use Rake when it isn’t ticking and the mob will live another 9 seconds.',
        'Spend 4-5 combo points on Rip when the target will live long enough.',
        'Use Claw face to face and Shred from behind.',
        'Use Ferocious Bite as a finishing hit or on bleed-immune targets. Skip the finisher if an auto-attack will do it.',
        'From 42, use Shifting Power below 50 Energy when your mana is comfortable.',
      ],
      notes: ['ravage-poised', 'predatory-discipline'],
      sources: ['05', '17'],
    },
    {
      id: 'bear-rotation',
      title: 'Bear for packs, elites and dungeon tanking',
      ordered: [
        'Before pulling, keep Mark of the Wild and Thorns up. Enrage out of combat if you need starting Rage.',
        'Pull with Faerie Fire (free in forms, 6 s cooldown), or use line of sight to bring casters to you.',
        'On packs, Swipe early and rotate targets.',
        'On sturdy targets, build Lacerate stacks. Use Primal Bite on cooldown once learned.',
        'Use Maul when you have Rage to spare. It replaces an auto-attack, so it costs more than it shows.',
        'Save Growl for a mob that leaves you, then follow with threat.',
        'Use Feral Charge or Bash to stop a cast.',
      ],
      sources: ['05', '02'],
    },
    {
      id: 'solo-pull',
      title: 'A solo pull',
      bullets: [
        'Heal between pulls, or root a mob to make room for a heal mid-fight.',
        'Pre-cast Regrowth before a tougher pull. Its HoT carries into combat.',
        'Keep enough mana to heal yourself and shift back.',
        'In Cat, run or Prowl while Energy refills. Drink when low.',
        'Potions and most consumables work without leaving form.',
      ],
      sources: ['05', '02'],
    },
    {
      id: 'dungeon-pack',
      title: 'A dungeon pack as Bear',
      bullets: [
        'Start with small pulls, mark a kill target and check your healer’s mana before every pull.',
        'Use Demoralizing Roar on harder melee packs.',
        'For dangerous pulls, plan Frenzied Regeneration (36) and use Barkskin (44) before the damage, not after.',
        'Challenging Roar (28) is your emergency answer when several mobs peel off at once.',
        'Bear threat was raised to 115% to make up for the removal of Blessing of Salvation.',
      ],
      sources: ['05', '03'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Early: Wrath while you still cast to kill, then Maul, Swipe, Faerie Fire and your main self-heals. Keep current ranks of Claw, Rip and Rake once you use Cat. Pick up Prowl and key control or recovery spells as they appear. Revive at 12 and Rebirth at 20 cover different jobs.',
        'Later: buy the important new ranks for your form and the heals you actually cast. Prioritize Travel Form, Dire Bear, Innervate and Barkskin. Pick up Lacerate ranks after taking the talent, and Primal Bite’s trainer ranks at 50 and 60. Delay unused offensive caster ranks (Wrath, Moonfire, Starfire, Hurricane) while Feral.',
      ],
      callout: 'Gold at 40: pay for your key skills and the Restoration slot if you want to practice healing straight away. Travel Form is a practical fallback if riding has to wait.',
      notes: ['training-cost'],
      sources: ['17', '03'],
    },
    {
      id: 'save-time',
      title: 'Save time between pulls',
      bullets: [
        'Keep Track Humanoids, Dash and Aquatic Form available when the route benefits.',
        'Log out at an inn for rested experience. Buy enough bag space to avoid frequent vendor trips.',
        'Cooking buffs add 5% experience from kills. Leatherworkers can place a Camp Tent once an hour.',
        'Gather quests before a dungeon: kill experience inside is low, and quests are where the experience is.',
      ],
      sources: ['05'],
    },
    {
      id: 'cat-gear',
      title: 'Cat and Bear gear',
      table: {
        head: ['Role', 'Look for', 'How to use it'],
        rows: [
          ['Cat questing', 'A strong weapon DPS upgrade first, then Agility and Strength. Stamina helps when mobs hit hard. Hit and Expertise once they appear near 60.', 'Form attacks use your equipped weapon’s DPS, and weapon speed doesn’t matter. Use a staff or mace you can equip; Classic stat sticks don’t apply.'],
          ['Bear tanking', 'Armor, Stamina and Agility for survival. Weapon DPS still matters for damage and threat. Expertise is extra valuable.', 'Keep a few sturdier pieces for your Bear swap. Build a proper tank set at 60 before harder runs.'],
        ],
      },
      sources: ['02', '05', '11'],
    },
  ],
};
