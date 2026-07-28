import { useState } from 'react';
import type {
  LegalSlotAction,
  PlayerState,
  StructureSlotView,
  TakenSlot,
} from '@7ww/shared';
import { getDiscardCoins } from '@7ww/shared';
import { sendCommand } from '../store/uiStore';
import { findCard, findWonder, formatCardCost } from '../lib/cardLookup';

function actionLabel(
  action: LegalSlotAction['action'],
  coinsCost: number,
  viewer: PlayerState | null,
): string {
  switch (action.kind) {
    case 'build':
      return coinsCost > 0
        ? `Zbuduj — koszt: ${coinsCost} monet`
        : 'Zbuduj — darmowa';
    case 'discard': {
      const gain = viewer ? getDiscardCoins(viewer) : 2;
      return `Odrzuć za ${gain} monet`;
    }
    case 'buildWonder': {
      const wonder = findWonder(action.wonderId);
      const name = wonder?.name ?? action.wonderId;
      return coinsCost > 0
        ? `Zbuduj cud: ${name} — koszt: ${coinsCost} monet`
        : `Zbuduj cud: ${name}`;
    }
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

function SlotActions({
  slotIndex,
  actions,
  viewer,
  onClose,
}: {
  slotIndex: number;
  actions: LegalSlotAction[];
  viewer: PlayerState | null;
  onClose: () => void;
}) {
  return (
    <div>
      <ul>
        {actions.map((legal, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => {
                sendCommand({
                  kind: 'takeCard',
                  slotIndex,
                  action: legal.action,
                });
                onClose();
              }}
            >
              {actionLabel(legal.action, legal.coinsCost, viewer)}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClose}>
        Anuluj
      </button>
    </div>
  );
}

export function StructurePyramid({
  structure,
  availableSlots,
  legalActions,
  isMyTurn,
  viewer,
}: {
  structure: (StructureSlotView | TakenSlot)[];
  availableSlots: number[];
  legalActions: Record<number, LegalSlotAction[]>;
  isMyTurn: boolean;
  viewer: PlayerState | null;
}) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  return (
    <section>
      <h2>Piramida</h2>
      <ul>
        {structure.map((slot, index) => {
          if (slot === null) {
            return <li key={index}>slot {index}: wzięty</li>;
          }
          const isAvailable = availableSlots.includes(slot.index);
          const actions = legalActions[slot.index];
          const card = slot.faceUp ? findCard(slot.cardId) : undefined;

          return (
            <li key={index}>
              slot {slot.index}:{' '}
              {slot.faceUp
                ? `${card?.name ?? slot.cardId} (koszt: ${
                    card ? formatCardCost(card.cost) : '?'
                  })`
                : 'zakryta karta'}
              {isAvailable && isMyTurn && actions ? (
                <button type="button" onClick={() => setOpenSlot(slot.index)}>
                  Wybierz
                </button>
              ) : null}
              {openSlot === slot.index && actions ? (
                <SlotActions
                  slotIndex={slot.index}
                  actions={actions}
                  viewer={viewer}
                  onClose={() => setOpenSlot(null)}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
