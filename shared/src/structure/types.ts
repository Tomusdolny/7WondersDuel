import type { CardId } from '../ageCards/types.js';

export type TakenSlot = null;

export interface StructureSlot {
  /** Indeks w layoucie ery (0–19). */
  index: number;
  cardId: CardId;
  faceUp: boolean;
}

/** Slot odkryty — widoczny dla graczy. */
export interface StructureSlotPublic {
  index: number;
  cardId: CardId;
  faceUp: true;
}

/** Slot zasłonięty — bez `cardId`. */
export interface FaceDownSlot {
  index: number;
  faceUp: false;
}

export type Structure = (StructureSlot | TakenSlot)[];

export type StructurePublic = (StructureSlotPublic | FaceDownSlot | TakenSlot)[];

/** Slot w widoku klienta (odkryty lub zakryty; `null` = wzięty). */
export type StructureSlotView = StructureSlotPublic | FaceDownSlot;
