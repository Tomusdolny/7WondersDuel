import { MILITARY_TOKENS } from '../../militaryTokens/tokens.js';
import type { GameState } from '../../state/game.js';
import type { PlayerId, PlayerState } from '../../state/player.js';
import type { Rng } from '../../_utility/rng.js';
import { dealProgressTokens } from './dealProgressTokens.js';
import { STARTING_COINS } from '../../coins/types.js';
import { MILITARY_TOKEN_CENTER } from '../../militaryTokens/types.js';
import { startWonderDraft } from './startWonderDraft.js';

export type CreateInitialGameStateParams = {
  playerIds: readonly [PlayerId, PlayerId];
  rng: Rng;
};

/**
 * Bootstrap partii: gracze (7 monet), Progress, militarne, start draftu cudów.
 * `players[0]` = A (pierwszy w ABBA), `players[1]` = B.
 * Po drafcie: `setupAge` osobno.
 */
export function createInitialGameState(params: CreateInitialGameStateParams): GameState {
  const [idA, idB] = params.playerIds;
  if (idA === idB) {
    throw new Error('playerIds must be distinct');
  }

  const { progressOnBoard, progressInBox } = dealProgressTokens(params.rng);
  const [colorA, colorB] = params.rng.shuffle(['orange', 'blue'] as const);

  const base: GameState = {
    version: 0,
    phase: { kind: 'playing' },
    age: 1,
    activePlayerId: idA,
    players: [emptyPlayer(idA, colorA!), emptyPlayer(idB, colorB!)],
    structure: [],
    discard: [],
    progressOnBoard,
    progressInBox,
    conflictPosition: MILITARY_TOKEN_CENTER,
    militaryTokens: MILITARY_TOKENS.map((token) => ({ ...token })),
    wondersBuiltTotal: 0,
  };

  return startWonderDraft(base, params.rng);
}

function emptyPlayer(id: PlayerId, color: PlayerState['color']): PlayerState {
  return {
    id,
    color,
    coins: STARTING_COINS,
    buildings: [],
    wonders: [],
    progressTokens: [],
  };
}
