import { useUiStore } from '../store/uiStore';

export function ConnectionBanner() {
  const { connection } = useUiStore();

  switch (connection) {
    case 'connecting':
      return <div role="status">Łączenie…</div>;
    case 'disconnected':
      return <div role="status">Rozłączono — próba ponownego połączenia…</div>;
    case 'waitingForOpponent':
      return <div role="status">Oczekiwanie na przeciwnika…</div>;
    case 'connected':
      return null;
  }
}
