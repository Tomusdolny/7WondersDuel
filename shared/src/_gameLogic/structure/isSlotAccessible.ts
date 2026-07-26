import type { Age } from '../../ageCards/types.js';
import type { GameStateView } from '../../state/game.js';
import { COVERED_BY, STRUCTURE_SIZE } from '../../structure/layouts.js';
import type { StructurePublic } from '../../structure/types.js';

/**
 * Slot dostępny do wzięcia: istnieje, odkryty, nic go nie przykrywa.
 * Nie sprawdza tury gracza.
 */
export function isSlotAccessible(view: GameStateView, slotIndex: number): boolean {
  if (slotIndex < 0 || slotIndex >= STRUCTURE_SIZE) {
    return false;
  }
  return isSlotAccessibleInStructure(view.structure, view.age, slotIndex);
}

function isSlotAccessibleInStructure(
  structure: StructurePublic,
  age: Age,
  slotIndex: number,
): boolean {
  const slot = structure[slotIndex];
  if (slot === null || slot === undefined) return false;
  if (!slot.faceUp) return false;

  const coveredBy = COVERED_BY[age][slotIndex] ?? [];
  return coveredBy.every((coverIndex) => structure[coverIndex] === null);
}
