import type { Resource } from '../resources.js';

export type WonderId = string;

export const WONDERS_OFFERED_PER_ROUND = 4;

/** Runda 1: A→B→B→A. Runda 2: B→A→A→B. Indeks = kolejny pick w rundzie (0–3). */
export const ROUND_PICK_ORDER: Record<1 | 2, readonly (0 | 1)[]> = {
  1: [0, 1, 1, 0],
  2: [1, 0, 0, 1],
};

/**
 * Unikalna premia cuda (natychmiastowa lub pasywna).
 * Brak pola `effect` na karcie = cud bez premii (tylko VP / tarcze / extra turn).
 * Produkcja cudów nie wpływa na koszt handlu przeciwnika.
 */
export type WonderEffect =
  | { kind: 'coinsNow'; amount: number; opponentLose?: number }
  | { kind: 'discardOpponentCard'; color: 'brown' | 'grey' }
  | { kind: 'chooseProgressFromDiscarded'; draw: number; keep: number }
  | { kind: 'production'; oneOf: Resource[] }
  | { kind: 'constructFromDiscard' };

export interface WonderCard {
  id: WonderId;
  name: string;
  /** Cuda kosztują wyłącznie zasoby (bez monet). */
  cost: Partial<Record<Resource, number>>;
  effect?: WonderEffect;
  vp: number;
  shields?: number;
  extraTurn?: boolean;
}
