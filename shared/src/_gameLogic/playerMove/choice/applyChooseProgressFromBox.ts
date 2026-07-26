import type { ProgressTokenId } from '../../../progressTokens/types.js';
import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { gainProgressToken } from '../effects/gainProgressToken.js';
import {
  clearPendingToPlaying,
  requirePendingChoice,
  resumeAfterChoice,
  toError,
} from '../utility/pendingChoice.js';
import { ok, type ApplyResult } from '../types.js';

/**
 * Great Library: wybór żetonu spośród wylosowanych z pudełka.
 * Wybrany trafia do gracza; niewybrane zostają w `progressInBox`.
 */
export function applyChooseProgressFromBox(
  state: GameState,
  playerId: PlayerId,
  tokenId: ProgressTokenId,
): ApplyResult {
  const pending = requirePendingChoice(state, playerId, 'chooseProgressFromBox');
  if ('error' in pending) return toError(pending);
  if (!pending.choice.options.includes(tokenId)) {
    return { ok: false, error: 'invalidChoice' };
  }
  if (!state.progressInBox.includes(tokenId)) {
    return { ok: false, error: 'invalidChoice' };
  }

  let next: GameState = {
    ...state,
    progressInBox: state.progressInBox.filter((id) => id !== tokenId),
  };

  const gained = gainProgressToken(next, playerId, tokenId);
  next = gained.state;
  if (gained.ended) return ok(next);

  next = clearPendingToPlaying(next);
  next = resumeAfterChoice(next, playerId, pending.keepTurn);
  return ok(next);
}
