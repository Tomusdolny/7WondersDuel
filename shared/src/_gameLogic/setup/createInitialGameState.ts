import { MILITARY_TOKENS } from '../../militaryTokens/tokens.js';
import type { GameState } from '../../state/game.js';
import type { PlayerId, PlayerState } from '../../state/player.js';
import type { Rng } from '../../_utility/rng.js';
import { dealProgressTokens } from './dealProgressTokens.js';
import { STARTING_COINS } from '../../coins/types.js';
import { MILITARY_TOKEN_CENTER } from '../../militaryTokens/types.js';

export type CreateInitialGameStateParams = {
  playerIds: readonly [PlayerId, PlayerId];
  rng: Rng;
  /** Kto jest `activePlayerId` na starcie — domyślnie `playerIds[0]`. */
  activePlayerId?: PlayerId;
};

/**
 * Bootstrap partii (opcja B): gracze, Progress, militarne — bez draftu cudów.
 * `structure` puste; przed grą wywołaj `setupAge`. Cuda: `wonders: []` do osobnego draftu.
 */
export function createInitialGameState(params: CreateInitialGameStateParams): GameState {
  const [idA, idB] = params.playerIds;
  if (idA === idB) {
    throw new Error('playerIds must be distinct');
  }

  const activePlayerId = params.activePlayerId ?? idA;
  if (activePlayerId !== idA && activePlayerId !== idB) {
    throw new Error(`activePlayerId not in playerIds: ${activePlayerId}`);
  }

  const { progressOnBoard, progressInBox } = dealProgressTokens(params.rng);

  return {
    version: 0,
    phase: { kind: 'playing' },
    age: 1,
    activePlayerId,
    players: [emptyPlayer(idA), emptyPlayer(idB)],
    structure: [],
    discard: [],
    progressOnBoard,
    progressInBox,
    conflictPosition: MILITARY_TOKEN_CENTER,
    militaryTokens: MILITARY_TOKENS.map((token) => ({ ...token })),
    wondersBuiltTotal: 0,
  };
}

function emptyPlayer(id: PlayerId): PlayerState {
  return {
    id,
    coins: STARTING_COINS,
    buildings: [],
    wonders: [],
    progressTokens: [],
  };
}
