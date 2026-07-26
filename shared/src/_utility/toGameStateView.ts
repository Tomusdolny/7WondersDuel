import type { GameState, GameStateView } from '../state/game.js';
import type {
  FaceDownSlot,
  StructurePublic,
  StructureSlotPublic,
  TakenSlot,
} from '../structure/types.js';

/** Maskuje `cardId` na slotach face-down oraz niewyłożone cuda draftu (`remaining`). */
export function toGameStateView(state: GameState): GameStateView {
  const structure = toStructurePublic(state.structure);
  if (state.phase.kind !== 'wonderDraft') {
    return { ...state, structure };
  }
  return {
    ...state,
    structure,
    phase: { ...state.phase, remaining: [] },
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
