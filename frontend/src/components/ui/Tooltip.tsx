import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';

export function Tooltip({
  content,
  children,
  className,
  fullWidth = false,
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  /** Rozciąga wrapper na 100% szerokości rodzica (np. dla obrazków skalowanych przez CSS %). */
  fullWidth?: boolean;
}) {
  const classes = [styles.wrapper, className].filter(Boolean).join(' ');
  return (
    <span
      className={classes}
      tabIndex={0}
      style={fullWidth ? { display: 'flex', width: '100%' } : undefined}
    >
      {children}
      <span className={styles.bubble} role="tooltip">
        {content}
      </span>
    </span>
  );
}
