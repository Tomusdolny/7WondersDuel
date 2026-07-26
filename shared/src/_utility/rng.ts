/** Generator losowości wstrzykiwany do setupu (testy: stub deterministyczny). */
export type Rng = {
  shuffle<T>(items: readonly T[]): T[];
};

/** Fisher–Yates na kopii tablicy; `random` ∈ [0, 1). */
export function createMathRng(random: () => number = Math.random): Rng {
  return {
    shuffle<T>(items: readonly T[]): T[] {
      const next = [...items];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        const a = next[i]!;
        next[i] = next[j]!;
        next[j] = a;
      }
      return next;
    },
  };
}
