import type { CardId } from '../../ageCards/types.js';
import type { GameState } from '../../state/game.js';
import { revealAfterTake } from '../structure/structureFaceUp.js';

/** Usuwa kartę ze slotu i odkrywa przykryte; zwraca cardId. */
export function takeStructureSlot(
  state: GameState,
  slotIndex: number,
): { state: GameState; cardId: CardId } {
  const slot = state.structure[slotIndex];
  if (slot == null) {
    throw new Error(`takeStructureSlot: empty slot ${slotIndex}`);
  }

  const cleared = state.structure.map((s, i) => (i === slotIndex ? null : s));
  const structure = revealAfterTake(cleared, state.age, slotIndex);

  return {
    cardId: slot.cardId,
    state: { ...state, structure },
  };
}
