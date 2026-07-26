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

/** Wybór żetonu Progress z planszy (para symboli nauki). */
export function applyChooseProgressToken(
  state: GameState,
  playerId: PlayerId,
  tokenId: ProgressTokenId,
): ApplyResult {
  const pending = requirePendingChoice(state, playerId, 'chooseProgressToken');
  if ('error' in pending) return toError(pending);
  if (!pending.choice.options.includes(tokenId)) {
    return { ok: false, error: 'invalidChoice' };
  }
  if (!state.progressOnBoard.includes(tokenId)) {
    return { ok: false, error: 'invalidChoice' };
  }

  let next: GameState = {
    ...state,
    progressOnBoard: state.progressOnBoard.filter((id) => id !== tokenId),
  };

  const gained = gainProgressToken(next, playerId, tokenId);
  next = gained.state;
  if (gained.ended) return ok(next);

  next = clearPendingToPlaying(next);
  next = resumeAfterChoice(next, playerId, pending.keepTurn);
  return ok(next);
}
