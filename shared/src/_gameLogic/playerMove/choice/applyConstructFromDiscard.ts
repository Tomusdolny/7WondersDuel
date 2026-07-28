import type { CardId } from '../../../ageCards/types.js';
import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { getCard } from '../../building/catalog.js';
import { applyCardBuiltEffects } from '../effects/applyCardBuiltEffects.js';
import {
  clearPendingToPlaying,
  requirePendingChoice,
  resumeAfterChoice,
  toError,
} from '../utility/pendingChoice.js';
import { findPlayers, withPlayers } from '../utility/players.js';
import { ok, type ApplyResult } from '../types.js';

/**
 * Mausoleum: darmowa budowa karty z discardu gry.
 * Może ustawić kolejny pending (np. para nauki).
 */
export function applyConstructFromDiscard(
  state: GameState,
  playerId: PlayerId,
  cardId: CardId,
): ApplyResult {
  const pending = requirePendingChoice(state, playerId, 'constructFromDiscard');
  if ('error' in pending) return toError(pending);

  if (!state.discard.includes(cardId)) {
    return { ok: false, error: 'invalidChoice' };
  }

  const card = getCard(cardId);
  if (!card) return { ok: false, error: 'invalidChoice' };

  const found = findPlayers(state, playerId);
  if (!found) return { ok: false, error: 'invalidPlayer' };

  const playerBefore = found.player;
  const player = {
    ...playerBefore,
    buildings: [...playerBefore.buildings, cardId],
  };

  let next: GameState = {
    ...withPlayers(state, player, found.opponent, found.playerIndex),
    discard: state.discard.filter((id) => id !== cardId),
  };

  const effects = applyCardBuiltEffects(
    next,
    playerId,
    card,
    playerBefore,
    false,
    pending.keepTurn,
  );
  next = effects.state;

  if (next.phase.kind === 'ended') return ok(next);

  if (effects.pending) {
    return ok(next);
  }

  next = clearPendingToPlaying(next);
  next = resumeAfterChoice(next, playerId, pending.keepTurn);
  return ok(next);
}
