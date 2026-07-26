import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';
import { toGameStateView } from '../../_utility/toGameStateView.js';
import { getDiscardCoins } from '../getDiscardCoins/getDiscardCoins.js';
import { isSlotAccessible } from '../structure/isSlotAccessible.js';
import { canPlayerAct } from './canPlayerAct.js';
import { passOrKeepTurn } from './passOrKeepTurn.js';
import { addCoins, findPlayers, withPlayers } from './players.js';
import { takeStructureSlot } from './takeStructureSlot.js';
import { err, ok, type ApplyResult } from './types.js';

/**
 * Odrzucenie karty ze struktury za monety.
 * Aktualizuje strukturę, discard, skarbiec; oddaje turę.
 */
export function applyDiscardCard(
  state: GameState,
  playerId: PlayerId,
  slotIndex: number,
): ApplyResult {
  if (state.phase.kind !== 'playing') return err('wrongPhase');
  if (!canPlayerAct(state, playerId)) return err('notYourTurn');

  const view = toGameStateView(state);
  if (!isSlotAccessible(view, slotIndex)) return err('slotInaccessible');

  const found = findPlayers(state, playerId);
  if (!found) return err('invalidPlayer');

  const taken = takeStructureSlot(state, slotIndex);
  const coinsGain = getDiscardCoins(found.player);
  const player = addCoins(found.player, coinsGain);

  let next: GameState = {
    ...withPlayers(taken.state, player, found.opponent, found.playerIndex),
    discard: [...taken.state.discard, taken.cardId],
  };
  next = passOrKeepTurn(next, playerId, false);
  return ok(next);
}
