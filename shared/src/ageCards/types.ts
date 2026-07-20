import type { Resource, ScienceSymbol } from '../resources.js';

export type CardColor = 'brown' | 'grey' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

/**
 * Symbole łańcuchów (free construction).
 * Celowo inne niż Resource i ScienceSymbol.
 * Wszystkie karty w jednym łańcuchu dzielą ten sam symbol;
 * posiadanie dowolnej karty z symbolem pozwala zbudować każdą kolejną w tym łańcuchu za darmo (w tym skip A→C).
 */
export type ChainSymbol =
  | 'mask' // Theater → Statue → Gardens
  | 'moon' // Altar → Temple → Pantheon
  | 'drop' // Baths → Aqueduct
  | 'amphora' // Tavern → Lighthouse
  | 'barrel' // Brewery → Arena
  | 'horseshoe' // Stable → Horse Breeders
  | 'sword' // Garrison → Barracks
  | 'tower' // Palisade → Fortifications
  | 'target' // Archery Range → Siege Workshop
  | 'helmet' // Parade Ground → Circus
  | 'book' // Scriptorium → Library
  | 'gear' // Pharmacist → Dispensary
  | 'harp' // School → University
  | 'lamp' // Laboratory → Observatory
  | 'column'; // Rostrum → Senate

export type Age = 1 | 2 | 3;

export type CardId = string;

/** Brak pól = karta darmowa. */
export interface Cost {
  coins?: number;
  resources?: Partial<Record<Resource, number>>;
}

interface CardBase {
  id: CardId;
  name: string;
  age: Age;
  cost: Cost;
  /** Symbol łańcucha; brak pola = karta poza łańcuchem. */
  chain?: ChainSymbol;
}

/**
 * Efekty żółtych kart wykluczają się wzajemnie,
 * dlatego są unią z dyskryminatorem `kind`, a nie zbiorem pól opcjonalnych.
 */
export type YellowEffect =
  | { kind: 'production'; oneOf: Resource[] }
  | { kind: 'tradeDiscount'; resources: Resource[] }
  | { kind: 'coinsNow'; amount: number }
  | { kind: 'coinsPer'; per: CardColor | 'wonder'; amount: number };

/**
 * Punktacja gildii: monety przy budowie i VP na koniec gry
 * liczone wg miasta z największą liczbą danego kryterium.
 */
export type GuildScoring =
  | { kind: 'perCard'; colors: CardColor[]; coinsOnBuild: number; vpPerCard: number }
  | { kind: 'perWonder'; vpPerWonder: number }
  | { kind: 'perTreasuryCoins'; coinsPerVp: number };

export type BrownCard = CardBase & {
  color: 'brown';
  produces: Partial<Record<Resource, number>>;
};

export type GreyCard = CardBase & {
  color: 'grey';
  produces: Partial<Record<Resource, number>>;
};

export type BlueCard = CardBase & {
  color: 'blue';
  vp: number;
};

export type GreenCard = CardBase & {
  color: 'green';
  vp: number;
  science: ScienceSymbol;
};

export type YellowCard = CardBase & {
  color: 'yellow';
  vp?: number;
  effect: YellowEffect;
};

export type RedCard = CardBase & {
  color: 'red';
  shields: number;
};

export type PurpleCard = CardBase & {
  color: 'purple';
  scoring: GuildScoring;
};

export type Card =
  | BrownCard
  | GreyCard
  | BlueCard
  | GreenCard
  | YellowCard
  | RedCard
  | PurpleCard;
