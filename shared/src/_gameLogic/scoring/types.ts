import type { PlayerId } from '../../state/player.js';

export type ScoreBreakdown = {
  buildings: number;
  wonders: number;
  progress: number;
  guilds: number;
  treasury: number;
  military: number;
  /** Suma składowych. */
  total: number;
  /** VP z kart niebieskich — tiebreak. */
  blueVp: number;
};

export type CivilianScoreResult = {
  scores: Record<PlayerId, number>;
  breakdown: Record<PlayerId, ScoreBreakdown>;
  winnerId: PlayerId | 'tie';
};
