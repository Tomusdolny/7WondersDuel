import type { ProgressToken, ProgressTokenId } from '@7ww/shared';
import styles from './ProgressTokenFace.module.css';

type ProgressTokenFaceSize = 'board' | 'player' | 'choice';

export function progressTokenImageSrc(tokenId: ProgressTokenId): string {
  return `/images/progress-tokens/${tokenId}.png`;
}

export function ProgressTokenFace({
  token,
  size = 'board',
  className,
}: {
  token: ProgressToken;
  size?: ProgressTokenFaceSize;
  className?: string;
}) {
  const sizeClass =
    size === 'player'
      ? styles.player
      : size === 'choice'
        ? styles.choice
        : styles.board;
  const classes = [styles.token, sizeClass, className].filter(Boolean).join(' ');

  return (
    <img
      className={classes}
      src={progressTokenImageSrc(token.id)}
      alt={token.name}
      title={token.name}
      draggable={false}
    />
  );
}
