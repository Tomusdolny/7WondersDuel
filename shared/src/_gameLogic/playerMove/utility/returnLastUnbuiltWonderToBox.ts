import type { GameState } from '../../../state/game.js';
import type { PlayerState } from '../../../state/player.js';

/**
 * Po 7. zbudowanym cudzie w partii: jedyny pozostały niezbudowany wraca do pudełka.
 */
export function returnLastUnbuiltWonderToBox(state: GameState): GameState {
  if (state.wondersBuiltTotal < 7) return state;

  let removed = false;
  const players = state.players.map((player): PlayerState => {
    if (removed) return player;
    const idx = player.wonders.findIndex((w) => !w.built);
    if (idx < 0) return player;
    removed = true;
    return {
      ...player,
      wonders: player.wonders.filter((_, i) => i !== idx),
    };
  }) as [PlayerState, PlayerState];

  if (!removed) return state;
  return { ...state, players };
}
