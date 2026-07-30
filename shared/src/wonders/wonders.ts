import type { WonderCard } from './types.js';

export const WONDER_CARDS = [
  {
    id: 'the-appian-way',
    name: 'The Appian Way',
    cost: { stone: 2, clay: 2, papyrus: 1 },
    effect: { kind: 'coinsNow', amount: 3, opponentLose: 3 },
    vp: 3,
    extraTurn: true,
    description:
      'Otrzymujesz 3 monety z banku. Twój przeciwnik oddaje 3 monety do banku. Natychmiast rozegraj jeszcze jedną turę. Ten Cud jest wart 3 punkty.',
  },
  {
    id: 'circus-maximus',
    name: 'Circus Maximus',
    cost: { stone: 2, wood: 1, glass: 1 },
    effect: { kind: 'discardOpponentCard', color: 'grey' },
    vp: 3,
    shields: 1,
    description:
      'Odłóż na stos kart odrzuconych wybraną szarą kartę (Dobra) z miasta przeciwnika. Ten Cud zapewnia 1 Tarczę. Ten Cud jest wart 3 punkty.',
  },
  {
    id: 'the-colossus',
    name: 'The Colossus',
    cost: { clay: 3, glass: 1 },
    vp: 3,
    shields: 2,
    description:
      'Ten Cud zapewnia 2 Tarcze. Ten Cud jest wart 3 punkty.',
  },
  {
    id: 'the-great-library',
    name: 'The Great Library',
    cost: { wood: 3, papyrus: 1, glass: 1 },
    effect: { kind: 'chooseProgressFromDiscarded', draw: 3, keep: 1 },
    vp: 4,
    description:
      'Losowo dobierz 3 żetony postępu spośród żetonów odłożonych na początku rozgrywki. Wybierz jeden z nich i zagraj go, a pozostałe 2 odłóż do pudełka. Ten Cud jest wart 4 punkty.',
  },
  {
    id: 'the-great-lighthouse',
    name: 'The Great Lighthouse',
    cost: { wood: 1, stone: 1, papyrus: 2 },
    effect: { kind: 'production', oneOf: ['wood', 'stone', 'clay'] },
    vp: 4,
    description:
      'Ten Cud produkuje w każdej turze jedną sztukę jednego z przedstawionych surowców (kamień, glina albo drewno). Objaśnienie: Ta produkcja nie ma wpływu na cenę zakupu. Ten Cud jest wart 4 punkty.',
  },
  {
    id: 'the-hanging-gardens',
    name: 'The Hanging Gardens',
    cost: { wood: 2, papyrus: 1, glass: 1 },
    effect: { kind: 'coinsNow', amount: 6 },
    vp: 3,
    extraTurn: true,
    description:
      'Otrzymujesz 6 monet z banku. Natychmiast rozegraj jeszcze jedną turę. Ten Cud jest wart 3 punkty.',
  },
  {
    id: 'the-mausoleum',
    name: 'The Mausoleum',
    cost: { clay: 2, glass: 2, papyrus: 1 },
    effect: { kind: 'constructFromDiscard' },
    vp: 2,
    description:
      'Spośród wszystkich kart odrzuconych od początku gry wybierz jedną Budowlę i natychmiast wznieś ją za darmo. Objaśnienie: Karty odrzucone podczas przygotowywania gry nie są częścią stosu kart odrzuconych. Ten Cud jest wart 2 punkty.',
  },
  {
    id: 'piraeus',
    name: 'Piraeus',
    cost: { wood: 2, stone: 1, clay: 1 },
    effect: { kind: 'production', oneOf: ['glass', 'papyrus'] },
    vp: 2,
    extraTurn: true,
    description:
      'Ten Cud produkuje w każdej turze jedną sztukę jednego z przedstawionych dóbr (szkło albo papirus). Objaśnienie: Ta produkcja nie ma wpływu na cenę zakupu. Natychmiast rozegraj jeszcze jedną turę. Ten Cud jest wart 2 punkty.',
  },
  {
    id: 'the-pyramids',
    name: 'The Pyramids',
    cost: { stone: 3, papyrus: 1 },
    vp: 9,
    description:
      'Ten Cud jest wart 9 punktów.',
  },
  {
    id: 'the-sphinx',
    name: 'The Sphinx',
    cost: { stone: 1, clay: 1, glass: 2 },
    vp: 6,
    extraTurn: true,
    description:
      'Natychmiast rozegraj jeszcze jedną turę. Ten Cud jest wart 6 punktów.',
  },
  {
    id: 'the-statue-of-zeus',
    name: 'The Statue of Zeus',
    cost: { wood: 1, stone: 1, clay: 1, papyrus: 2 },
    effect: { kind: 'discardOpponentCard', color: 'brown' },
    vp: 3,
    shields: 1,
    description:
      'Odłóż na stos kart odrzuconych wybraną brązową kartę (Surowce) z miasta przeciwnika. Ten Cud zapewnia 1 Tarczę. Ten Cud jest wart 3 punkty.',
  },
  {
    id: 'the-temple-of-artemis',
    name: 'The Temple of Artemis',
    cost: { wood: 1, stone: 1, glass: 1, papyrus: 1 },
    effect: { kind: 'coinsNow', amount: 12 },
    vp: 0,
    extraTurn: true,
    description:
      'Otrzymujesz 12 monet z banku. Natychmiast rozegraj jeszcze jedną turę.',
  },
] satisfies readonly WonderCard[];