import type { ProgressToken, ProgressTokenId } from '@7ww/shared';
import {
  Tooltip,
  type TooltipAlign,
  type TooltipPlacement,
} from './ui/Tooltip';
import styles from './ProgressTokenFace.module.css';

type ProgressTokenFaceSize = 'board' | 'player' | 'choice';

export function progressTokenImageSrc(tokenId: ProgressTokenId): string {
  return `/images/progress-tokens/${tokenId}.png`;
}

function ProgressTokenTooltipContent({ token }: { token: ProgressToken }) {
  return (
    <>
      <strong>{token.name}</strong>
      <br />
      <em>{token.description}</em>
    </>
  );
}

export function ProgressTokenFace({
  token,
  size = 'board',
  className,
  tooltipPlacement,
  tooltipAlign,
}: {
  token: ProgressToken;
  size?: ProgressTokenFaceSize;
  className?: string;
  tooltipPlacement?: TooltipPlacement;
  tooltipAlign?: TooltipAlign;
}) {
  const sizeClass =
    size === 'player'
      ? styles.player
      : size === 'choice'
        ? styles.choice
        : styles.board;
  const classes = [styles.token, sizeClass, className].filter(Boolean).join(' ');

  return (
    <Tooltip
      content={<ProgressTokenTooltipContent token={token} />}
      placement={tooltipPlacement}
      align={tooltipAlign}
    >
      <img
        className={classes}
        src={progressTokenImageSrc(token.id)}
        alt={token.name}
        draggable={false}
      />
    </Tooltip>
  );
}
