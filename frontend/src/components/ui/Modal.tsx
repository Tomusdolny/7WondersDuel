import { useEffect } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Panel } from './Panel';
import styles from './Modal.module.css';

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Panel as="div" className={styles.panel} onClick={stopPropagation}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Zamknij"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </Panel>
    </div>
  );
}
