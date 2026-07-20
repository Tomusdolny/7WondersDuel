import type { Resource } from '../resources';

export type WonderId = string;

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
