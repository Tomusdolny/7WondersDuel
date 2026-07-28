const ROOM_CODE_KEY = '7ww.roomCode';
const PLAYER_TOKEN_KEY = '7ww.playerToken';

export type GuestSession = {
  roomCode: string;
  playerToken: string;
};

export function getGuestSession(): GuestSession | null {
  const roomCode = localStorage.getItem(ROOM_CODE_KEY);
  const playerToken = localStorage.getItem(PLAYER_TOKEN_KEY);
  if (!roomCode || !playerToken) {
    return null;
  }
  return { roomCode, playerToken };
}

export function setGuestSession(session: GuestSession): void {
  localStorage.setItem(ROOM_CODE_KEY, session.roomCode);
  localStorage.setItem(PLAYER_TOKEN_KEY, session.playerToken);
}

export function clearGuestSession(): void {
  localStorage.removeItem(ROOM_CODE_KEY);
  localStorage.removeItem(PLAYER_TOKEN_KEY);
}
