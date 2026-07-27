import type { Card } from '../../../ageCards/types.js';
import type { PlayerState } from '../../../state/player.js';
import { getCard } from '../catalog.js';
import { minCoinsForResources, progressCostReduction } from '../resourcePayment.js';

export type CoinCostBreakdown = {
  /** Łączna płatność (stałe monety + handel). */
  coins: number;
  /** Część zapłacona bankowi za brakujące zasoby (Economy). */
  tradeCoins: number;
};

/**
 * Minimalny koszt w monetach za zbudowanie karty ery
 * (stałe monety na karcie + optymalny handel), z łańcuchem i Masonry.
 */
export function minCoinCostForCard(
  card: Card,
  player: PlayerState,
  opponent: PlayerState,
): CoinCostBreakdown {
  if (card.chain && playerHasChain(player, card.chain)) {
    return { coins: 0, tradeCoins: 0 };
  }

  const fixed = card.cost.coins ?? 0;
  const coins = minCoinsForResources(
    card.cost.resources ?? {},
    player,
    opponent,
    resourceCostReductionForCard(player, card),
    fixed,
  );
  return { coins, tradeCoins: coins - fixed };
}

function playerHasChain(player: PlayerState, chain: NonNullable<Card['chain']>): boolean {
  for (const cardId of player.buildings) {
    const owned = getCard(cardId);
    if (owned?.chain === chain) return true;
  }
  return false;
}

/** Masonry: −2 dowolne zasoby przy budowie niebieskiej. */
function resourceCostReductionForCard(player: PlayerState, card: Card): number {
  if (card.color !== 'blue') return 0;
  return progressCostReduction(player, 'blue');
}
