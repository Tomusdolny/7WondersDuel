import type { GameState } from '../../state/game.js';
import type { PlayerId, PlayerState } from '../../state/player.js';
import { getCard, getProgressToken, getWonder } from '../building/catalog.js';
import { cityCounts, guildVpForScoring } from './guildVp.js';
import { militaryVpByPlayer } from './militaryVp.js';
import type { CivilianScoreResult, ScoreBreakdown } from './types.js';

/** Podzbiór stanu wystarczający do liczenia wyniku — używany też z `GameStateView` (UI, wynik na bieżąco). */
export type ScoreCivilianInput = Pick<GameState, 'players' | 'conflictPosition'>;

export type ScoreCivilianMode = 'live' | 'final';

export type ScoreCivilianOptions = {
  /**
   * `live` — budynki, cuda, Progress (UI w trakcie partii).
   * `final` — + gildie, skarbiec, militarne (koniec Ery III / ekran wyniku).
   */
  mode?: ScoreCivilianMode;
};

/**
 * Punktacja cywilna.
 * Remis łącznego VP → więcej VP z niebieskich; inaczej `'tie'`.
 */
export function scoreCivilian(
  state: ScoreCivilianInput,
  options: ScoreCivilianOptions = {},
): CivilianScoreResult {
  const mode = options.mode ?? 'final';
  const includeEndGame = mode === 'final';

  const [playerA, playerB] = state.players;
  const countsA = cityCounts(playerA);
  const countsB = cityCounts(playerB);
  const military = includeEndGame
    ? militaryVpByPlayer(state)
    : { [playerA.id]: 0, [playerB.id]: 0 };

  const breakdownA = scorePlayer(
    playerA,
    countsA,
    countsB,
    military[playerA.id] ?? 0,
    includeEndGame,
  );
  const breakdownB = scorePlayer(
    playerB,
    countsB,
    countsA,
    military[playerB.id] ?? 0,
    includeEndGame,
  );

  const scores: Record<PlayerId, number> = {
    [playerA.id]: breakdownA.total,
    [playerB.id]: breakdownB.total,
  };
  const breakdown: Record<PlayerId, ScoreBreakdown> = {
    [playerA.id]: breakdownA,
    [playerB.id]: breakdownB,
  };

  return {
    scores,
    breakdown,
    winnerId: resolveWinner(playerA.id, playerB.id, breakdownA, breakdownB),
  };
}

function scorePlayer(
  player: PlayerState,
  self: ReturnType<typeof cityCounts>,
  opponent: ReturnType<typeof cityCounts>,
  military: number,
  includeEndGame: boolean,
): ScoreBreakdown {
  let buildings = 0;
  let blueVp = 0;
  let guilds = 0;

  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (!card) continue;

    if (card.color === 'blue') {
      buildings += card.vp;
      blueVp += card.vp;
    } else if (card.color === 'green') {
      buildings += card.vp;
    } else if (card.color === 'yellow' && card.vp != null) {
      buildings += card.vp;
    } else if (card.color === 'purple' && includeEndGame) {
      guilds += guildVpForScoring(card.scoring, self, opponent);
    }
  }

  let wonders = 0;
  for (const slot of player.wonders) {
    if (!slot.built) continue;
    const wonder = getWonder(slot.wonderId);
    if (wonder) wonders += wonder.vp;
  }

  let progress = 0;
  const tokenCount = player.progressTokens.length;
  for (const tokenId of player.progressTokens) {
    const token = getProgressToken(tokenId);
    if (!token) continue;
    for (const effect of token.effects) {
      if (effect.kind === 'vp') progress += effect.amount;
      if (effect.kind === 'vpPerProgressToken') progress += effect.amount * tokenCount;
    }
  }

  const treasury = includeEndGame ? Math.floor(player.coins / 3) : 0;
  const militaryVp = includeEndGame ? military : 0;
  const total = buildings + wonders + progress + guilds + treasury + militaryVp;

  return {
    buildings,
    wonders,
    progress,
    guilds,
    treasury,
    military: militaryVp,
    total,
    blueVp,
  };
}

function resolveWinner(
  idA: PlayerId,
  idB: PlayerId,
  a: ScoreBreakdown,
  b: ScoreBreakdown,
): PlayerId | 'tie' {
  if (a.total > b.total) return idA;
  if (b.total > a.total) return idB;
  if (a.blueVp > b.blueVp) return idA;
  if (b.blueVp > a.blueVp) return idB;
  return 'tie';
}
