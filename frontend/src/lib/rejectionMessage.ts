import type { CommandRejectedEvent, ServerErrorCode } from '@7ww/shared';

const FALLBACKS: Partial<Record<ServerErrorCode, string>> = {
  roomNotFound: 'Nie znaleziono pokoju o podanym kodzie.',
  roomFull: 'Pokój jest pełny.',
  invalidToken: 'Sesja wygasła — dołącz ponownie.',
  notInRoom: 'Nie jesteś w pokoju.',
  protocolMismatch: 'Niezgodna wersja protokołu.',
  unknownCommand: 'Nieznana komenda.',
  invalidPayload: 'Nieprawidłowe dane.',
  internalError: 'Błąd serwera.',
  notYourTurn: 'Nie twoja tura.',
  wrongPhase: 'Niedozwolona akcja w tej fazie.',
  slotInaccessible: 'Ten slot jest niedostępny.',
  cannotAfford: 'Nie stać Cię na tę akcję.',
  wonderUnavailable: 'Ten cud jest niedostępny.',
  invalidPlayer: 'Nieprawidłowy gracz.',
  invalidChoice: 'Nieprawidłowy wybór.',
};

export function rejectionMessage(event: CommandRejectedEvent): string {
  return event.message ?? FALLBACKS[event.code] ?? `Błąd: ${event.code}`;
}
