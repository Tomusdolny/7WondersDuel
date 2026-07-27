import type { PlayerId } from '../state/player.js';
import type { GameState, GameStateView } from '../state/game.js';
import {
  getAvailableSlots,
  getLegalActions,
} from '../_gameLogic/playerMove/legalActions.js';
import { toGameStatePublic } from './toGameStateView.js';

/**
 * Widok stanu dla konkretnego gracza (broadcast WS / UI).
 * Maskuje `cardId` na slotach face-down, `progressInBox` oraz `remaining` draftu.
 */
export function toPlayerView(state: GameState, playerId: PlayerId): GameStateView {
  const pub = toGameStatePublic(state);
  const { progressInBox: _hidden, ...rest } = pub;
  return {
    ...rest,
    viewerId: playerId,
    availableSlots: getAvailableSlots(pub),
    legalActions: getLegalActions(pub, playerId),
  };
}
