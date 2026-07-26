export type Resource = 'wood' | 'stone' | 'clay' | 'glass' | 'papyrus';

export const RESOURCES = ['wood', 'stone', 'clay', 'glass', 'papyrus'] as const satisfies readonly Resource[];

export type ScienceSymbol =
  | 'writing'
  | 'wheel'
  | 'math'
  | 'chemistry'
  | 'sundial'
  | 'astronomy'
  | 'law';