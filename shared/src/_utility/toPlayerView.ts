import type { PlayerId } from '../state/player.js';
import type { GameState, GameStateView } from '../state/game.js';
import { toGameStateView } from './toGameStateView.js';

/**
 * Widok stanu dla konkretnego gracza (broadcast WS / UI).
 * Maskuje `cardId` na slotach face-down oraz `progressInBox`
 *
 * `playerId` — perspektywa odbiorcy (asymetryczne maskowanie w przyszłości).
 */
export function toPlayerView(state: GameState, _playerId: PlayerId): GameStateView {
  const view = toGameStateView(state);
  return view;
}
