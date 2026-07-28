import type { GameState } from '../../../state/game.js';
import type { PlayerId } from '../../../state/player.js';
import { hasProgressEffect } from './military.js';
import { addCoins, findPlayers, withPlayers } from '../utility/players.js';

/**
 * Economy: przeciwnik budującego dostaje monety wydane na handel zasobami.
 * Nie dotyczy stałych monet z kosztu karty.
 */
export function applyEconomyFromTrade(
  state: GameState,
  builderId: PlayerId,
  tradeCoins: number,
): GameState {
  if (tradeCoins <= 0) return state;

  const found = findPlayers(state, builderId);
  if (!found) return state;
  if (!hasProgressEffect(found.opponent, 'gainOpponentTradeSpend')) return state;

  return withPlayers(
    state,
    found.player,
    addCoins(found.opponent, tradeCoins),
    found.playerIndex,
  );
}
