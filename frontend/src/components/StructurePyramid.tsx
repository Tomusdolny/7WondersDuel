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
import { Button } from './ui/Button';
import { Panel } from './ui/Panel';
import styles from './StructurePyramid.module.css';

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
    <div className={styles.actions}>
      <ul className={styles.actionsList}>
        {actions.map((legal, index) => (
          <li key={index}>
            <Button
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
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="ghost" onClick={onClose}>
        Anuluj
      </Button>
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
    <Panel>
      <h2>Piramida</h2>
      <div className={styles.grid}>
        {structure.map((slot, index) => {
          if (slot === null) {
            return (
              <div key={index} className={`${styles.slot} ${styles.slotTaken}`}>
                wzięty
              </div>
            );
          }
          const isAvailable = availableSlots.includes(slot.index);
          const actions = legalActions[slot.index];
          const card = slot.faceUp ? findCard(slot.cardId) : undefined;

          const slotClasses = [
            styles.slot,
            !slot.faceUp ? styles.slotFaceDown : null,
            isAvailable ? styles.slotAvailable : null,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={index} className={slotClasses}>
              {slot.faceUp ? (
                <>
                  <span className={styles.cardName}>
                    {card?.name ?? slot.cardId}
                  </span>
                  <span className={styles.cardCost}>
                    koszt: {card ? formatCardCost(card.cost) : '?'}
                  </span>
                </>
              ) : (
                <span className={styles.cardName}>zakryta karta</span>
              )}
              {isAvailable && isMyTurn && actions ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpenSlot(slot.index)}
                >
                  Wybierz
                </Button>
              ) : null}
              {openSlot === slot.index && actions ? (
                <SlotActions
                  slotIndex={slot.index}
                  actions={actions}
                  viewer={viewer}
                  onClose={() => setOpenSlot(null)}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
