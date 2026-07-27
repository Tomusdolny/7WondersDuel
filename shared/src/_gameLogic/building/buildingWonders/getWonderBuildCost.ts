import type { PlayerId } from '../../../state/player.js';
import type { GameStateView } from '../../../state/game.js';
import type { WonderId } from '../../../wonders/types.js';
import { getWonder } from '../catalog.js';
import { minCoinCostForWonder } from './minCoinCostForWonder.js';

export type BuildWonderResult =
  | { ok: false }
  | { ok: true; coins: number; tradeCoins: number };

/**
 * Minimalny koszt monet budowy cuda gracza.
 * Nie sprawdza tury ani skarbca — tylko czy cud jest do zbudowania
 * (posiadany, niezbudowany, limit 7 w partii) i koszt zasobów/handlu.
 */
export function getWonderBuildCost(
  view: GameStateView,
  playerId: PlayerId,
  wonderId: WonderId,
): BuildWonderResult {
  const player = view.players.find((p) => p.id === playerId);
  const opponent = view.players.find((p) => p.id !== playerId);
  if (!player || !opponent) {
    return { ok: false };
  }

  if (view.wondersBuiltTotal >= 7) {
    return { ok: false };
  }

  const slot = player.wonders.find((w) => w.wonderId === wonderId);
  if (!slot || slot.built) {
    return { ok: false };
  }

  const wonder = getWonder(wonderId);
  if (!wonder) {
    return { ok: false };
  }

  const cost = minCoinCostForWonder(wonder, player, opponent);
  return { ok: true, coins: cost.coins, tradeCoins: cost.tradeCoins };
}
