import type { PlayerColor } from '@7ww/shared';

/** Wartości hex do użycia tam, gdzie nie da się użyć zmiennych CSS (np. gradienty inline). */
export const PLAYER_COLOR_HEX: Record<PlayerColor, string> = {
  orange: '#c96a3f',
  blue: '#2b6f77',
};

export const PLAYER_COLOR_LABEL: Record<PlayerColor, string> = {
  orange: 'pomarańczowy',
  blue: 'niebieski',
};
