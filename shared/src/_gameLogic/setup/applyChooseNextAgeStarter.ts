import type { GameState } from '../../state/game.js';
import type { PlayerId } from '../../state/player.js';
import type { Rng } from '../../_utility/rng.js';
import type { ApplyResult } from '../playerMove/types.js';
import { err, ok } from '../playerMove/types.js';
import {
  requirePendingChoice,
  toError,
} from '../playerMove/utility/pendingChoice.js';
import { setupAge } from './setupAge.js';

/**
 * Wybór gracza rozpoczynającego kolejną erę (po `checkEndAge` w Ery I/II).
 * Buduje piramidę Ery II lub III przez `setupAge`.
 */
export function applyChooseNextAgeStarter(
  state: GameState,
  playerId: PlayerId,
  starterId: PlayerId,
  rng: Rng,
): ApplyResult {
  const pending = requirePendingChoice(state, playerId, 'chooseNextAgeStarter');
  if ('error' in pending) return toError(pending);
  if (pending.choice.chooserId !== playerId) return err('notYourTurn');

  if (starterId !== state.players[0].id && starterId !== state.players[1].id) {
    return err('invalidPlayer');
  }

  if (state.age !== 1 && state.age !== 2) {
    return err('wrongPhase');
  }

  const nextAge = state.age === 1 ? 2 : 3;
  return ok(setupAge(state, nextAge, starterId, rng));
}
