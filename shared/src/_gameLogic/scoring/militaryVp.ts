import type { ConflictPosition } from '../../militaryTokens/types.js';
import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';

/**
 * VP z toru konfliktu (bez supremacji / pozycji stolicy).
 * |pos|: 0 → 0, 1–2 → 2, 3–5 → 5, 6–8 → 10; ≥9 = zwycięstwo militarne (0 VP tu).
 * Punkty dostaje najeźdźca (pos > 0 → A, pos < 0 → B).
 */
export function militaryVpFromPosition(position: ConflictPosition): number {
  const abs = Math.abs(position);
  if (abs === 0) return 0;
  if (abs <= 2) return 2;
  if (abs <= 5) return 5;
  if (abs <= 8) return 10;
  return 0;
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
