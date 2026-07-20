import type { Age, CardId } from '../ageCards/types';
import type { PlayerId, PlayerState } from './player';
import type { ProgressTokenId } from '../progressTokens/types';
import type { WonderId } from '../wonders/types';
import type { ConflictPosition } from '../militaryTokens/types';
import type { MilitaryToken } from '../militaryTokens/types';

/**
 * Slot w piramidzie ery (20 kart).
 * Dostępność (nieprzykryta) i odkrywanie face-down wylicza silnik z layoutu ery + pozostałych slotów.
 */
export interface StructureSlot {
  /** Indeks w layoucie ery (0–19). */
  index: number;
  cardId: CardId;
  faceUp: boolean;
}

export type GameResult =
  | { kind: 'military'; winnerId: PlayerId }
  | { kind: 'science'; winnerId: PlayerId }
  | { kind: 'civilian'; winnerId: PlayerId | 'tie'; scores: Record<PlayerId, number> };

/**
 * Wybór wymuszony efektem / regułą — gra czeka na decyzję `activePlayerId`
 * (lub wskazanego gracza, np. kto zaczyna kolejną erę).
 */
export type EffectPendingChoice =
  | { kind: 'chooseProgressToken'; options: ProgressTokenId[] }
  | { kind: 'discardOpponentCard'; color: 'brown' | 'grey' }
  | { kind: 'constructFromDiscard' }
  | { kind: 'chooseProgressFromBox'; options: ProgressTokenId[]; keep: number }
  | { kind: 'chooseNextAgeStarter'; chooserId: PlayerId };

export type GamePhase =
  | { kind: 'wonderDraft';
      /** Pozostałe cuda do wyboru w bieżącej rundzie draftu. */
      offered: WonderId[];
      /** Runda 1 lub 2 (każda: 4 cuda, sekwencja 1-2-2-1 / odwrotna). */
      round: 1 | 2;
    }
  | { kind: 'playing' }
  | { kind: 'awaitingEffectChoice'; choice: EffectPendingChoice }
  | { kind: 'ended'; result: GameResult };

/**
 * Persystowany stan partii.
 *
 * Świadomie NIE trzymamy tu:
 * - VP na bieżąco — wyliczane przy końcu / UI
 * - legalnych ruchów / dostępnych kart — z layoutu + StructureSlot
 * - produkcji / cen handlu — z miast graczy
 * - kart odrzuconych przy setupie ery — nie wchodzą do discardu gry
 */
export interface GameState {
  /** Do synchronizacji WS / idempotencji. */
  version: number;

  phase: GamePhase;
  age: Age;
  activePlayerId: PlayerId;

  players: readonly [PlayerState, PlayerState];

  /** Piramida bieżącej ery (tylko niewzięte karty). */
  // TODO: Move it to its own file and add a function to build the structure from the age number
  // TODO: Also automate it -> add a function to reveal cards after pick up
  structure: StructureSlot[];

  /** Discard gry (budynki odrzucone za monety / efektami w trakcie partii). */
  /** NEEDED */
  discard: CardId[];

  /** 5 żetonów Progress dostępnych na planszy. */
  progressOnBoard: ProgressTokenId[];

  /**
   * Żetony Progress odłożone przy setupie (5 z 10).
   * Potrzebne m.in. do efektu Great Library.
   */
  progressInBox: ProgressTokenId[];

  /** Pozycja pionka konfliktu. */
  /** Liczba naturalna pomiędzy -10 a 10 */
  conflictPosition: ConflictPosition;

  /** Żetony militarne jeszcze leżące na torze. */
  militaryTokens: MilitaryToken[];

  /**
   * Łączna liczba zbudowanych cudów w partii (limit 7).
   * Po 7. cudzie ostatni niezbudowany wraca do pudełka.
   */
  wondersBuiltTotal: number;
}
