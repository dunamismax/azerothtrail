import type { SpecGuide } from '../../types.ts';
import { retributionLeveling, shockadin, unsealedWrath } from './talents.ts';

// Retribution: Icy Veins' leveling guide [09] for the 10-60 order and the
// leveling play, its talent, rotation and stat pages [26][30][31] for 60.
export const retribution: SpecGuide = {
  slug: 'retribution',
  name: 'Retribution',
  role: 'melee',
  pitch: 'The fastest Paladin solo leveler. A slow two-hander, the right Seal and Holy Light with your spare mana.',
  lead: 'Level as Retribution with the biggest two-hander you can find. Keep a Seal up, press Judgement and Holy Strike on cooldown, and turn leftover mana into Holy Light instead of eating. Pursuit of Justice at 20-21 speeds up every trip to 60.',
  strengths: ['Good single-target damage and very efficient questing', 'Sturdy, with heals and several immunities to get out of trouble', 'Pursuit of Justice from 20 for faster travel', 'Strong two-handers from the level-20 class quests'],
  weaknesses: ['No interrupt against spellcasters', 'No slow for runners until Hammer of Wrath at 44', 'Few ways to tag mobs at range: Exorcism only hits Undead and Demons'],
  compare: { solo: 'Fastest on single mobs', groups: 'Melee damage', mana: 'Careful; spend the spare on Holy Light', endgame: 'Raid melee with Seal swapping' },
  build: retributionLeveling,
  endgameBuilds: [unsealedWrath, shockadin],
  dualSpec: [
    'Protection is the usual second spec: groups always want a tank, and Consecration, blocks and Retribution Aura handle packs that Retribution struggles with.',
    'Holy instead if you would rather heal. Healers find dungeon groups fastest.',
    'Keep your one-hander and shield, or your healing set, in their own bag, and make a second action bar layout.',
  ],
  notes: ['first-week-tuning', 'every-spec-levels', 'pursuit-level', 'removed-blessings'],
  sections: [
    {
      id: 'setup',
      title: 'Before every pull',
      bullets: [
        'Blessing of Might until 20, then Blessing of Kings. Recast it after Blessing of Freedom or Blessing of Protection.',
        'Devotion Aura while you solo, Retribution Aura from 16 when you fight several mobs or a tank needs help holding them.',
        'Seal of Righteousness until Seal of Command at 22. On a mob that will live a while, judge Seal of the Crusader first: the target takes more Holy damage.',
        'Righteous Fury and Seal of Fury are tank tools. Leave them off.',
      ],
      notes: ['removed-blessings'],
      sources: ['09'],
    },
    {
      id: 'rotation',
      title: 'The leveling rotation',
      lead: 'There isn’t much to track: a Seal, then Judgement and Holy Strike on cooldown. Skip a button when the next swing will kill.',
      ordered: [
        'Keep a Blessing and a Seal up at all times.',
        'Judge Seal of the Crusader on a mob that will live long enough, then switch to Seal of Command or Righteousness.',
        'Judgement and Holy Strike on cooldown. Judgement is off the global cooldown, so press it alongside Holy Strike.',
        'Consecration only with mana to spare and targets that will live its full 8 seconds.',
        'Exorcism on cooldown against Undead and Demons. It also tags them from 30 yards.',
        'From 44, Hammer of Wrath on anything under 20% health, especially a mob that runs.',
      ],
      bullets: [
        'Packs: the same loop, with Consecration doing more of the work. Holy Wrath (50) joins it against Undead and Demons.',
        'If a mob dies with mana to spare, spend it on Holy Light instead of eating.',
      ],
      sources: ['09'],
    },
    {
      id: 'seal-choice',
      title: 'Seal of Command or Righteousness',
      paragraphs: [
        'Seal of Command is designed to proc about 7 times a minute whatever your weapon speed, so a slow two-hander gets the most from it. That suits early leveling, when you replace weapons only every few levels.',
        'Seal of Righteousness has the better Spell Power scaling: about 12% of your Spell Power on every two-handed swing, against 20.3% for Seal of Command on its procs only. Once you have real Spell Power or a fast weapon, Righteousness wins. With Champion of the Light from 35, Intellect also adds Spell Power.',
        'Icy Veins suggests you may move the Seal of Command point elsewhere once Champion of the Light makes Spell Power your main stat.',
      ],
      sources: ['09'],
    },
    {
      id: 'repentance',
      title: 'Repentance and the Judgement macro',
      paragraphs: [
        'Repentance (33) incapacitates a Humanoid for up to 6 seconds. Use it on the second mob of a pull, or to make room for Holy Light.',
        'With Seal of Command up, Judgement hits harder on a stunned or incapacitated target. Judgement is off the global cooldown and doesn’t break Repentance when it lands in the same moment, so one macro can do both.',
      ],
      callout: 'Repentance and Judgement macro: #showtooltip Repentance / /cast Repentance / /cast Judgement',
      sources: ['09'],
    },
    {
      id: 'mana',
      title: 'Mana and staying alive',
      bullets: [
        'Don’t refresh your Seal until it is about to drop.',
        'Skip Judgement or Holy Strike when your next auto-attack will finish the mob.',
        'Consecration costs almost twice as much as Judgement and Holy Strike together, even with Holy Conduit.',
        'Carry water and upgrade it every ten levels. Healing and mana potions save lives on bad pulls.',
        'Blessing of Freedom with Pursuit of Justice gets you out of most trouble. Hammer of Justice buys a Holy Light.',
        'Divine Protection and Blessing of Protection give you a breather to heal or run. Lay on Hands heals you to full for all your remaining mana.',
      ],
      notes: ['lay-on-hands'],
      sources: ['09'],
    },
    {
      id: 'gear',
      title: 'Weapons and stats while leveling',
      table: {
        head: ['Slot or stat', 'Look for', 'Why'],
        rows: [
          ['Two-hander', 'Weapon DPS first. A slow weapon for Seal of Command, a fast one or one with an on-hit effect for Seal of Righteousness.', 'Weapon DPS drives your auto-attacks; swing speed decides the Seal.'],
          ['Early weapons', 'Ironforge Greathammer (Hall of Thanes, Alliance) or Axe of Orgrimmar (Ragefire Chasm, Horde), then Verigan’s Fist or Wolfsbane from 20.', 'Quest rewards you can plan around.'],
          ['Hit and Expertise', 'Take them whenever you see them', 'Rare on leveling gear, and they make every swing count.'],
          ['Spell Power', 'More valuable than it looks on a melee spec', 'Almost every ability scales with it. It can be worth wearing leather or cloth for it.'],
          ['Intellect', 'Mana, and Spell Power once Champion of the Light (35) is in', 'A bigger pool for Holy Light and Consecration.'],
          ['Strength, Agility, crit', 'Good on the same piece as the stats above', 'Strength and Attack Power drive auto-attacks, Seal of Command and Holy Strike.'],
        ],
      },
      bullets: ['Two-Handed Weapon Specialization cuts your threat by up to 20% with a two-hander. Good for damage, bad if you ever tank with one.'],
      sources: ['09', '13'],
    },
    {
      id: 'groups',
      title: 'In a dungeon group',
      bullets: [
        'Retribution Aura helps your tank hold threat on more targets, unless another Paladin already runs it.',
        'Hand out Blessing of Kings to everyone, and Wisdom to a healer short on mana.',
        'Keep Blessing of Protection for a healer or caster with aggro, and Divine Intervention for the healer when a wipe is certain.',
        'Purify poisons and diseases between your own buttons.',
      ],
      sources: ['09', '30'],
    },
    {
      id: 'gold-tight',
      title: 'What to train when gold is tight',
      paragraphs: [
        'Always buy new ranks of the Seal you use (Righteousness, or Command from 30), Holy Strike, Consecration, Exorcism, Holy Light, Flash of Light and Hammer of Wrath, and every defensive.',
        'Skip Seal of Fury and Righteous Fury unless you tank. Blessing of Might ranks only matter in a group without Kings; Seal of the Crusader ranks are optional.',
      ],
      notes: ['training-cost'],
      sources: ['15', '09'],
    },
  ],
  endgame: {
    lead: 'At 60, respec from the leveling build into Unsealed Wrath, the main Retribution raid build, or the Holy Shock based Shockadin. Both swap Seals and spend most of their time on mana management.',
    sections: [
      {
        id: 'which-build',
        title: 'Which level-60 build',
        paragraphs: [
          'Unsealed Wrath (12 / 8 / 31) goes deep into Retribution for its capstone, takes Divine Intellect and Precision in Protection, and Divine Strength, Improved Seals and Holy Conduit in Holy. It favors physical stats and a slow weapon.',
          'Shockadin (21 / 0 / 30) takes Holy Shock instead and leans on Spell Power and Seal of Righteousness. Both keep Champion of the Light.',
        ],
        sources: ['26'],
      },
      {
        id: 'unsealed-rotation',
        title: 'Unsealed Wrath rotation',
        lead: 'Every melee hit with a Seal up stores a stack of that Seal. Switch to the other Seal and your next swing fires the stored copies.',
        ordered: [
          'Judge Seal of the Crusader if the debuff is missing, then switch to Seal of Command.',
          'Slow weapon: switch to Seal of Righteousness at 3 stacks of Echo of Command, and back to Command at 1 or more Echo of Righteousness.',
          'Fast weapon: the other way round. Switch to Command at 3 stacks of Echo of Righteousness, and back to Righteousness at 1 or more Echo of Command.',
          'Hammer of Wrath on cooldown below 20% health.',
          'Consecration, Judgement and Holy Strike on cooldown.',
          'Exorcism on cooldown against Undead and Demons.',
        ],
        bullets: [
          'Against several Undead or Demons, Holy Wrath on cooldown. Only judge Seal of the Crusader on the main target.',
          'If someone else stuns the boss, delay Judgement a moment and land it with Seal of Command for double damage.',
          'A swing-timer addon makes the swaps much easier.',
        ],
        sources: ['30'],
      },
      {
        id: 'stats-60',
        title: 'Stats at 60',
        table: {
          head: ['Build', 'Priority'],
          rows: [
            ['Unsealed Wrath', 'Weapon damage > Hit to 8% > Expertise to 6.5% > Strength > Spell Power. Crit, Agility and Intellect after.'],
            ['Shockadin', 'Weapon DPS > Hit to 8% > Spell Power > Crit > Expertise to 6.5%. Intellect becomes Spell Power through Champion of the Light.'],
          ],
        },
        bullets: [
          'Seal of Command builds want slower weapons: it procs about 7 times a minute whatever the speed, so each slow swing carries more damage.',
          'A large amount of a lower stat can beat a little of a better one. Compare whole items.',
        ],
        sources: ['31'],
      },
      {
        id: 'mana-60',
        title: 'Mana in long fights',
        bullets: [
          'Reverence lets up to 30% of your regeneration continue while casting, and Sanctified Judgement refunds mana on each Judgement.',
          'Major Mana Potions and Dark Runes are your main refills.',
          'Running dry: switch to Seal of Wisdom for a while, and hold Consecration, your most expensive spell.',
        ],
        sources: ['30'],
      },
      {
        id: 'raid-utility',
        title: 'Raid utility',
        bullets: [
          'Divine Shield removes you from threat. Use it if a boss turns to you, or to ignore a mechanic that would cost melee time.',
          'Blessing of Protection on a healer with aggro gives the tank time to take it back.',
          'Lay on Hands can save a raid member, but its mana cost hurts the rest of the fight.',
          'Blessing of Freedom against roots and slows, and Purify for poisons and diseases.',
          'Raids open December 9: Barrow Deeps (10), Hyjal Summit (20) and Onyxia’s Lair (40). Onyxia needs the Drakefire Amulet from your faction’s Blackrock Spire chain.',
        ],
        sources: ['30', '17'],
      },
    ],
    checklist: {
      id: 'first-week',
      title: 'Your first week at 60',
      lead: 'Respec, find a slow two-hander and get your hit up.',
      items: [
        { id: 'respec', title: 'Respec into Unsealed Wrath', body: 'At a capital trainer. Keep the leveling build on the second slot only if you still solo a lot.' },
        { id: 'weapon', title: 'Upgrade your weapon', body: 'The single biggest damage upgrade. Slow for Seal of Command builds.' },
        { id: 'hit', title: 'Reach 8% hit', body: 'Then move Precision points elsewhere if gear covers it.' },
        { id: 'swing-timer', title: 'Install a swing timer', body: 'Seal swapping depends on it.' },
        { id: 'consumables', title: 'Stock up', body: 'Major Mana Potions, Dark Runes, food and Strength or Spell Power elixirs.' },
        { id: 'onyxia', title: 'Start the Onyxia chain', body: 'If you want to raid on December 9. Keep the Drakefire Amulet in your bags.' },
        { id: 'charger', title: 'Plan the Charger', body: 'Bank gold, Runecloth and Arcanite, and group up for Stratholme, Dire Maul and Scholomance.' },
      ],
      sources: ['26', '30', '31', '17', '20'],
    },
  },
};
