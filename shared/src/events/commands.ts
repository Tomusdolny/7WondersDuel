import type { CardId } from '../ageCards/types.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { WonderId } from '../wonders/types.js';
import type { PlayerId } from '../state/player.js';

/**
 * Aktualna wersja protokołu WS (komendy / eventy).
 * Bump przy breaking change kontraktu — klient i serwer muszą się zgadzać.
 */
export const PROTOCOL_VERSION = 1 as const;

export type ProtocolVersion = typeof PROTOCOL_VERSION;

/**
 * Akcja na wybranej karcie z piramidy (3 opcje tury z reguł podstawowych).
 * Koszt budowy / handlu / monet za discard wylicza silnik na serwerze.
 */
export type TakeCardAction =
  | { kind: 'build' }
  | { kind: 'discard' }
  | { kind: 'buildWonder'; wonderId: WonderId };

/**
 * Utworzenie pokoju (host).
 * Serwer odpowiada `RoomStateEvent` z kodem pokoju i `playerToken`.
 */
export interface CreateRoomCommand {
  kind: 'createRoom';
}

/**
 * Dołączenie do pokoju po kodzie albo reconnect.
 * Ten sam `playerToken` = ta sama tożsamość gracza (reconnect po zerwaniu WS).
 */
export interface JoinRoomCommand {
  kind: 'joinRoom';
  roomCode: string;
  /** Obecny przy reconnect; pomijany przy pierwszym join jako gość. */
  playerToken?: string;
}

/**
 * Wybór cudu w fazie `wonderDraft` (runda 1 lub 2, sekwencja 1-2-2-1).
 */
export interface SelectWonderCommand {
  kind: 'selectWonder';
  wonderId: WonderId;
}

/**
 * Główna akcja tury: wzięcie dostępnej karty ze slotu piramidy
 * i wybór build / discard / buildWonder.
 */
export interface TakeCardCommand {
  kind: 'takeCard';
  /** Indeks slotu w layoucie ery (0–19). */
  slotIndex: number;
  action: TakeCardAction;
}

/**
 * Wybór żetonu Progress — para symboli nauki (z planszy)
 * albo efekt Great Library (`chooseProgressFromBox`).
 */
export interface ChooseProgressTokenCommand {
  kind: 'chooseProgressToken';
  tokenId: ProgressTokenId;
}

/**
 * Odrzucenie brązowej/szarej karty przeciwnika (Zeus / Circus Maximus).
 */
export interface DiscardOpponentCardCommand {
  kind: 'discardOpponentCard';
  cardId: CardId;
}

/**
 * Darmowa budowa karty z discardu gry (Mausoleum).
 * Karty odrzucone przy setupie ery nie wchodzą do discardu.
 */
export interface ConstructFromDiscardCommand {
  kind: 'constructFromDiscard';
  cardId: CardId;
}

/**
 * Wybór gracza zaczynającego kolejną erę
 * (po Erze I/II — zwykle przegrany konfliktu / efekt reguł).
 */
export interface ChooseNextAgeStarterCommand {
  kind: 'chooseNextAgeStarter';
  playerId: PlayerId;
}

/**
 * Unia wszystkich komend klienta → serwer.
 * Część wymaga `roomId` w kopercie (wszystkie oprócz create/join).
 */
export type ClientCommand =
  | CreateRoomCommand
  | JoinRoomCommand
  | SelectWonderCommand
  | TakeCardCommand
  | ChooseProgressTokenCommand
  | DiscardOpponentCardCommand
  | ConstructFromDiscardCommand
  | ChooseNextAgeStarterCommand;

/**
 * Koperta wiadomości WS: klient → serwer.
 * `roomId` wymagane dla komend w trakcie sesji pokoju (nie create/join po kodzie).
 */
export interface ClientMessage {
  protocolVersion: ProtocolVersion;
  /** Identyfikator pokoju po create/join (serwer go zna). */
  roomId?: string;
  command: ClientCommand;
}
