export type LogFields = Record<string, string | number | boolean | null | undefined>;

/**
 * Strukturalny log JSON na stdout/stderr.
 * Nie przekazuj `playerToken` ani treści ruchów.
 */
export function log(
  event: string,
  fields: LogFields = {},
  level: 'info' | 'error' = 'info',
): void {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    event,
  };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      entry[key] = value;
    }
  }
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}
