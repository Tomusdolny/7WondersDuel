import type { GameState, GameStateView } from '../state/game.js';
import type {
  FaceDownSlot,
  StructurePublic,
  StructureSlotPublic,
  TakenSlot,
} from '../structure/types.js';

/** Maskuje `cardId` na slotach face-down; reszta stanu bez zmian. */
export function toGameStateView(state: GameState): GameStateView {
  return {
    ...state,
    structure: toStructurePublic(state.structure),
  };
}

function toStructurePublic(structure: GameState['structure']): StructurePublic {
  return structure.map((slot): StructureSlotPublic | FaceDownSlot | TakenSlot => {
    if (slot === null) return null;
    if (slot.faceUp) {
      return { index: slot.index, cardId: slot.cardId, faceUp: true };
    }
    return { index: slot.index, faceUp: false };
  });
}
