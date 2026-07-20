import type { ProgressToken } from './types.js';

export const PROGRESS_TOKENS = [
  {
    id: 'architecture',
    name: 'Architektura',
    effects: [{ kind: 'costReduction', target: 'wonder', resources: 2 }],
  },
  {
    id: 'masonry',
    name: 'Budownictwo',
    effects: [{ kind: 'costReduction', target: 'blue', resources: 2 }],
  },
  {
    id: 'economy',
    name: 'Ekonomia',
    effects: [{ kind: 'gainOpponentTradeSpend' }],
  },
  {
    id: 'philosophy',
    name: 'Filozofia',
    effects: [{ kind: 'vp', amount: 7 }],
  },
  {
    id: 'mathematics',
    name: 'Matematyka',
    effects: [{ kind: 'vpPerProgressToken', amount: 3 }],
  },
  {
    id: 'law',
    name: 'Prawo',
    effects: [{ kind: 'science', symbol: 'law' }],
  },
  {
    id: 'agriculture',
    name: 'Rolnictwo',
    effects: [
      { kind: 'coinsNow', amount: 6 },
      { kind: 'vp', amount: 4 },
    ],
  },
  {
    id: 'strategy',
    name: 'Strategia',
    effects: [{ kind: 'extraShieldOnFutureMilitary' }],
  },
  {
    id: 'theology',
    name: 'Teologia',
    effects: [{ kind: 'extraTurnOnFutureWonders' }],
  },
  {
    id: 'urbanism',
    name: 'Urbanistyka',
    effects: [
      { kind: 'coinsNow', amount: 6 },
      { kind: 'coinsOnChainBuild', amount: 4 },
    ],
  },
] satisfies readonly ProgressToken[];
