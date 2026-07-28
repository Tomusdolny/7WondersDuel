import { useEffect } from 'react';
import { rejectionMessage } from '../lib/rejectionMessage';
import { clearRejection, useUiStore } from '../store/uiStore';

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
    <div role="alert">
      <p>
        {rejectionMessage(lastRejection)} ({lastRejection.code})
      </p>
      <button type="button" onClick={() => clearRejection()}>
        Zamknij
      </button>
    </div>
  );
}
