import type { WonderCard, WonderId } from '@7ww/shared';
import { formatResourceCost } from '../lib/cardLookup';
import {
  Tooltip,
  type TooltipAlign,
  type TooltipPlacement,
} from './ui/Tooltip';
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
      <em>{wonder.description}</em>
    </>
  );
}

export function WonderFace({
  wonder,
  size = 'board',
  built = false,
  className,
  tooltipPlacement,
  tooltipAlign,
}: {
  wonder: WonderCard;
  size?: WonderFaceSize;
  built?: boolean;
  className?: string;
  tooltipPlacement?: TooltipPlacement;
  tooltipAlign?: TooltipAlign;
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
      placement={tooltipPlacement}
      align={tooltipAlign}
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
