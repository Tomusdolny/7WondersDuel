import { useSyncExternalStore } from 'react';

export type Screen = 'landing' | 'lobby' | 'game' | 'result';

type UiState = {
  screen: Screen;
};

type Listener = () => void;

let state: UiState = { screen: 'landing' };
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setState(partial: Partial<UiState>) {
  state = { ...state, ...partial };
  emit();
}

export function getUiState(): UiState {
  return state;
}

export function navigate(screen: Screen) {
  setState({ screen });
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUiStore(): UiState {
  return useSyncExternalStore(subscribe, getUiState, getUiState);
}
