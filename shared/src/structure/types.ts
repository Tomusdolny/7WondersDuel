import { CardId } from "../ageCards/types.js";

export type TakenSlot = null;

export interface StructureSlot {
  /** Indeks w layoucie ery (0–19). */
  index: number;
  cardId: CardId;
  faceUp: boolean;
}