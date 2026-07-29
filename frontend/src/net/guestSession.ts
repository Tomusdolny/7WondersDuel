const ROOM_CODE_KEY = '7ww.roomCode';
const PLAYER_TOKEN_KEY = '7ww.playerToken';
const NICKNAME_KEY = '7ww.nickname';

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

export function getStoredNickname(): string | null {
  const nickname = localStorage.getItem(NICKNAME_KEY);
  return nickname && nickname.trim() ? nickname.trim() : null;
}

export function setStoredNickname(nickname: string): void {
  localStorage.setItem(NICKNAME_KEY, nickname.trim());
}
