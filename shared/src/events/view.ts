import type { Age, CardId } from '../ageCards/types.js';
import type { ProgressTokenId } from '../progressTokens/types.js';
import type { WonderId } from '../wonders/types.js';
import type { ConflictPosition, MilitaryToken } from '../militaryTokens/types.js';
import type { PlayerId, PlayerState } from '../state/player.js';
import type { EffectPendingChoice, GamePhase, TakenSlot } from '../state/game.js';
import type { TakeCardAction } from './commands.js';

/**
 * Slot piramidy widoczny dla klienta.
 * Face-down: bez `cardId` — klient nie zna ukrytej karty (masking).
 * Face-up / taken: jak w `GameState`, z pełnym `cardId` gdy odkryta.
 */
export type StructureSlotView =
  | { index: number; faceUp: true; cardId: CardId }
  | { index: number; faceUp: false };

/**
 * Jedna legalna akcja na danym slocie, z kosztem w monetach
 * (0 = darmowa / łańcuch / brak handlu). Serwer wylicza — klient nie duplikuje silnika.
 */
export interface LegalSlotAction {
  action: TakeCardAction;
  /** Monety do zapłaty teraz (handel + koszt monetowy karty, albo zysk z discard). */
  coinsCost: number;
}

/**
 * Perspektywa gracza na stan partii (`toPlayerView` po stronie serwera).
 *
 * Jawne w Duel: miasta, monety, tor, żetony Progress na planszy, zbudowane cuda.
 * Ukryte: `cardId` slotów face-down w piramidzie; `progressInBox` (poza Great Library).
 *
 * Pola `availableSlots` / `legalActions` — podświetlenia UI i feedback reguł.
 */
export interface GameStateView {
  /** = `GameState.version` — klient odrzuca starsze snapshoty. */
  stateVersion: number;

  /** Id odbiorcy tego widoku (perspektywa). */
  viewerId: PlayerId;

  phase: GamePhase;
  age: Age;
  activePlayerId: PlayerId;

  players: readonly [PlayerState, PlayerState];

  /** Piramida z maskowaniem face-down; `null` = wzięty slot. */
  structure: (StructureSlotView | TakenSlot)[];

  discard: CardId[];

  progressOnBoard: ProgressTokenId[];

  /**
   * Żetony w pudełku — zwykle ukryte.
   * Ujawniane tylko gdy faza wymaga wyboru z pudełka (Great Library).
   */
  progressInBox?: ProgressTokenId[];

  conflictPosition: ConflictPosition;
  militaryTokens: MilitaryToken[];
  wondersBuiltTotal: number;

  /** Indeksy slotów nieprzykrytych (do kliknięcia). */
  availableSlots: number[];

  /**
   * Legalne akcje per slot (tylko gdy to tura `viewerId` i faza `playing`).
   * Klucz = `slotIndex`.
   */
  legalActions: Record<number, LegalSlotAction[]>;

  /**
   * Opcjonalne: cuda jeszcze do wyboru w draftcie — kopia z fazy,
   * tu dla wygody UI (można czytać z `phase`).
   */
  offeredWonders?: WonderId[];

  /** Opcjonalne: bieżący wybór efektu — kopia z fazy dla UI. */
  pendingChoice?: EffectPendingChoice;
}
