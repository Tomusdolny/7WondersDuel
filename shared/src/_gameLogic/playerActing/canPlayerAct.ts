import type { PlayerId } from '../../state/player.js';
import type { GameStateView } from '../../state/game.js';

/** Czy gracz jest aktywny i partia nie jest zakończona. */
export function canPlayerAct(view: GameStateView, playerId: PlayerId): boolean {
  return view.phase.kind !== 'ended' && view.activePlayerId === playerId;
}
