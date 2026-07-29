import type { WonderCard, WonderId } from '@7ww/shared';
import { formatResourceCost } from '../lib/cardLookup';
import { Tooltip } from './ui/Tooltip';
import styles from './WonderFace.module.css';

type WonderFaceSize = 'board' | 'draft' | 'summary';

export function wonderImageSrc(wonderId: WonderId): string {
  return `/images/wonders/${wonderId}.png`;
}

function WonderTooltipContent({ wonder }: { wonder: WonderCard }) {
  return (
    <>
      <strong>{wonder.name}</strong>
      <br />
      Koszt: {formatResourceCost(wonder.cost)}
      <br />
      <em>Opis cudu — wkrótce</em>
    </>
  );
}

export function WonderFace({
  wonder,
  size = 'board',
  built = false,
  className,
}: {
  wonder: WonderCard;
  size?: WonderFaceSize;
  built?: boolean;
  className?: string;
}) {
  const sizeClass =
    size === 'draft'
      ? styles.draft
      : size === 'summary'
        ? styles.summary
        : styles.board;
  const classes = [
    styles.wonder,
    sizeClass,
    built ? styles.built : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tooltip
      content={<WonderTooltipContent wonder={wonder} />}
      fullWidth={size === 'board'}
    >
      <img
        className={classes}
        src={wonderImageSrc(wonder.id)}
        alt={wonder.name}
        draggable={false}
      />
    </Tooltip>
  );
}
