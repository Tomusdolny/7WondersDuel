import type { CardColor, GuildScoring } from '../../ageCards/types.js';
import type { PlayerState } from '../../state/player.js';
import { getCard } from '../building/catalog.js';

export type CityCounts = {
  byColor: Record<CardColor, number>;
  builtWonders: number;
  coins: number;
};

export function cityCounts(player: PlayerState): CityCounts {
  const byColor: Record<CardColor, number> = {
    brown: 0,
    grey: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    red: 0,
    purple: 0,
  };
  for (const cardId of player.buildings) {
    const card = getCard(cardId);
    if (card) byColor[card.color] += 1;
  }
  return {
    byColor,
    builtWonders: player.wonders.filter((w) => w.built).length,
    coins: player.coins,
  };
}

function countMatchingCards(counts: CityCounts, colors: readonly CardColor[]): number {
  return colors.reduce((sum, color) => sum + counts.byColor[color], 0);
}

/**
 * VP gildii: kryterium = max z obu miast (karty / zbudowane cuda / bogatszy skarbiec).
 */
export function guildVpForScoring(
  scoring: GuildScoring,
  owner: CityCounts,
  opponent: CityCounts,
): number {
  switch (scoring.kind) {
    case 'perCard': {
      const n = Math.max(
        countMatchingCards(owner, scoring.colors),
        countMatchingCards(opponent, scoring.colors),
      );
      return n * scoring.vpPerCard;
    }
    case 'perWonder': {
      const n = Math.max(owner.builtWonders, opponent.builtWonders);
      return n * scoring.vpPerWonder;
    }
    case 'perTreasuryCoins': {
      const coins = Math.max(owner.coins, opponent.coins);
      return Math.floor(coins / scoring.coinsPerVp);
    }
  }
}
