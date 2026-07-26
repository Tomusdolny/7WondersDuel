import {
  ALL_CARDS,
  WONDER_CARDS,
  PROGRESS_TOKENS,
  type Card,
  type CardId,
  type Cost,
  type Resource,
  type WonderCard,
  type WonderId,
  type ProgressToken,
  type ProgressTokenId,
} from '@7ww/shared';

export function findCard(cardId: CardId): Card | undefined {
  return ALL_CARDS.find((card) => card.id === cardId);
}

export function findWonder(wonderId: WonderId): WonderCard | undefined {
  return WONDER_CARDS.find((wonder) => wonder.id === wonderId);
}

export function findProgressToken(
  tokenId: ProgressTokenId,
): ProgressToken | undefined {
  return PROGRESS_TOKENS.find((token) => token.id === tokenId);
}

export function formatResourceCost(
  cost: Partial<Record<Resource, number>>,
): string {
  const parts = Object.entries(cost)
    .filter(([, amount]) => amount)
    .map(([resource, amount]) => `${amount} ${resource}`);
  return parts.length > 0 ? parts.join(', ') : 'brak';
}

export function formatCardCost(cost: Cost): string {
  const parts: string[] = [];
  if (cost.coins) {
    parts.push(`${cost.coins} monet`);
  }
  if (cost.resources) {
    const resourceCost = formatResourceCost(cost.resources);
    if (resourceCost !== 'brak') {
      parts.push(resourceCost);
    }
  }
  return parts.length > 0 ? parts.join(', ') : 'darmowa';
}
