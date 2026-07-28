import type { CardId } from '../../../ageCards/types.js';
import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { getCard } from '../../building/catalog.js';
import {
  clearPendingToPlaying,
  requirePendingChoice,
  resumeAfterChoice,
  toError,
} from '../utility/pendingChoice.js';
import { findPlayers, withPlayers } from '../utility/players.js';
import { ok, type ApplyResult } from '../types.js';

/** Odrzucenie karty brązowej/szarej przeciwnika (Circus Maximus / Zeus). */
export function applyDiscardOpponentCard(
  state: GameState,
  playerId: PlayerId,
  cardId: CardId,
): ApplyResult {
  const pending = requirePendingChoice(state, playerId, 'discardOpponentCard');
  if ('error' in pending) return toError(pending);

  const found = findPlayers(state, playerId);
  if (!found) return { ok: false, error: 'invalidPlayer' };

  const card = getCard(cardId);
  if (!card || card.color !== pending.choice.color) {
    return { ok: false, error: 'invalidChoice' };
  }
  if (!found.opponent.buildings.includes(cardId)) {
    return { ok: false, error: 'invalidChoice' };
  }

  const opponent = {
    ...found.opponent,
    buildings: found.opponent.buildings.filter((id) => id !== cardId),
  };

  let next: GameState = {
    ...withPlayers(state, found.player, opponent, found.playerIndex),
    discard: [...state.discard, cardId],
  };

  next = clearPendingToPlaying(next);
  next = resumeAfterChoice(next, playerId, pending.keepTurn);
  return ok(next);
}
