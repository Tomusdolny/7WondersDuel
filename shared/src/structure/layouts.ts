import type { Age } from '../ageCards/types.js';

export const STRUCTURE_SIZE = 20;

/** [O]/[Z] wg schematu ery — indeksy 0–19, rzędy od góry, L→P. */
export const INITIAL_FACE_UP: Record<Age, readonly boolean[]> = {
  1: [
    // 2+3+4+5+6
    true, true,
    false, false, false,
    true, true, true, true,
    false, false, false, false, false,
    true, true, true, true, true, true,
  ],
  2: [
    // 6+5+4+3+2
    true, true, true, true, true, true,
    false, false, false, false, false,
    true, true, true, true,
    false, false, false,
    true, true,
  ],
  3: [
    // 2+3+4+2+4+3+2
    true, true,
    false, false, false,
    true, true, true, true,
    false, false,
    true, true, true, true,
    false, false, false,
    true, true,
  ],
};

/**
 * Dla każdego slotu: indeksy kart w rzędzie powyżej, które ten slot przykrywa (≤2).
 * Kształty struktur Er I–III są stałe.
 */
export const COVERS: Record<Age, readonly (readonly number[])[]> = {
  // Era I — piramida 2+3+4+5+6 (dolny rząd ma o 1 więcej)
  1: [
    [], [],
    [0], [0, 1], [1],
    [2], [2, 3], [3, 4], [4],
    [5], [5, 6], [6, 7], [7, 8], [8],
    [9], [9, 10], [10, 11], [11, 12], [12, 13], [13],
  ],
  // Era II — odwrócona 6+5+4+3+2 (dolny rząd ma o 1 mniej)
  2: [
    [], [], [], [], [], [],
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [6, 7], [7, 8], [8, 9], [9, 10],
    [11, 12], [12, 13], [13, 14],
    [15, 16], [16, 17],
  ],
  // Era III — 2+3+4+2+4+3+2 (środek z luką)
  3: [
    [], [],
    [0], [0, 1], [1],
    [2], [2, 3], [3, 4], [4],
    [5, 6], [7, 8],
    [9], [9], [10], [10],
    [11, 12], [12, 13], [13, 14],
    [15, 16], [16, 17],
  ],
};

/**
 * Odwrotność `COVERS`: dla każdego slotu — które sloty go przykrywają.
 * Potrzebne przy `revealAfterTake`, żeby sprawdzić, czy kandydat jest już w pełni odsłonięty.
 */
export const COVERED_BY: Record<Age, readonly (readonly number[])[]> = {
  1: invertCovers(COVERS[1]),
  2: invertCovers(COVERS[2]),
  3: invertCovers(COVERS[3]),
};

/** Buduje mapę „kto mnie przykrywa” z mapy „kogo przykrywam”. */
function invertCovers(covers: readonly (readonly number[])[]): (readonly number[])[] {
  const coveredBy: number[][] = Array.from({ length: STRUCTURE_SIZE }, () => []);
  for (let from = 0; from < covers.length; from++) {
    for (const to of covers[from] ?? []) {
      coveredBy[to]!.push(from);
    }
  }
  return coveredBy;
}
