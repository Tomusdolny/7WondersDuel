import type { PlayerId, PlayerState } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';

export function findPlayers(
  state: GameState,
  playerId: PlayerId,
): { player: PlayerState; opponent: PlayerState; playerIndex: 0 | 1 } | null {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex !== 0 && playerIndex !== 1) return null;
  const opponentIndex = playerIndex === 0 ? 1 : 0;
  return {
    player: state.players[playerIndex],
    opponent: state.players[opponentIndex],
    playerIndex,
  };
}

export function withPlayers(
  state: GameState,
  player: PlayerState,
  opponent: PlayerState,
  playerIndex: 0 | 1,
): GameState {
  const players: [PlayerState, PlayerState] =
    playerIndex === 0 ? [player, opponent] : [opponent, player];
  return { ...state, players };
}

export function addCoins(player: PlayerState, delta: number): PlayerState {
  return { ...player, coins: Math.max(0, player.coins + delta) };
}
