import type { PlayerState } from '../../../state/player.js';
import type { WonderCard } from '../../../wonders/types.js';
import type { CoinCostBreakdown } from '../buildingCards/minCoinCostForCard.js';
import { minCoinsForResources, progressCostReduction } from '../resourcePayment.js';

/**
 * Minimalny koszt w monetach za zbudowanie cuda
 * (tylko handel zasobami; Architecture −2).
 */
export function minCoinCostForWonder(
  wonder: WonderCard,
  player: PlayerState,
  opponent: PlayerState,
): CoinCostBreakdown {
  const coins = minCoinsForResources(
    wonder.cost,
    player,
    opponent,
    progressCostReduction(player, 'wonder'),
    0,
  );
  return { coins, tradeCoins: coins };
}
