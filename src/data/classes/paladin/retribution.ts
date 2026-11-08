import type { SpecGuide } from '../../types.ts';
import { retributionSecond } from './talents.ts';

export const retribution: SpecGuide = {
  slug: 'retribution',
  name: 'Dual spec: Retribution for questing',
  nav: 'Retribution',
  blurb: 'Dual spec at 40, a Retribution questing build, when to swap, Seal of Command or Righteousness, and two-hander gear.',
  lead: 'Protection stays your main spec. At 40, put Retribution in the second slot for solo quests where lone mobs need to die fast, and swap back to Protection for packs, elites and every group.',
  build: retributionSecond,
  notes: ['mount-and-dual-spec'],
  sections: [
    {
      id: 'dual-spec',
      title: 'Dual spec at 40',
      bullets: [
        'Dual Specialization unlocks at 40 from a class trainer in a major city, where talent changes also happen.',
        'Mobalytics reports it costs 50 gold, and the Warhorse is free at 40, so most Paladins can afford it straight away.',
        'Keep Protection as your main spec. Put Retribution in the second slot.',
        'If you can’t afford it yet, stay Protection: it levels fine, just slower on single targets.',
        'Make a second action bar layout, and keep your two-hander and Retribution pieces in their own bag.',
      ],
      notes: ['mount-and-dual-spec'],
      sources: ['02', '10'],
    },
    {
      id: 'when-to-swap',
      title: 'Which spec for which job',
      table: {
        head: ['Situation', 'Spec', 'Why'],
        rows: [
          ['A quest that kills lone mobs', 'Retribution', 'Retribution kills single targets faster.'],
          ['Packs of three or four', 'Protection', 'Consecration, blocks and Retribution Aura are made for it.'],
          ['Elites and hard-hitting mobs', 'Protection', 'Templar’s Bulwark, blocks and damage reduction.'],
          ['Undead areas', 'Either', 'Exorcism works in both. Protection pulls more of them at once.'],
          ['Any dungeon', 'Protection', 'Groups want the tank, and you are one.'],
          ['Long travel days', 'Either', 'Both builds take Pursuit of Justice.'],
        ],
      },
      sources: ['10', '09'],
    },
    {
      id: 'ret-rotation',
      title: 'Retribution questing rotation',
      ordered: [
        'Blessing of Kings (Might before 20) and Devotion or Retribution Aura.',
        'Seal of Command, or Seal of Righteousness with a fast weapon or lots of Spell Power.',
        'Judgement and Holy Strike on cooldown.',
        'Consecration only if the targets will live the 8 seconds it needs, and you won’t have to move.',
        'Exorcism against Undead and Demons.',
        'Don’t refresh your Seal until it is about to drop, and skip Judgement or Holy Strike if your next swing kills the mob.',
        'If the mob dies with mana to spare, spend it on Holy Light instead of eating.',
      ],
      bullets: [
        'Repentance (33) incapacitates a Humanoid for 6 seconds, enough for a Holy Light. Judgement is off the global cooldown, so a macro that casts Repentance and Judgement together gets Seal of Command’s bonus damage without breaking it.',
        'Hammer of Justice, Blessing of Freedom and Pursuit of Justice get you out of trouble; Divine Protection and Lay on Hands save you.',
      ],
      sources: ['09'],
    },
    {
      id: 'seal-choice',
      title: 'Seal of Command or Righteousness',
      paragraphs: [
        'Seal of Command is designed to proc about 7 times a minute whatever your weapon speed, so a slow two-hander gets the most from it. That suits early leveling, when you replace weapons rarely.',
        'Seal of Righteousness has the better Spell Power scaling: about 12% of your Spell Power on every two-handed swing, against 20.3% for Seal of Command on its procs only. Once you have real Spell Power or a fast weapon, Righteousness wins. With Champion of the Light from 35, Intellect also adds Spell Power.',
        'Seal of the Crusader’s Judgement makes the target take more Holy damage, which helps a Seal of Command or Righteousness opener.',
      ],
      sources: ['09', '13'],
    },
    {
      id: 'ret-gear',
      title: 'Retribution gear',
      table: {
        head: ['Slot or stat', 'Look for', 'Why'],
        rows: [
          ['Two-hander', 'A slow weapon with high damage. Verigan’s Fist (Alliance) or Wolfsbane (Horde) from the level-20 chain.', 'Seal of Command and Holy Strike hit harder with a slow, heavy weapon.'],
          ['Stats', 'Strength and Attack Power, Stamina, Spell Power, Intellect, then armor', 'Spell Power still drives Seals, Judgement and Consecration.'],
          ['Your tank kit', 'Keep the one-hander and shield in your bags', 'Two-Handed Weapon Specialization cuts your threat by 20% with a two-hander, so never tank with one.'],
        ],
      },
      sources: ['09', '13', '10'],
    },
    {
      id: 'other-options',
      title: 'Other uses for the second slot',
      bullets: [
        'Holy: Blizzard describes Holy as the strongest single-target healer, with Light’s Vigil for group healing. Pick it if you want to heal dungeons as well as tank them.',
        'At 60, some players use the second slot for a dedicated raid or Holy Shock tank build instead. Your main leveling build already ends on a full tank build.',
      ],
      sources: ['02', '05'],
    },
  ],
};
