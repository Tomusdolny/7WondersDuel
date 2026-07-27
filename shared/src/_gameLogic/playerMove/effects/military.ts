import type { PlayerId, PlayerState } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { getProgressToken } from '../../building/catalog.js';
import { addCoins, findPlayers, withPlayers } from '../utility/players.js';
import { PLAYER_A_WIN, PLAYER_B_WIN } from '../../../militaryTokens/types.js';

/**
 * Przesuwa pionek o `shields` w stronę stolicy przeciwnika.
 * Zbiera żetony militarne po drodze; ewentualnie kończy grę.
 */
export function applyMilitaryShields(
  state: GameState,
  attackerId: PlayerId,
  shields: number,
): GameState {
  if (shields <= 0) return state;

  const found = findPlayers(state, attackerId);
  if (!found) return state;

  const { playerIndex } = found;
  const from = state.conflictPosition;
  const delta = playerIndex === 0 ? -shields : shields;
  const to = clamp(from + delta, PLAYER_A_WIN, PLAYER_B_WIN);

  let opponent = found.opponent;
  const remainingTokens = [];

  for (const token of state.militaryTokens) {
    if (tokenCrossed(from, to, token.position)) {
      opponent = addCoins(opponent, -token.coinsPenalty);
    } else {
      remainingTokens.push(token);
    }
  }

  let next: GameState = {
    ...withPlayers(state, found.player, opponent, playerIndex),
    conflictPosition: to,
    militaryTokens: remainingTokens,
  };

  if (playerIndex === 0 && to <= PLAYER_A_WIN) {
    next = {
      ...next,
      phase: { kind: 'ended', result: { kind: 'military', winnerId: attackerId } },
    };
  } else if (playerIndex === 1 && to >= PLAYER_B_WIN) {
    next = {
      ...next,
      phase: { kind: 'ended', result: { kind: 'military', winnerId: attackerId } },
    };
  }

  return next;
}

export function redShieldsWithStrategy(player: PlayerState, baseShields: number): number {
  return baseShields + (hasProgressEffect(player, 'extraShieldOnFutureMilitary') ? 1 : 0);
}

export function hasProgressEffect(
  player: PlayerState,
  kind:
    | 'extraShieldOnFutureMilitary'
    | 'extraTurnOnFutureWonders'
    | 'coinsOnChainBuild'
    | 'gainOpponentTradeSpend',
): boolean {
  for (const id of player.progressTokens) {
    const token = getProgressToken(id);
    if (!token) continue;
    if (token.effects.some((e) => e.kind === kind)) return true;
  }
  return false;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function tokenCrossed(from: number, to: number, tokenPos: number): boolean {
  if (to > from) return tokenPos > from && tokenPos <= to;
  if (to < from) return tokenPos < from && tokenPos >= to;
  return false;
}
