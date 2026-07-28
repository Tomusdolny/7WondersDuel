import { useEffect } from 'react';
import { initClient, useUiStore } from './store/uiStore';
import { LandingScreen } from './screens/LandingScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ConnectionBanner } from './components/ConnectionBanner';
import { Toast } from './components/Toast';

function CurrentScreen() {
  const { screen } = useUiStore();

  switch (screen) {
    case 'landing':
      return <LandingScreen />;
    case 'lobby':
      return <LobbyScreen />;
    case 'game':
      return <GameScreen />;
    case 'result':
      return <ResultScreen />;
  }
}

export function App() {
  useEffect(() => {
    try {
      initClient();
    } catch (error) {
      console.error('Nie udało się zainicjalizować klienta WS', error);
    }
  }, []);

  return (
    <>
      <ConnectionBanner />
      <Toast />
      <CurrentScreen />
    </>
  );
}
