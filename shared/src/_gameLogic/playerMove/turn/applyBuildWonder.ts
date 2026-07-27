import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import type { WonderId } from '../../../wonders/types.js';
import { toGameStateView } from '../../../_utility/toGameStateView.js';
import { getWonderBuildCost } from '../../building/buildingWonders/getWonderBuildCost.js';
import { getWonder } from '../../building/catalog.js';
import { isSlotAccessible } from '../../utility/isSlotAccessible.js';
import { applyWonderBuiltEffects } from '../effects/applyWonderBuiltEffects.js';
import { canPlayerAct } from '../utility/canPlayerAct.js';
import { finishTurn } from '../utility/finishTurn.js';
import { addCoins, findPlayers, withPlayers } from '../utility/players.js';
import { takeStructureSlot } from '../utility/takeStructureSlot.js';
import { err, ok, type ApplyResult } from '../types.js';

/**
 * Budowa cuda: karta ze struktury idzie na discard jako podkład.
 * Efekty mogą ustawić `awaitingEffectChoice` lub zatrzymać turę (extraTurn).
 */
export function applyBuildWonder(
  state: GameState,
  playerId: PlayerId,
  slotIndex: number,
  wonderId: WonderId,
): ApplyResult {
  if (state.phase.kind !== 'playing') return err('wrongPhase');
  if (!canPlayerAct(state, playerId)) return err('notYourTurn');

  const view = toGameStateView(state);
  if (!isSlotAccessible(view, slotIndex)) return err('slotInaccessible');

  const costResult = getWonderBuildCost(view, playerId, wonderId);
  if (!costResult.ok) return err('wonderUnavailable');

  const found = findPlayers(state, playerId);
  if (!found) return err('invalidPlayer');
  if (found.player.coins < costResult.coins) return err('cannotAfford');

  const wonder = getWonder(wonderId);
  if (!wonder) return err('wonderUnavailable');

  const taken = takeStructureSlot(state, slotIndex);
  let player = addCoins(found.player, -costResult.coins);
  player = {
    ...player,
    wonders: player.wonders.map((w) => (w.wonderId === wonderId ? { ...w, built: true } : w)),
  };

  let next: GameState = {
    ...withPlayers(taken.state, player, found.opponent, found.playerIndex),
    discard: [...taken.state.discard, taken.cardId],
    wondersBuiltTotal: taken.state.wondersBuiltTotal + 1,
  };

  const effects = applyWonderBuiltEffects(next, playerId, wonder);
  next = effects.state;

  if (next.phase.kind !== 'ended' && !effects.pending) {
    next = finishTurn(next, playerId, effects.keepTurn);
  }

  return ok(next);
}
