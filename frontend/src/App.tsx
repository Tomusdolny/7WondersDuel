import { useUiStore } from './store/uiStore';
import { LandingScreen } from './screens/LandingScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';

export function App() {
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
