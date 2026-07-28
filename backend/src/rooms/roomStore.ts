import type { Room } from './types.js';

const roomsById = new Map<string, Room>();
const roomsByCode = new Map<string, Room>();
/** connectionId → roomId */
const connectionRoom = new Map<number, string>();

export const roomStore = {
  size(): number {
    return roomsById.size;
  },

  getById(roomId: string): Room | undefined {
    return roomsById.get(roomId);
  },

  getByCode(code: string): Room | undefined {
    return roomsByCode.get(code);
  },

  getRoomForConnection(connectionId: number): Room | undefined {
    const roomId = connectionRoom.get(connectionId);
    return roomId !== undefined ? roomsById.get(roomId) : undefined;
  },

  add(room: Room): void {
    roomsById.set(room.id, room);
    roomsByCode.set(room.code, room);
  },

  remove(roomId: string): Room | undefined {
    const room = roomsById.get(roomId);
    if (!room) return undefined;
    for (const seat of room.seats) {
      if (seat.connectionId !== null) {
        connectionRoom.delete(seat.connectionId);
        seat.connectionId = null;
      }
    }
    roomsById.delete(room.id);
    roomsByCode.delete(room.code);
    return room;
  },

  bindConnection(connectionId: number, roomId: string): void {
    connectionRoom.set(connectionId, roomId);
  },

  unbindConnection(connectionId: number): void {
    connectionRoom.delete(connectionId);
  },

  /** Tylko do testów / smoke. */
  clear(): void {
    roomsById.clear();
    roomsByCode.clear();
    connectionRoom.clear();
  },
};
