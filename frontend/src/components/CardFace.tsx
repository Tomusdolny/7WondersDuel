import type { Card, CardId } from '@7ww/shared';
import { formatCardCost } from '../lib/cardLookup';
import { Tooltip } from './ui/Tooltip';
import styles from './CardFace.module.css';

type CardFaceSize = 'pyramid' | 'summary';

export function cardImageSrc(cardId: CardId): string {
  return `/images/cards/${cardId}.png`;
}

function CardTooltipContent({ card }: { card: Card }) {
  return (
    <>
      <strong>{card.name}</strong>
      <br />
      Koszt: {formatCardCost(card.cost)}
      <br />
      <em>Opis karty — wkrótce</em>
    </>
  );
}

export function CardFace({
  card,
  size = 'pyramid',
  className,
}: {
  card: Card;
  size?: CardFaceSize;
  className?: string;
}) {
  const sizeClass = size === 'summary' ? styles.summary : styles.pyramid;
  const classes = [styles.card, sizeClass, className].filter(Boolean).join(' ');

  return (
    <Tooltip content={<CardTooltipContent card={card} />}>
      <img
        className={classes}
        src={cardImageSrc(card.id)}
        alt={card.name}
        draggable={false}
      />
    </Tooltip>
  );
}

export function CardBack({
  age,
  className,
}: {
  age: 1 | 2 | 3;
  className?: string;
}) {
  const ageClass =
    age === 1 ? styles.age1 : age === 2 ? styles.age2 : styles.age3;
  const classes = [styles.card, styles.pyramid, styles.back, ageClass, className]
    .filter(Boolean)
    .join(' ');
  return <div className={classes} aria-label="Zakryta karta" />;
}

export function CardFallback({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const classes = [styles.card, styles.pyramid, styles.fallback, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} title={label}>
      {label}
    </div>
  );
}
