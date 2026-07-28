import type { GameState, PlayerId, RoomStatus } from '@7ww/shared';

export type PlayerSeat = {
  playerId: PlayerId;
  playerToken: string;
  /** `null` gdy gracz rozłączony (seat i token zostają). */
  connectionId: number | null;
};

export type Room = {
  id: string;
  code: string;
  status: RoomStatus;
  seats: PlayerSeat[];
  /** Ustawiane po starcie partii (§3). */
  gameState?: GameState;
};
