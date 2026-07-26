import { useState } from 'react';
import type { LegalSlotAction, StructureSlotView, TakenSlot } from '@7ww/shared';
import { sendCommand } from '../store/uiStore';
import { findCard, formatCardCost } from '../lib/cardLookup';

function actionLabel(action: LegalSlotAction['action']): string {
  switch (action.kind) {
    case 'build':
      return 'Zbuduj';
    case 'discard':
      return 'Odrzuć za monety';
    case 'buildWonder':
      return 'Zbuduj cud';
  }
}

function SlotActions({
  slotIndex,
  actions,
  onClose,
}: {
  slotIndex: number;
  actions: LegalSlotAction[];
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
              {actionLabel(legal.action)} — koszt: {legal.coinsCost} monet
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
}: {
  structure: (StructureSlotView | TakenSlot)[];
  availableSlots: number[];
  legalActions: Record<number, LegalSlotAction[]>;
  isMyTurn: boolean;
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
