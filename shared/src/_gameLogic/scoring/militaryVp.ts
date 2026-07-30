import type { ConflictPosition } from '../../militaryTokens/types.js';
import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';

/**
 * VP z toru konfliktu (bez supremacji).
 * |pos|: 0–2 → 0, 3–5 → 2, 6–8 → 5, ≥9 → 10.
 * A atakuje w stronę ujemną → pos < 0 = przewaga A; pos > 0 = przewaga B.
 */
export function militaryVpFromPosition(position: ConflictPosition): number {
  const abs = Math.abs(position);
  if (abs <= 2) return 0;
  if (abs <= 5) return 2;
  if (abs <= 8) return 5;
  return 10;
}

/** VP militarne dla obu graczy (dokładnie jeden ma > 0, albo obaj 0). */
export function militaryVpByPlayer(
  state: Pick<GameState, 'players' | 'conflictPosition'>,
): Record<PlayerId, number> {
  const [playerA, playerB] = state.players;
  const vp = militaryVpFromPosition(state.conflictPosition);
  const scores: Record<PlayerId, number> = {
    [playerA.id]: 0,
    [playerB.id]: 0,
  };
  if (vp === 0) return scores;
  if (state.conflictPosition < 0) {
    scores[playerA.id] = vp;
  } else {
    scores[playerB.id] = vp;
  }
  return scores;
}
