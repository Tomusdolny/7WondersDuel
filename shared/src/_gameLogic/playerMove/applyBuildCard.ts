import type { ChainSymbol } from '../../ageCards/types.js';
import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';
import { toGameStateView } from '../../_utility/toGameStateView.js';
import { getStructureCardBuildCost } from '../building/buildingCards/getStructureCardBuildCost.js';
import { getCard } from '../building/catalog.js';
import { isSlotAccessible } from '../structure/isSlotAccessible.js';
import { applyCardBuiltEffects } from './applyCardBuiltEffects.js';
import { canPlayerAct } from './canPlayerAct.js';
import { passOrKeepTurn } from './passOrKeepTurn.js';
import { addCoins, findPlayers, withPlayers } from './players.js';
import { takeStructureSlot } from './takeStructureSlot.js';
import { err, ok, type ApplyResult } from './types.js';

/**
 * Budowa karty ze struktury.
 * Płatność, miasto, efekty (w tym pending / supremacje); oddanie tury gdy brak wyboru.
 */
export function applyBuildCard(
  state: GameState,
  playerId: PlayerId,
  slotIndex: number,
): ApplyResult {
  if (state.phase.kind !== 'playing') return err('wrongPhase');
  if (!canPlayerAct(state, playerId)) return err('notYourTurn');

  const view = toGameStateView(state);
  if (!isSlotAccessible(view, slotIndex)) return err('slotInaccessible');

  const costResult = getStructureCardBuildCost(view, playerId, slotIndex);
  if (!costResult.ok) return err('slotInaccessible');

  const found = findPlayers(state, playerId);
  if (!found) return err('invalidPlayer');
  if (found.player.coins < costResult.coins) return err('cannotAfford');

  const slot = state.structure[slotIndex];
  if (slot == null || !slot.faceUp) return err('slotInaccessible');
  const card = getCard(slot.cardId);
  if (!card) return err('slotInaccessible');

  const builtViaChain =
    costResult.coins === 0 && card.chain != null && playerHadChain(found.player, card.chain);

  const taken = takeStructureSlot(state, slotIndex);
  const playerBefore = found.player;
  let player = addCoins(playerBefore, -costResult.coins);
  player = { ...player, buildings: [...player.buildings, taken.cardId] };

  let next = withPlayers(taken.state, player, found.opponent, found.playerIndex);
  const effects = applyCardBuiltEffects(next, playerId, card, playerBefore, builtViaChain);
  next = effects.state;

  if (next.phase.kind !== 'ended' && !effects.pending) {
    next = passOrKeepTurn(next, playerId, false);
  }

  return ok(next);
}

function playerHadChain(player: { buildings: readonly string[] }, chain: ChainSymbol): boolean {
  for (const cardId of player.buildings) {
    const owned = getCard(cardId);
    if (owned?.chain === chain) return true;
  }
  return false;
}
