export const CARD_COLOR_HEX: Record<string, string> = {
  brown: '#8b5e34',
  grey: '#8f96a3',
  blue: '#3d6fa8',
  green: '#4a8f5c',
  yellow: '#d9b03c',
  red: '#b5432f',
  purple: '#7a4a8f',
};

export function cardColorHex(color: string | undefined): string {
  return CARD_COLOR_HEX[color ?? ''] ?? '#a89f8f';
}
