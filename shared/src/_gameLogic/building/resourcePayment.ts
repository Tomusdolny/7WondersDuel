import { RESOURCES, type Resource } from '../../resources.js';
import type { PlayerState, ProductionSnapshot } from '../../state/player.js';
import { getProgressToken } from './catalog.js';
import { getProduction, getTradePrices } from './production.js';

/** Minimalny koszt monet: stałe monety + handel po redukcji zasobów (Masonry/Architecture). */
export function minCoinsForResources(
  resourceCost: Partial<Record<Resource, number>>,
  player: PlayerState,
  opponent: PlayerState,
  reduction: number,
  coinsFixed: number,
): number {
  const production = getProduction(player);
  const prices = getTradePrices(player, opponent);

  if (reduction <= 0) {
    return coinsFixed + minTradeCoins(resourceCost, production, prices);
  }

  let best = Infinity;
  for (const reduced of enumerateResourceReductions(resourceCost, reduction)) {
    const trade = minTradeCoins(reduced, production, prices);
    if (trade < best) best = trade;
  }
  return coinsFixed + best;
}

export function progressCostReduction(player: PlayerState, target: 'blue' | 'wonder'): number {
  for (const tokenId of player.progressTokens) {
    const token = getProgressToken(tokenId);
    if (!token) continue;
    for (const effect of token.effects) {
      if (effect.kind === 'costReduction' && effect.target === target) {
        return effect.resources;
      }
    }
  }
  return 0;
}

function cloneCost(resources: Partial<Record<Resource, number>>): Partial<Record<Resource, number>> {
  const out: Partial<Record<Resource, number>> = {};
  for (const r of RESOURCES) {
    const n = resources[r];
    if (n && n > 0) out[r] = n;
  }
  return out;
}

/** Wszystkie sposoby odjęcia łącznie do `reduceBy` jednostek z kosztu zasobów. */
function enumerateResourceReductions(
  resources: Partial<Record<Resource, number>>,
  reduceBy: number,
): Partial<Record<Resource, number>>[] {
  const base = cloneCost(resources);
  const results: Partial<Record<Resource, number>>[] = [];

  function dfs(remaining: number, fromIndex: number, current: Partial<Record<Resource, number>>) {
    if (remaining === 0) {
      results.push(cloneCost(current));
      return;
    }

    let canReduce = false;
    for (let i = fromIndex; i < RESOURCES.length; i++) {
      const r = RESOURCES[i]!;
      const have = current[r] ?? 0;
      if (have <= 0) continue;
      canReduce = true;
      current[r] = have - 1;
      if (current[r] === 0) delete current[r];
      dfs(remaining - 1, i, current);
      current[r] = (current[r] ?? 0) + 1;
    }

    if (!canReduce) {
      results.push(cloneCost(current));
    }
  }

  dfs(reduceBy, 0, { ...base });
  return results.length > 0 ? results : [base];
}

function minTradeCoins(
  needed: Partial<Record<Resource, number>>,
  production: ProductionSnapshot,
  prices: Record<Resource, number>,
): number {
  const remaining: Record<Resource, number> = {
    wood: 0,
    stone: 0,
    clay: 0,
    glass: 0,
    papyrus: 0,
  };
  for (const r of RESOURCES) {
    remaining[r] = Math.max(0, (needed[r] ?? 0) - (production.fixed[r] ?? 0));
  }

  let best = Infinity;

  function tradeSum(): number {
    let sum = 0;
    for (const r of RESOURCES) {
      sum += remaining[r]! * prices[r]!;
    }
    return sum;
  }

  function dfs(flexIndex: number) {
    if (flexIndex === production.flexible.length) {
      const sum = tradeSum();
      if (sum < best) best = sum;
      return;
    }

    const source = production.flexible[flexIndex]!;
    for (const r of source.oneOf) {
      if (remaining[r]! > 0) {
        remaining[r]!--;
        dfs(flexIndex + 1);
        remaining[r]!++;
      }
    }
    dfs(flexIndex + 1);
  }

  dfs(0);
  return best;
}
