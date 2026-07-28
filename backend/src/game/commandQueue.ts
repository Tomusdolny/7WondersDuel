const tails = new Map<string, Promise<void>>();

/**
 * Serializuje zadania na `roomId` (jedna mutacja stanu naraz).
 * Błąd w tasku jest logowany — kolejka nie blokuje się na stałe.
 */
export function enqueueRoomTask(roomId: string, task: () => void): Promise<void> {
  const previous = tails.get(roomId) ?? Promise.resolve();
  const next = previous
    .then(() => {
      task();
    })
    .catch((err: unknown) => {
      console.error(`[queue] roomId=${roomId}`, err);
    })
    .finally(() => {
      if (tails.get(roomId) === next) {
        tails.delete(roomId);
      }
    });
  tails.set(roomId, next);
  return next;
}
