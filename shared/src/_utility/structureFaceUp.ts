import type { Age } from '../ageCards/types.js';
import {
  COVERED_BY,
  COVERS,
  INITIAL_FACE_UP,
  STRUCTURE_SIZE,
} from '../structure/layouts.js';
import type { Structure, StructureSlot, TakenSlot } from '../structure/types.js';

/** Ustawia `faceUp` wg schematu ery (setup na początku Ery). */
export function applyInitialFaceUp(
  structure: readonly (StructureSlot | TakenSlot)[],
  age: Age,
): Structure {
  assertStructure(structure);
  if (age !== 1 && age !== 2 && age !== 3) {
    throw new Error(`age must be 1, 2 or 3, got ${age}`);
  }
  const faceUp = INITIAL_FACE_UP[age];

  return structure.map((slot, i) => {
    if (slot === null) throw new Error(`slot at index ${i} is null in applyInitialFaceUp`);
    return { ...slot, faceUp: faceUp[i]! };
  });
}

/**
 * Po zabraniu karty `takenIndex` (slot powinien być już `null`)
 * odkrywa do 2 kart, które ten slot przykrywał i które są teraz w pełni dostępne.
 */
export function revealAfterTake(
  structure: readonly (StructureSlot | TakenSlot)[],
  age: Age,
  takenIndex: number,
): Structure {
  assertStructure(structure);
  if (takenIndex < 0 || takenIndex >= STRUCTURE_SIZE) {
    throw new Error(`takenIndex out of range: ${takenIndex}`);
  }
  if (structure[takenIndex] !== null) {
    throw new Error(`structure[${takenIndex}] must be null before revealAfterTake`);
  }

  const candidates = COVERS[age][takenIndex] ?? [];
  if (candidates.length === 0) {
    return [...structure];
  }

  const coveredBy = COVERED_BY[age];
  const next: Structure = [...structure];

  for (const index of candidates) {
    const slot = next[index];
    if (slot == null || slot.faceUp) continue;

    const stillCovered = (coveredBy[index] ?? []).some((coverIndex) => next[coverIndex] !== null);
    if (!stillCovered) {
      next[index] = { index: slot.index, cardId: slot.cardId, faceUp: true };
    }
  }

  return next;
}

function assertStructure(structure: readonly (StructureSlot | TakenSlot)[]): void {
  if (structure.length !== STRUCTURE_SIZE) {
    throw new Error(`structure must have ${STRUCTURE_SIZE} slots, got ${structure.length}`);
  }
}
