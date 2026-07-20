import type { Card } from './types';

export const AGE_1_CARDS = [
  // Brązowe (6)
  { id: 'lumber-yard', name: 'Lumber Yard', age: 1, color: 'brown', cost: {}, produces: { wood: 1 } },
  { id: 'logging-camp', name: 'Logging Camp', age: 1, color: 'brown', cost: { coins: 1 }, produces: { wood: 1 } },
  { id: 'clay-pool', name: 'Clay Pool', age: 1, color: 'brown', cost: {}, produces: { clay: 1 } },
  { id: 'clay-pit', name: 'Clay Pit', age: 1, color: 'brown', cost: { coins: 1 }, produces: { clay: 1 } },
  { id: 'quarry', name: 'Quarry', age: 1, color: 'brown', cost: {}, produces: { stone: 1 } },
  { id: 'stone-pit', name: 'Stone Pit', age: 1, color: 'brown', cost: { coins: 1 }, produces: { stone: 1 } },

  // Szare (2)
  { id: 'glassworks', name: 'Glassworks', age: 1, color: 'grey', cost: { coins: 1 }, produces: { glass: 1 } },
  { id: 'press', name: 'Press', age: 1, color: 'grey', cost: { coins: 1 }, produces: { papyrus: 1 } },

  // Niebieskie (3)
  { id: 'theater', name: 'Theater', age: 1, color: 'blue', cost: {}, vp: 3, chain: 'mask' },
  { id: 'altar', name: 'Altar', age: 1, color: 'blue', cost: {}, vp: 3, chain: 'moon' },
  { id: 'baths', name: 'Baths', age: 1, color: 'blue', cost: { resources: { stone: 1 } }, vp: 3, chain: 'drop' },

  // Zielone (4)
  { id: 'workshop', name: 'Workshop', age: 1, color: 'green', cost: { resources: { papyrus: 1 } }, vp: 1, science: 'math' },
  { id: 'apothecary', name: 'Apothecary', age: 1, color: 'green', cost: { resources: { glass: 1 } }, vp: 1, science: 'wheel' },
  { id: 'scriptorium', name: 'Scriptorium', age: 1, color: 'green', cost: { coins: 2 }, vp: 0, science: 'writing', chain: 'book' },
  { id: 'pharmacist', name: 'Pharmacist', age: 1, color: 'green', cost: { coins: 2 }, vp: 0, science: 'chemistry', chain: 'gear' },

  // Żółte (4)
  { id: 'stone-reserve', name: 'Stone Reserve', age: 1, color: 'yellow', cost: { coins: 3 }, effect: { kind: 'tradeDiscount', resources: ['stone'] } },
  { id: 'clay-reserve', name: 'Clay Reserve', age: 1, color: 'yellow', cost: { coins: 3 }, effect: { kind: 'tradeDiscount', resources: ['clay'] } },
  { id: 'wood-reserve', name: 'Wood Reserve', age: 1, color: 'yellow', cost: { coins: 3 }, effect: { kind: 'tradeDiscount', resources: ['wood'] } },
  { id: 'tavern', name: 'Tavern', age: 1, color: 'yellow', cost: {}, effect: { kind: 'coinsNow', amount: 4 }, chain: 'amphora' },

  // Czerwone (4)
  { id: 'guard-tower', name: 'Guard Tower', age: 1, color: 'red', cost: {}, shields: 1 },
  { id: 'stable', name: 'Stable', age: 1, color: 'red', cost: { resources: { wood: 1 } }, shields: 1, chain: 'horseshoe' },
  { id: 'garrison', name: 'Garrison', age: 1, color: 'red', cost: { resources: { clay: 1 } }, shields: 1, chain: 'sword' },
  { id: 'palisade', name: 'Palisade', age: 1, color: 'red', cost: { coins: 1 }, shields: 1, chain: 'tower' },
] satisfies readonly Card[];

export const AGE_2_CARDS = [
  // Brązowe (3)
  { id: 'sawmill', name: 'Sawmill', age: 2, color: 'brown', cost: { coins: 2 }, produces: { wood: 2 } },
  { id: 'brickyard', name: 'Brickyard', age: 2, color: 'brown', cost: { coins: 2 }, produces: { clay: 2 } },
  { id: 'shelf-quarry', name: 'Shelf Quarry', age: 2, color: 'brown', cost: { coins: 2 }, produces: { stone: 2 } },

  // Szare (2)
  { id: 'glass-blower', name: 'Glass-Blower', age: 2, color: 'grey', cost: {}, produces: { glass: 1 } },
  { id: 'drying-room', name: 'Drying Room', age: 2, color: 'grey', cost: {}, produces: { papyrus: 1 } },

  // Niebieskie (5)
  { id: 'courthouse', name: 'Courthouse', age: 2, color: 'blue', cost: { resources: { wood: 2, glass: 1 } }, vp: 5 },
  { id: 'aqueduct', name: 'Aqueduct', age: 2, color: 'blue', cost: { resources: { stone: 3 } }, vp: 5, chain: 'drop' },
  { id: 'temple', name: 'Temple', age: 2, color: 'blue', cost: { resources: { wood: 1, papyrus: 1 } }, vp: 4, chain: 'moon' },
  { id: 'statue', name: 'Statue', age: 2, color: 'blue', cost: { resources: { clay: 2 } }, vp: 4, chain: 'mask' },
  { id: 'rostrum', name: 'Rostrum', age: 2, color: 'blue', cost: { resources: { stone: 1, wood: 1 } }, vp: 4, chain: 'column' },

  // Zielone (4)
  { id: 'library', name: 'Library', age: 2, color: 'green', cost: { resources: { stone: 1, wood: 1, glass: 1 } }, vp: 2, science: 'writing', chain: 'book' },
  { id: 'dispensary', name: 'Dispensary', age: 2, color: 'green', cost: { resources: { clay: 2, stone: 1 } }, vp: 2, science: 'chemistry', chain: 'gear' },
  { id: 'laboratory', name: 'Laboratory', age: 2, color: 'green', cost: { resources: { wood: 1, glass: 2 } }, vp: 1, science: 'math', chain: 'lamp' },
  { id: 'school', name: 'School', age: 2, color: 'green', cost: { resources: { wood: 1, papyrus: 2 } }, vp: 1, science: 'wheel', chain: 'harp' },

  // Żółte (4)
  { id: 'forum', name: 'Forum', age: 2, color: 'yellow', cost: { coins: 1, resources: { clay: 1 } }, effect: { kind: 'production', oneOf: ['glass', 'papyrus'] } },
  { id: 'caravansery', name: 'Caravansery', age: 2, color: 'yellow', cost: { coins: 2, resources: { glass: 1, papyrus: 1 } }, effect: { kind: 'production', oneOf: ['wood', 'stone', 'clay'] } },
  { id: 'customs-house', name: 'Customs House', age: 2, color: 'yellow', cost: { coins: 4 }, effect: { kind: 'tradeDiscount', resources: ['glass', 'papyrus'] } },
  { id: 'brewery', name: 'Brewery', age: 2, color: 'yellow', cost: {}, effect: { kind: 'coinsNow', amount: 6 }, chain: 'barrel' },

  // Czerwone (5)
  { id: 'walls', name: 'Walls', age: 2, color: 'red', cost: { resources: { wood: 2 } }, shields: 2 },
  { id: 'horse-breeders', name: 'Horse Breeders', age: 2, color: 'red', cost: { resources: { clay: 1, wood: 1 } }, shields: 1, chain: 'horseshoe' },
  { id: 'archery-range', name: 'Archery Range', age: 2, color: 'red', cost: { resources: { stone: 1, wood: 1, papyrus: 1 } }, shields: 2, chain: 'target' },
  { id: 'barracks', name: 'Barracks', age: 2, color: 'red', cost: { coins: 3 }, shields: 1, chain: 'sword' },
  { id: 'parade-ground', name: 'Parade Ground', age: 2, color: 'red', cost: { resources: { clay: 2, papyrus: 1 } }, shields: 2, chain: 'helmet' },
] satisfies readonly Card[];

export const AGE_3_CARDS = [
  // Niebieskie (6)
  { id: 'palace', name: 'Palace', age: 3, color: 'blue', cost: { resources: { stone: 1, wood: 1, clay: 1, glass: 2 } }, vp: 7 },
  { id: 'town-hall', name: 'Town Hall', age: 3, color: 'blue', cost: { resources: { stone: 3, wood: 2 } }, vp: 7 },
  { id: 'obelisk', name: 'Obelisk', age: 3, color: 'blue', cost: { resources: { stone: 2, glass: 1 } }, vp: 5 },
  { id: 'gardens', name: 'Gardens', age: 3, color: 'blue', cost: { resources: { wood: 2, clay: 2 } }, vp: 6, chain: 'mask' },
  { id: 'pantheon', name: 'Pantheon', age: 3, color: 'blue', cost: { resources: { clay: 1, wood: 1, papyrus: 2 } }, vp: 6, chain: 'moon' },
  { id: 'senate', name: 'Senate', age: 3, color: 'blue', cost: { resources: { clay: 1, stone: 1, papyrus: 2 } }, vp: 6, chain: 'column' },

  // Zielone (4)
  { id: 'academy', name: 'Academy', age: 3, color: 'green', cost: { resources: { stone: 1, wood: 1, glass: 2 } }, vp: 3, science: 'sundial' },
  { id: 'study', name: 'Study', age: 3, color: 'green', cost: { resources: { wood: 2, glass: 1, papyrus: 1 } }, vp: 3, science: 'sundial' },
  { id: 'university', name: 'University', age: 3, color: 'green', cost: { resources: { clay: 1, glass: 1, papyrus: 1 } }, vp: 2, science: 'astronomy', chain: 'harp' },
  { id: 'observatory', name: 'Observatory', age: 3, color: 'green', cost: { resources: { stone: 1, papyrus: 2 } }, vp: 2, science: 'astronomy', chain: 'lamp' },

  // Żółte (5)
  { id: 'chamber-of-commerce', name: 'Chamber of Commerce', age: 3, color: 'yellow', cost: { resources: { papyrus: 2 } }, vp: 3, effect: { kind: 'coinsPer', per: 'grey', amount: 3 } },
  { id: 'port', name: 'Port', age: 3, color: 'yellow', cost: { resources: { wood: 1, glass: 1, papyrus: 1 } }, vp: 3, effect: { kind: 'coinsPer', per: 'brown', amount: 2 } },
  { id: 'armory', name: 'Armory', age: 3, color: 'yellow', cost: { resources: { stone: 2, glass: 1 } }, vp: 3, effect: { kind: 'coinsPer', per: 'red', amount: 1 } },
  { id: 'lighthouse', name: 'Lighthouse', age: 3, color: 'yellow', cost: { resources: { clay: 2, glass: 1 } }, vp: 3, effect: { kind: 'coinsPer', per: 'yellow', amount: 1 }, chain: 'amphora' },
  { id: 'arena', name: 'Arena', age: 3, color: 'yellow', cost: { resources: { clay: 1, stone: 1, wood: 1 } }, vp: 3, effect: { kind: 'coinsPer', per: 'wonder', amount: 2 }, chain: 'barrel' },

  // Czerwone (5)
  { id: 'arsenal', name: 'Arsenal', age: 3, color: 'red', cost: { resources: { clay: 3, wood: 2 } }, shields: 3 },
  { id: 'pretorium', name: 'Pretorium', age: 3, color: 'red', cost: { coins: 8 }, shields: 3 },
  { id: 'siege-workshop', name: 'Siege Workshop', age: 3, color: 'red', cost: { resources: { wood: 3, glass: 1 } }, shields: 2, chain: 'target' },
  { id: 'circus', name: 'Circus', age: 3, color: 'red', cost: { resources: { clay: 2, stone: 2 } }, shields: 2, chain: 'helmet' },
  { id: 'fortifications', name: 'Fortifications', age: 3, color: 'red', cost: { resources: { stone: 2, clay: 1, papyrus: 1 } }, shields: 2, chain: 'tower' },
] satisfies readonly Card[];

// Do talii Age III dolosowuje się 3 z 7 gildii.
export const GUILD_CARDS = [
  { id: 'merchants-guild', name: 'Merchants Guild', age: 3, color: 'purple', cost: { resources: { wood: 1, clay: 1, glass: 1, papyrus: 1 } }, scoring: { kind: 'perCard', colors: ['yellow'], coinsOnBuild: 1, vpPerCard: 1 } },
  { id: 'shipowners-guild', name: 'Shipowners Guild', age: 3, color: 'purple', cost: { resources: { stone: 1, clay: 1, glass: 1, papyrus: 1 } }, scoring: { kind: 'perCard', colors: ['brown', 'grey'], coinsOnBuild: 1, vpPerCard: 1 } },
  { id: 'builders-guild', name: 'Builders Guild', age: 3, color: 'purple', cost: { resources: { stone: 2, wood: 1, clay: 1, glass: 1 } }, scoring: { kind: 'perWonder', vpPerWonder: 2 } },
  { id: 'magistrates-guild', name: 'Magistrates Guild', age: 3, color: 'purple', cost: { resources: { wood: 2, clay: 1, papyrus: 1 } }, scoring: { kind: 'perCard', colors: ['blue'], coinsOnBuild: 1, vpPerCard: 1 } },
  { id: 'scientists-guild', name: 'Scientists Guild', age: 3, color: 'purple', cost: { resources: { clay: 2, wood: 2 } }, scoring: { kind: 'perCard', colors: ['green'], coinsOnBuild: 1, vpPerCard: 1 } },
  { id: 'moneylenders-guild', name: 'Moneylenders Guild', age: 3, color: 'purple', cost: { resources: { stone: 2, wood: 2 } }, scoring: { kind: 'perTreasuryCoins', coinsPerVp: 3 } },
  { id: 'tacticians-guild', name: 'Tacticians Guild', age: 3, color: 'purple', cost: { resources: { stone: 2, clay: 1, papyrus: 1 } }, scoring: { kind: 'perCard', colors: ['red'], coinsOnBuild: 1, vpPerCard: 1 } },
] satisfies readonly Card[];

export const ALL_CARDS: readonly Card[] = [
  ...AGE_1_CARDS,
  ...AGE_2_CARDS,
  ...AGE_3_CARDS,
  ...GUILD_CARDS,
];
