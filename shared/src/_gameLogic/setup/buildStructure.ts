import type { Age, CardId } from '../../ageCards/types.js';
import { STRUCTURE_SIZE } from '../../structure/layouts.js';
import type { Structure } from '../../structure/types.js';
import { applyInitialFaceUp } from './structureFaceUp.js';

/** Układa 20 kart w slotach 0–19 i ustawia face-up wg schematu ery. */
export function buildStructure(cardIds: readonly CardId[], age: Age): Structure {
  if (cardIds.length !== STRUCTURE_SIZE) {
    throw new Error(`structure needs ${STRUCTURE_SIZE} cards, got ${cardIds.length}`);
  }
  const slots = cardIds.map((cardId, index) => ({
    index,
    cardId,
    faceUp: false,
  }));
  return applyInitialFaceUp(slots, age);
}
