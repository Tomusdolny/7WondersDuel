import type { Age, CardId } from '../ageCards/types.js';
import type { PlayerId, PlayerState } from './player.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { WonderId } from '../wonders/types.js';
import type { ConflictPosition } from '../militaryTokens/types.js';
import type { MilitaryToken } from '../militaryTokens/types.js';
import type { Structure, StructurePublic } from '../structure/types.js';

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
      /** Runda 1 (ABBA) lub 2 (BAAB). */
      round: 1 | 2;
      /** Cuda jeszcze niewyłożone do `offered` (po starcie: 8). */
      remaining: WonderId[];
    }
  | { kind: 'playing' }
  | {
      kind: 'awaitingEffectChoice';
      choice: EffectPendingChoice;
      /** Po wyborze: dodatkowa tura (cud / Theology), inaczej oddaj turę. */
      keepTurn: boolean;
    }
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

  /** Piramida bieżącej ery (tylko niewzięte karty). Budowana przez `setupAge` / `buildStructure`. */
  structure: Structure;

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

/**
 * Widok stanu dla klientów: jak `GameState`, ale piramida bez `cardId`
 * na slotach face-down.
 */
export type GameStateView = Omit<GameState, 'structure'> & {
  structure: StructurePublic;
};
