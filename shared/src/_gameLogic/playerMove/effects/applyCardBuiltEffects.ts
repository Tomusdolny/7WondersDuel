import type { Card, CardColor, PurpleCard, YellowCard } from '../../../ageCards/types.js';
import type { PlayerId, PlayerState } from '../../../state/player.js';
import type { GameState } from '../../../state/game.js';
import { getCard, getProgressToken } from '../../building/catalog.js';
import { addCoins, findPlayers, withPlayers } from '../utility/players.js';
import { applyMilitaryShields, hasProgressEffect, redShieldsWithStrategy } from './military.js';
import { formsSciencePair, hasScienceVictory } from './science.js';

export type CardEffectOutcome = {
  state: GameState;
  /** Gra czeka na wybór — nie oddawać tury. */
  pending: boolean;
};

/**
 * Efekty po dodaniu karty do `buildings` (gracz już ma kartę w stanie).
 * `playerBefore` = stan sprzed dodania (do pary nauki / Urbanism).
 * `keepTurn` — przekazywane do ewentualnego `awaitingEffectChoice`.
 */
export function applyCardBuiltEffects(
  state: GameState,
  playerId: PlayerId,
  card: Card,
  playerBefore: PlayerState,
  builtViaChain: boolean,
  keepTurn = false,
): CardEffectOutcome {
  const found = findPlayers(state, playerId);
  if (!found) return { state, pending: false };

  let { player, opponent, playerIndex } = found;
  let next = state;
  let pending = false;

  if (builtViaChain && hasProgressEffect(playerBefore, 'coinsOnChainBuild')) {
    const amount = chainBuildCoins(playerBefore);
    player = addCoins(player, amount);
    next = withPlayers(next, player, opponent, playerIndex);
  }

  switch (card.color) {
    case 'yellow': {
      const gain = yellowCoinsOnBuild(card, player, opponent);
      player = addCoins(player, gain);
      next = withPlayers(next, player, opponent, playerIndex);
      break;
    }
    case 'purple': {
      const gain = guildCoinsOnBuild(card, player, opponent);
      player = addCoins(player, gain);
      next = withPlayers(next, player, opponent, playerIndex);
      break;
    }
    case 'red': {
      const shields = redShieldsWithStrategy(player, card.shields);
      next = applyMilitaryShields(next, playerId, shields);
      break;
    }
    case 'green': {
      if (hasScienceVictory(player)) {
        next = {
          ...next,
          phase: { kind: 'ended', result: { kind: 'science', winnerId: playerId } },
        };
        break;
      }
      if (formsSciencePair(playerBefore, card.science) && next.progressOnBoard.length > 0) {
        next = {
          ...next,
          phase: {
            kind: 'awaitingEffectChoice',
            choice: { kind: 'chooseProgressToken', options: [...next.progressOnBoard] },
            keepTurn,
          },
        };
        pending = true;
      }
      break;
    }
    default:
      break;
  }

  return { state: next, pending };
}

function chainBuildCoins(player: PlayerState): number {
  let total = 0;
  for (const id of player.progressTokens) {
    const token = getProgressToken(id);
    if (!token) continue;
    for (const effect of token.effects) {
      if (effect.kind === 'coinsOnChainBuild') total += effect.amount;
    }
  }
  return total;
}

function yellowCoinsOnBuild(
  card: YellowCard,
  player: PlayerState,
  _opponent: PlayerState,
): number {
  const effect = card.effect;
  if (effect.kind === 'coinsNow') return effect.amount;
  if (effect.kind === 'coinsPer') {
    if (effect.per === 'wonder') {
      return effect.amount * player.wonders.filter((w) => w.built).length;
    }
    return effect.amount * countColor(player, effect.per);
  }
  return 0;
}

function guildCoinsOnBuild(
  card: PurpleCard,
  player: PlayerState,
  opponent: PlayerState,
): number {
  const scoring = card.scoring;
  if (scoring.kind !== 'perCard') return 0;
  const mine = countColors(player, scoring.colors);
  const theirs = countColors(opponent, scoring.colors);
  return scoring.coinsOnBuild * Math.max(mine, theirs);
}

function countColor(player: PlayerState, color: CardColor): number {
  return countColors(player, [color]);
}

function countColors(player: PlayerState, colors: readonly CardColor[]): number {
  let n = 0;
  for (const cardId of player.buildings) {
    const owned = getCard(cardId);
    if (owned && colors.includes(owned.color)) n += 1;
  }
  return n;
}
