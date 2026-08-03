import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom';
export type TooltipAlign = 'center' | 'start' | 'end';

export function Tooltip({
  content,
  children,
  className,
  fullWidth = false,
  fillParent = false,
  placement = 'top',
  align = 'center',
  clearZoom = false,
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  /** Rozciąga wrapper na 100% szerokości rodzica (np. dla obrazków skalowanych przez CSS %). */
  fullWidth?: boolean;
  /** Wypełnia wysokość i szerokość rodzica (np. markery na torze konfliktu). */
  fillParent?: boolean;
  /** `top` — nad elementem; `bottom` — pod elementem. */
  placement?: TooltipPlacement;
  /** Wyrównanie poziome względem elementu (chroni przed przycięciem krawędzią ekranu). */
  align?: TooltipAlign;
  /**
   * Odstęp od powiększonej karty:
   * `false` — blisko; `true` / `'pyramid'` — duży (piramida); `'summary'` — średni.
   */
  clearZoom?: boolean | 'pyramid' | 'summary';
}) {
  const classes = [
    styles.wrapper,
    fillParent ? styles.fillParent : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const zoomMode =
    clearZoom === true || clearZoom === 'pyramid'
      ? 'pyramid'
      : clearZoom === 'summary'
        ? 'summary'
        : null;
  const placementClass =
    placement === 'bottom'
      ? zoomMode === 'pyramid'
        ? styles.bubbleBottomClearZoom
        : zoomMode === 'summary'
          ? styles.bubbleBottomClearZoomSummary
          : styles.bubbleBottom
      : zoomMode === 'pyramid'
        ? styles.bubbleTopClearZoom
        : zoomMode === 'summary'
          ? styles.bubbleTopClearZoomSummary
          : styles.bubbleTop;
  const alignClass =
    align === 'start'
      ? styles.alignStart
      : align === 'end'
        ? styles.alignEnd
        : styles.alignCenter;
  return (
    <span
      className={classes}
      tabIndex={0}
      style={fullWidth ? { display: 'flex', width: '100%' } : undefined}
    >
      {children}
      <span
        className={`${styles.bubble} ${placementClass} ${alignClass}`}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
