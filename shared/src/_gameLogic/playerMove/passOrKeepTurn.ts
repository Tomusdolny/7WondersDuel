import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';

/** Oddaje turę przeciwnikowi, chyba że `keepTurn` (extra turn). */
export function passOrKeepTurn(
  state: GameState,
  actingPlayerId: PlayerId,
  keepTurn: boolean,
): GameState {
  if (keepTurn) return state;
  if (state.phase.kind === 'ended') return state;
  if (state.phase.kind === 'awaitingEffectChoice') return state;

  const opponent = state.players.find((p) => p.id !== actingPlayerId);
  if (!opponent) return state;
  return { ...state, activePlayerId: opponent.id };
}
