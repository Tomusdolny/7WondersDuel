import type { ScienceSymbol } from '../resources.js';

export type ProgressTokenId = string;

/**
 * Efekty żetonów postępu.
 * Część działa natychmiast przy zdobyciu, część pasywnie / na koniec gry.
 */
export type ProgressEffect =
  | { kind: 'coinsNow'; amount: number }
  | { kind: 'vp'; amount: number }
  | { kind: 'vpPerProgressToken'; amount: number }
  | { kind: 'science'; symbol: ScienceSymbol }
  | { kind: 'costReduction'; target: 'wonder' | 'blue'; resources: number }
  | { kind: 'gainOpponentTradeSpend' }
  | { kind: 'extraShieldOnFutureMilitary' }
  | { kind: 'extraTurnOnFutureWonders' }
  | { kind: 'coinsOnChainBuild'; amount: number };

export interface ProgressToken {
  id: ProgressTokenId;
  name: string;
  effects: readonly ProgressEffect[];
}
