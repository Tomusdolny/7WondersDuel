import { RESOURCES, type Resource } from '../../resources.js';
import type { PlayerState, ProductionSnapshot, TradeDiscountSnapshot } from '../../state/player.js';
import { getCard, getWonder } from './catalog.js';

/** Produkcja gracza z brązu/szarych + oneOf z żółtych i zbudowanych cudów. */
export function getProduction(player: PlayerState): ProductionSnapshot {
  const fixed: Partial<Record<Resource, number>> = {};
  const flexible: ProductionSnapshot['flexible'][number][] = [];

  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (!card) continue;

    if (card.color === 'brown' || card.color === 'grey') {
      for (const [resource, amount] of Object.entries(card.produces) as [Resource, number][]) {
        fixed[resource] = (fixed[resource] ?? 0) + amount;
      }
    } else if (card.color === 'yellow' && card.effect.kind === 'production') {
      flexible.push({ sourceId: card.id, oneOf: card.effect.oneOf });
    }
  }

  for (const slot of player.wonders) {
    if (!slot.built) continue;
    const wonder = getWonder(slot.wonderId);
    if (wonder?.effect?.kind === 'production') {
      flexible.push({ sourceId: wonder.id, oneOf: wonder.effect.oneOf });
    }
  }

  return { fixed, flexible };
}

/** Produkcja brąz/szary — tylko do windowania cen handlu przeciwnika. */
export function getBrownGreyProduction(player: PlayerState): Partial<Record<Resource, number>> {
  const fixed: Partial<Record<Resource, number>> = {};
  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (!card || (card.color !== 'brown' && card.color !== 'grey')) continue;
    for (const [resource, amount] of Object.entries(card.produces) as [Resource, number][]) {
      fixed[resource] = (fixed[resource] ?? 0) + amount;
    }
  }
  return fixed;
}

export function getTradeDiscounts(player: PlayerState): TradeDiscountSnapshot {
  const discounts: TradeDiscountSnapshot = {};
  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (!card || card.color !== 'yellow' || card.effect.kind !== 'tradeDiscount') continue;
    for (const resource of card.effect.resources) {
      discounts[resource] = true;
    }
  }
  return discounts;
}

/** Cena 1 jednostki zasobu z banku dla `player` vs produkcja brąz/szary przeciwnika. */
export function getTradePrices(
  player: PlayerState,
  opponent: PlayerState,
): Record<Resource, number> {
  const discounts = getTradeDiscounts(player);
  const opponentProd = getBrownGreyProduction(opponent);
  const prices = {} as Record<Resource, number>;
  for (const resource of RESOURCES) {
    if (discounts[resource]) {
      prices[resource] = 1;
    } else {
      prices[resource] = 2 + (opponentProd[resource] ?? 0);
    }
  }
  return prices;
}
