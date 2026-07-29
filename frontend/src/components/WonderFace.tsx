import type { WonderCard, WonderId } from '@7ww/shared';
import styles from './WonderFace.module.css';

type WonderFaceSize = 'board' | 'draft' | 'summary';

export function wonderImageSrc(wonderId: WonderId): string {
  return `/images/wonders/${wonderId}.png`;
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
    <img
      className={classes}
      src={wonderImageSrc(wonder.id)}
      alt={wonder.name}
      title={wonder.name}
      draggable={false}
    />
  );
}
