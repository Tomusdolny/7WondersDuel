import {
  applyBuildCard,
  applyBuildWonder,
  applyChooseNextAgeStarter,
  applyChooseProgressFromBox,
  applyChooseProgressToken,
  applyConstructFromDiscard,
  applyDiscardCard,
  applyDiscardOpponentCard,
  applySelectWonder,
  createInitialGameState,
  createMathRng,
  scoreCivilian,
  type ApplyResult,
  type ClientCommand,
  type GameState,
  type PlayerId,
  type PlayerScoreEntry,
  type Rng,
} from '@7ww/shared';
import { log } from '../logging.js';
import type { Room } from '../rooms/types.js';

const rng: Rng = createMathRng();

/** Host = seats[0] = gracz A, gość = seats[1] = gracz B. */
export function startGameSession(room: Room): GameState {
  if (room.seats.length !== 2) {
    throw new Error(`Cannot start game with ${room.seats.length} seats`);
  }
  const playerIds = [room.seats[0]!.playerId, room.seats[1]!.playerId] as const;
  const state = createInitialGameState({ playerIds, rng });
  room.gameState = state;
  room.status = 'in_game';
  log('game.start', { roomId: room.id, version: state.version });
  return state;
}

export function applyGameCommand(
  state: GameState,
  playerId: PlayerId,
  command: ClientCommand,
): ApplyResult {
  switch (command.kind) {
    case 'selectWonder':
      return applySelectWonder(state, playerId, command.wonderId, rng);
    case 'takeCard': {
      const { slotIndex, action } = command;
      switch (action.kind) {
        case 'build':
          return applyBuildCard(state, playerId, slotIndex);
        case 'discard':
          return applyDiscardCard(state, playerId, slotIndex);
        case 'buildWonder':
          return applyBuildWonder(state, playerId, slotIndex, action.wonderId);
      }
      break;
    }
    case 'chooseProgressToken':
      return applyChooseProgressToken(state, playerId, command.tokenId);
    case 'chooseProgressFromBox':
      return applyChooseProgressFromBox(state, playerId, command.tokenId);
    case 'discardOpponentCard':
      return applyDiscardOpponentCard(state, playerId, command.cardId);
    case 'constructFromDiscard':
      return applyConstructFromDiscard(state, playerId, command.cardId);
    case 'chooseNextAgeStarter':
      return applyChooseNextAgeStarter(state, playerId, command.playerId, rng);
    case 'createRoom':
    case 'joinRoom':
      return { ok: false, error: 'wrongPhase' };
  }
}

export function buildScoreEntries(state: GameState): PlayerScoreEntry[] {
  const { breakdown } = scoreCivilian(state);
  return state.players.map((player) => ({
    playerId: player.id,
    ...breakdown[player.id]!,
  }));
}

/** Walkower: wygrywa przeciwnik rozłączonego gracza. */
export function resignByDisconnect(
  state: GameState,
  disconnectedPlayerId: PlayerId,
): GameState | null {
  if (state.phase.kind === 'ended') return null;
  const winner = state.players.find((p) => p.id !== disconnectedPlayerId);
  if (!winner) return null;
  return {
    ...state,
    version: state.version + 1,
    phase: { kind: 'ended', result: { kind: 'resign', winnerId: winner.id } },
  };
}
