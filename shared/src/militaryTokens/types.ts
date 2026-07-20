/** Tor konfliktu: 0 = środek; ujemne = strona gracza A, dodatnie = gracza B. Stolice = ±9. */
export type ConflictPosition = number;  

/** Żeton lootu na torze (2 lub 5 monet); zdejmowany przy wejściu w strefę. */
export interface MilitaryToken {
  /** Pozycja absolutna na torze (np. 3, 6 po każdej stronie od środka). */
  position: ConflictPosition;
  coinsPenalty: 2 | 5;
}

export const PLAYER_A_WIN = -10;
export const PLAYER_B_WIN = 10;
export const MILITARY_TOKEN_CENTER = 0;