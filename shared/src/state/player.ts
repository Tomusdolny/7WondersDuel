import type { CardId } from '../ageCards/types.js';
import type { WonderId } from '../wonders/types.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { Resource } from '../resources.js';

export type PlayerId = string;
export type { ProgressTokenId };

export interface PlayerWonderSlot {
  wonderId: WonderId;
  built: boolean;
}

/**
 * Persystowany stan gracza.
 *
 * Świadomie NIE trzymamy tu:
 * - VP — wyliczane na koniec (budynki + cuda + Progress + militarne z toru + monety/3)
 * - zapasu surowców — produkcja jest ciągła z kart/cudów, nie „wydawana z magazynu”
 * - cen handlu — `2 + N` z brąz/szary przeciwnika + własne zniżki z żółtych
 * - listy efektów / symboli nauki / łańcuchów / tarcz — wynikają z buildings + wonders + progressTokens
 *
 * Tor konfliktu (pionek) należy do stanu gry, nie gracza.
 */
export interface PlayerState {
  id: PlayerId;
  /** Skarbiec; start = 7. */
  coins: number;
  /** Zbudowane budynki epok (kolejność = historia budowy). */
  buildings: CardId[];
  /** 4 cuda z draftu; `built` = zbudowany w trakcie gry. */
  wonders: PlayerWonderSlot[];
  /** Żetony Progress w posiadaniu. */
  progressTokens: ProgressTokenId[];
}

/**
 * Snapshot produkcji wyliczany z miasta (nie część stanu).
 * `fixed` — stała produkcja (brąz, szary).
 * `flexible` — źródła oneOf (Forum, Caravansery, Great Lighthouse, Piraeus);
 * przy płatności silnik przypisuje każdemu źródłu dokładnie 1 zasób z `oneOf`.
 *
 * Produkcja z cudów nie winduje kosztu handlu przeciwnika.
 */
export interface ProductionSnapshot {
  fixed: Partial<Record<Resource, number>>;
  flexible: ReadonlyArray<{
    sourceId: CardId | WonderId;
    oneOf: readonly Resource[];
  }>;
}

/** Zniżki handlowe wyliczane z żółtych kart (handel za 1 monetę). */
export type TradeDiscountSnapshot = Partial<Record<Resource, true>>;
