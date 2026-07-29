import { useUiStore } from '../store/uiStore';
import styles from './ConnectionBanner.module.css';

export function ConnectionBanner() {
  const { connection } = useUiStore();

  switch (connection) {
    case 'connecting':
      return (
        <div role="status" className={`${styles.banner} ${styles.connecting}`}>
          Łączenie…
        </div>
      );
    case 'disconnected':
      return (
        <div role="status" className={`${styles.banner} ${styles.disconnected}`}>
          Rozłączono — próba ponownego połączenia…
        </div>
      );
    case 'waitingForOpponent':
      return (
        <div
          role="status"
          className={`${styles.banner} ${styles.waitingForOpponent}`}
        >
          Oczekiwanie na przeciwnika…
        </div>
      );
    case 'connected':
      return null;
  }
}
