import type { ClassGuide } from './types.ts';
import { druid } from './classes/druid/index.ts';
import { paladin } from './classes/paladin/index.ts';

// Add a class: create src/data/classes/<id>/ with the same files as druid/,
// export a ClassGuide, and list it here. Pages are generated from this list.
export const classes: readonly ClassGuide[] = [druid, paladin];

/** The class the home page opens on. */
export const defaultClass: ClassGuide = druid;

export function getClass(id: string): ClassGuide {
  const found = classes.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown class: ${id}`);
  return found;
}
