import { useEffect, useRef, useState } from 'react';
import type {
  Age,
  LegalSlotAction,
  PlayerState,
  StructureSlotView,
  TakenSlot,
} from '@7ww/shared';
import { getDiscardCoins } from '@7ww/shared';
import { sendCommand } from '../store/uiStore';
import { findCard, findWonder } from '../lib/cardLookup';
import { PLAYER_COLOR_HEX } from '../lib/playerColors';
import { Button } from './ui/Button';
import { CardBack, CardFace, CardFallback } from './CardFace';
import styles from './StructurePyramid.module.css';

/** Liczba slotów w kolejnych rzędach (góra → dół), zgodna z layouts.ts. */
export const STRUCTURE_ROWS: Record<Age, readonly number[]> = {
  1: [2, 3, 4, 5, 6],
  2: [6, 5, 4, 3, 2],
  3: [2, 3, 4, 2, 4, 3, 2],
};

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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.actions} role="menu" ref={rootRef}>
      <span className={styles.actionsArrow} aria-hidden />
      <ul className={styles.actionsList}>
        {actions.map((legal, index) => (
          <li key={index} role="none">
            <Button
              type="button"
              role="menuitem"
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

function buildRows(
  age: Age,
  structure: (StructureSlotView | TakenSlot)[],
): { startIndex: number; count: number; gap: boolean }[] {
  const counts = STRUCTURE_ROWS[age];
  let offset = 0;
  return counts.map((count, rowIndex) => {
    const startIndex = offset;
    offset += count;
    // Era 3, rząd 4 (index 3): dwa sloty z luką w środku
    const gap = age === 3 && rowIndex === 3;
    return { startIndex, count, gap };
  });
}

export function StructurePyramid({
  age,
  structure,
  availableSlots,
  legalActions,
  isMyTurn,
  viewer,
}: {
  age: Age;
  structure: (StructureSlotView | TakenSlot)[];
  availableSlots: number[];
  legalActions: Record<number, LegalSlotAction[]>;
  isMyTurn: boolean;
  viewer: PlayerState | null;
}) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const rowCounts = STRUCTURE_ROWS[age];
  const rows = rowCounts
    ? buildRows(age, structure)
    : [];
  const openRowIndex =
    openSlot === null
      ? null
      : rows.findIndex(
          (row) => openSlot >= row.startIndex && openSlot < row.startIndex + row.count,
        );

  const borderColor = viewer ? PLAYER_COLOR_HEX[viewer.color] : undefined;

  return (
    <section className={styles.board} style={borderColor ? { borderColor } : undefined}>
      <h2 className={styles.title}>Piramida — era {age}</h2>
      {!rowCounts ? (
        <p className={styles.empty}>Nieznana era: {String(age)}</p>
      ) : structure.length === 0 ? (
        <p className={styles.empty}>
          Brak kart w strukturze (faza draftu lub setup).
        </p>
      ) : (
        <div className={styles.pyramid}>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${styles.row} ${row.gap ? styles.rowGap : ''}`}
              style={{
                zIndex:
                  rowIndex === openRowIndex ? rows.length + 10 : rowIndex + 1,
              }}
            >
              {Array.from({ length: row.count }, (_, col) => {
                const index = row.startIndex + col;
                const slot = structure[index];

                if (slot === undefined || slot === null) {
                  return (
                    <div
                      key={index}
                      className={`${styles.slot} ${styles.slotTaken}`}
                    />
                  );
                }

                const isAvailable = availableSlots.includes(slot.index);
                const actions = legalActions[slot.index];
                const card =
                  slot.faceUp && 'cardId' in slot
                    ? findCard(slot.cardId)
                    : undefined;

                return (
                  <div
                    key={index}
                    className={`${styles.slot} ${
                      isAvailable ? styles.slotAvailable : ''
                    }`}
                  >
                    {!slot.faceUp ? (
                      <CardBack age={age} />
                    ) : card ? (
                      <CardFace card={card} size="pyramid" />
                    ) : (
                      <CardFallback
                        label={
                          'cardId' in slot ? slot.cardId : `slot ${index}`
                        }
                      />
                    )}
                    {isAvailable && isMyTurn && actions ? (
                      <div className={styles.pickButtonWrapper}>
                        <Button
                          type="button"
                          variant="secondary"
                          className={styles.pickButton}
                          onClick={() => setOpenSlot(slot.index)}
                        >
                          Wybierz
                        </Button>
                      </div>
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
          ))}
        </div>
      )}
    </section>
  );
}
