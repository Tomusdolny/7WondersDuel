import type { Age } from '../../ageCards/types.js';
import type { GameState } from '../../state/game.js';
import type { PlayerId } from '../../state/player.js';
import type { Rng } from '../../_utility/rng.js';
import { buildStructure } from './buildStructure.js';
import { dealAgeCardIds } from './dealAgeCardIds.js';

/**
 * Setup ery: nowa piramida, `phase: playing`, wskazany starter.
 * Nie czyści discardu, miast, toru ani Progress.
 */
export function setupAge(
  state: GameState,
  age: Age,
  activePlayerId: PlayerId,
  rng: Rng,
): GameState {
  if (activePlayerId !== state.players[0].id && activePlayerId !== state.players[1].id) {
    throw new Error(`activePlayerId not in game: ${activePlayerId}`);
  }

  const cardIds = dealAgeCardIds(age, rng);
  const structure = buildStructure(cardIds, age);

  return {
    ...state,
    version: state.version + 1,
    age,
    activePlayerId,
    structure,
    phase: { kind: 'playing' },
  };
}
