import type { ProgressTokenId } from '../../../progressTokens/types.js';
import type { PlayerId } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { getProgressToken } from '../../building/catalog.js';
import { addCoins, findPlayers, withPlayers } from '../utility/players.js';
import { hasScienceVictory } from './science.js';

export type GainProgressOutcome = {
  state: GameState;
  /** Natychmiastowe zwycięstwo naukowe (np. Law). */
  ended: boolean;
};

/** Dodaje żeton graczowi i aplikuje efekty natychmiastowe (`coinsNow`, nauka). */
export function gainProgressToken(
  state: GameState,
  playerId: PlayerId,
  tokenId: ProgressTokenId,
): GainProgressOutcome {
  const found = findPlayers(state, playerId);
  if (!found) return { state, ended: false };

  const token = getProgressToken(tokenId);
  if (!token) return { state, ended: false };

  let player = {
    ...found.player,
    progressTokens: [...found.player.progressTokens, tokenId],
  };

  for (const effect of token.effects) {
    if (effect.kind === 'coinsNow') {
      player = addCoins(player, effect.amount);
    }
  }

  let next = withPlayers(state, player, found.opponent, found.playerIndex);

  if (hasScienceVictory(player)) {
    next = {
      ...next,
      phase: { kind: 'ended', result: { kind: 'science', winnerId: playerId } },
    };
    return { state: next, ended: true };
  }

  return { state: next, ended: false };
}
