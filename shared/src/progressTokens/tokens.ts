import type { ProgressToken } from './types.js';

export const PROGRESS_TOKENS = [
  {
    id: 'architecture',
    name: 'Architektura',
    effects: [{ kind: 'costReduction', target: 'wonder', resources: 2 }],
    description:
      'Wszystkie przyszłe Cuda, jakie wybudujesz, będą wymagać 2 sztuk materiałów mniej. Podczas budowy każdego Cudu możesz wybrać, których 2 materiałów nie dostarczysz.',
  },
  {
    id: 'masonry',
    name: 'Budownictwo',
    effects: [{ kind: 'costReduction', target: 'blue', resources: 2 }],
    description:
      'Wszystkie przyszłe Budowle cywilne (niebieskie karty), jakie wybudujesz, będą wymagać 2 sztuk materiałów mniej. Podczas wznoszenia każdej Budowli możesz wybrać, których 2 materiałów nie dostarczysz.',
  },
  {
    id: 'economy',
    name: 'Ekonomia',
    effects: [{ kind: 'gainOpponentTradeSpend' }],
    description:
      'Otrzymujesz tyle monet, ile Twój przeciwnik wydał na zakup materiałów z banku. Uwaga: efekt dotyczy tylko monet wydawanych na zakup materiałów, nie dotyczy monet widniejących w koszcie Budowli. Objaśnienie: zniżki przy zakupie materiałów, jakie posiada Twój przeciwnik (np. tartak, magazyn kamienia, magazyn drewna, magazyn gliny i urząd celny), wpływają na cenę zakupu materiałów, a żeton Ekonomia pozwala Ci wziąć tylko faktycznie wydane przez przeciwnika monety.',
  },
  {
    id: 'philosophy',
    name: 'Filozofia',
    effects: [{ kind: 'vp', amount: 7 }],
    description:
      'Ten żeton jest wart 7 punktów.',
  },
  {
    id: 'mathematics',
    name: 'Matematyka',
    effects: [{ kind: 'vpPerProgressToken', amount: 3 }],
    description:
      'Na koniec gry otrzymujesz 3 punkty za każdy żeton postępu, jaki posiadasz, wliczając w to ten żeton.',
  },
  {
    id: 'law',
    name: 'Prawo',
    effects: [{ kind: 'science', symbol: 'law' }],
    description:
      'Ten żeton zapewnia symbol naukowy.',
  },
  {
    id: 'agriculture',
    name: 'Rolnictwo',
    effects: [
      { kind: 'coinsNow', amount: 6 },
      { kind: 'vp', amount: 4 },
    ],
    description:
      'Natychmiast otrzymujesz 6 monet z banku. Żeton jest wart 4 punkty.',
  },
  {
    id: 'strategy',
    name: 'Strategia',
    effects: [{ kind: 'extraShieldOnFutureMilitary' }],
    description:
      'Wszystkie przyszłe Budowle militarne (czerwone karty), jakie wybudujesz, otrzymują jedną dodatkową Tarczę. Objaśnienie: żeton nie odnosi się do Cudów, na których widnieją symbole Tarczy. Żeton nie ma wpływu na Budowle militarne wzniesione przed jego wejściem do gry.',
  },
  {
    id: 'theology',
    name: 'Teologia',
    effects: [{ kind: 'extraTurnOnFutureWonders' }],
    description:
      'Wszystkie przyszłe Cuda, jakie wybudujesz, są traktowane jakby posiadały efekt „Natychmiast rozegraj jeszcze jedną turę”. Uwaga: Cuda posiadające już ten efekt nie są objęte działaniem żetonu i nie mogą posiadać dwóch efektów powtórnej tury.',
  },
  {
    id: 'urbanism',
    name: 'Urbanistyka',
    effects: [
      { kind: 'coinsNow', amount: 6 },
      { kind: 'coinsOnChainBuild', amount: 4 },
    ],
    description:
      'Natychmiast otrzymujesz 6 monet z banku. Za każdym razem, gdy wznosisz za darmo Budowlę dzięki białemu symbolowi, otrzymujesz 4 monety.',
  },
] satisfies readonly ProgressToken[];