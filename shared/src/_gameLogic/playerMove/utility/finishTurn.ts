import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { checkEndAge } from '../../setup/checkEndAge.js';
import { passOrKeepTurn } from './passOrKeepTurn.js';

/**
 * Po akcji tury (bez pending): ewentualny koniec ery, inaczej oddanie tury.
 */
export function finishTurn(
  state: GameState,
  actingPlayerId: PlayerId,
  keepTurn: boolean,
): GameState {
  if (state.phase.kind === 'ended') return state;
  if (state.phase.kind === 'awaitingEffectChoice') return state;

  const afterAge = checkEndAge(state, actingPlayerId);
  if (afterAge.phase.kind !== 'playing') return afterAge;
  return passOrKeepTurn(afterAge, actingPlayerId, keepTurn);
}
