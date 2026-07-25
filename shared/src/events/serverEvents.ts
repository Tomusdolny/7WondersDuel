import type { GameResult } from '../state/game.js';
import type { PlayerId } from '../state/player.js';
import type { ProtocolVersion } from './commands.js';
import type { GameStateView } from './view.js';

/**
 * Status pokoju w lobby / po starcie partii.
 */
export type RoomStatus = 'waiting' | 'in_game' | 'finished';

/**
 * Stan lobby / sesji pokoju.
 * Emitowany po create/join, reconnect oraz gdy drugi gracz dołączy lub wyjdzie.
 * `playerToken` + `playerId` — tożsamość odbiorcy (zapisać w localStorage do reconnect).
 */
export interface RoomStateEvent {
  kind: 'roomState';
  roomId: string;
  roomCode: string;
  status: RoomStatus;
  /** Token sesji tego klienta (gość) — do reconnect. */
  playerToken: string;
  /** Id gracza w `GameState.players` przypisane temu klientowi. */
  playerId: PlayerId;
  /** Czy przeciwnik jest połączony (obecność WS). */
  opponentConnected: boolean;
  /** Liczba miejsc zajętych (1 lub 2). */
  playerCount: 1 | 2;
}

/**
 * Pełny snapshot widoku partii po każdej zmianie stanu.
 * `view.stateVersion` = wersja autorytatywna; klient ignoruje starsze eventy.
 */
export interface GameStateViewEvent {
  kind: 'gameStateView';
  roomId: string;
  view: GameStateView;
}

/**
 * Kod błędu przy odrzuceniu komendy (walidacja / nielegalny ruch / stan pokoju).
 * Rozszerzalne — wersja robocza kontraktu.
 */
export type CommandRejectCode =
  | 'protocol_mismatch'
  | 'not_in_room'
  | 'room_full'
  | 'room_not_found'
  | 'not_your_turn'
  | 'illegal_move'
  | 'invalid_phase'
  | 'invalid_payload'
  | 'internal_error';

/**
 * Odrzucenie komendy — stan gry się nie zmienia.
 * UI pokazuje `message` / mapuje `code` na komunikat.
 */
export interface CommandRejectedEvent {
  kind: 'commandRejected';
  code: CommandRejectCode;
  message: string;
  /** Opcjonalnie: która komenda została odrzucona (debug / UX). */
  commandKind?: string;
}

/**
 * Rozbicie punktacji cywilnej (i składowych przy supremacjach — do ekranu wyniku).
 * Pola opcjonalne gdy dany kanał nie dotyczy (np. militarna supremacja bez VP).
 */
export interface PlayerScoreBreakdown {
  playerId: PlayerId;
  total: number;
  blue?: number;
  green?: number;
  yellow?: number;
  purple?: number;
  wonders?: number;
  progress?: number;
  military?: number;
  coins?: number;
}

/**
 * Koniec partii — powód zwycięstwa + punktacja do ekranu wyniku.
 * Może iść razem z ostatnim `GameStateViewEvent` (faza `ended`) albo osobno.
 */
export interface GameEndedEvent {
  kind: 'gameEnded';
  roomId: string;
  result: GameResult;
  scores: PlayerScoreBreakdown[];
}

/**
 * Unia wszystkich eventów serwer → klient.
 */
export type ServerEvent =
  | RoomStateEvent
  | GameStateViewEvent
  | CommandRejectedEvent
  | GameEndedEvent;

/**
 * Koperta wiadomości WS: serwer → klient.
 */
export interface ServerMessage {
  protocolVersion: ProtocolVersion;
  event: ServerEvent;
}
