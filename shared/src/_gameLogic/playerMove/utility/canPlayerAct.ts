import type { PlayerId } from '../../../state/player.js';
import type { GamePhase } from '../../../state/game.js';

/** Czy gracz jest aktywny i partia nie jest zakończona. */
export function canPlayerAct(
  view: { phase: GamePhase; activePlayerId: PlayerId },
  playerId: PlayerId,
): boolean {
  return view.phase.kind !== 'ended' && view.activePlayerId === playerId;
}
