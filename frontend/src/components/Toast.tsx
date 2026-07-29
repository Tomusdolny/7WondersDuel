import { useEffect } from 'react';
import { rejectionMessage } from '../lib/rejectionMessage';
import { clearRejection, useUiStore } from '../store/uiStore';
import styles from './Toast.module.css';

const AUTO_DISMISS_MS = 5000;

export function Toast() {
  const { lastRejection, rejectionSeq } = useUiStore();

  useEffect(() => {
    if (!lastRejection) {
      return;
    }
    const timer = setTimeout(() => clearRejection(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [rejectionSeq, lastRejection]);

  if (!lastRejection) {
    return null;
  }

  return (
    <div role="alert" className={styles.toast}>
      <p className={styles.message}>
        {rejectionMessage(lastRejection)} ({lastRejection.code})
      </p>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => clearRejection()}
      >
        Zamknij
      </button>
    </div>
  );
}
