import type { PlayerId } from '@7ww/shared';

export function playerLabel(
  id: PlayerId,
  viewerId: PlayerId | null,
): string {
  return id === viewerId ? 'Ty' : 'Przeciwnik';
}
