import type { PlayerId } from '../../state/player.js';
import type { GameState } from '../../state/game.js';
import type { WonderCard } from '../../wonders/types.js';
import { getCard } from '../building/catalog.js';
import { applyMilitaryShields, hasProgressEffect } from './military.js';
import { addCoins, findPlayers, withPlayers } from './players.js';

export type WonderEffectOutcome = {
  state: GameState;
  pending: boolean;
  keepTurn: boolean;
};

export function applyWonderBuiltEffects(
  state: GameState,
  playerId: PlayerId,
  wonder: WonderCard,
): WonderEffectOutcome {
  const found = findPlayers(state, playerId);
  if (!found) {
    return { state, pending: false, keepTurn: false };
  }

  let { player, opponent, playerIndex } = found;
  let next = state;
  let pending = false;

  const keepTurn =
    wonder.extraTurn === true || hasProgressEffect(player, 'extraTurnOnFutureWonders');

  if (wonder.shields) {
    next = applyMilitaryShields(next, playerId, wonder.shields);
    if (next.phase.kind === 'ended') {
      return { state: next, pending: false, keepTurn: false };
    }
    const refreshed = findPlayers(next, playerId);
    if (refreshed) {
      player = refreshed.player;
      opponent = refreshed.opponent;
      playerIndex = refreshed.playerIndex;
    }
  }

  const effect = wonder.effect;
  if (!effect) {
    return { state: next, pending: false, keepTurn };
  }

  switch (effect.kind) {
    case 'coinsNow': {
      player = addCoins(player, effect.amount);
      if (effect.opponentLose) {
        opponent = addCoins(opponent, -effect.opponentLose);
      }
      next = withPlayers(next, player, opponent, playerIndex);
      break;
    }
    case 'production':
      break;
    case 'discardOpponentCard': {
      const hasTarget = opponent.buildings.some((id) => getCard(id)?.color === effect.color);
      if (hasTarget) {
        next = {
          ...next,
          phase: {
            kind: 'awaitingEffectChoice',
            choice: { kind: 'discardOpponentCard', color: effect.color },
          },
        };
        pending = true;
      }
      break;
    }
    case 'constructFromDiscard': {
      if (next.discard.length > 0) {
        next = {
          ...next,
          phase: {
            kind: 'awaitingEffectChoice',
            choice: { kind: 'constructFromDiscard' },
          },
        };
        pending = true;
      }
      break;
    }
    case 'chooseProgressFromDiscarded': {
      const options = next.progressInBox.slice(0, effect.draw);
      if (options.length > 0) {
        next = {
          ...next,
          phase: {
            kind: 'awaitingEffectChoice',
            choice: {
              kind: 'chooseProgressFromBox',
              options,
              keep: effect.keep,
            },
          },
        };
        pending = true;
      }
      break;
    }
  }

  return { state: next, pending, keepTurn };
}
