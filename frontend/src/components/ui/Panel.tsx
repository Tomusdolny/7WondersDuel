import type { HTMLAttributes } from 'react';
import styles from './Panel.module.css';

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div' | 'article';
  compact?: boolean;
};

export function Panel({
  as: Tag = 'section',
  compact = false,
  className,
  ...rest
}: PanelProps) {
  const classes = [styles.panel, compact ? styles.compact : null, className]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes} {...rest} />;
}
