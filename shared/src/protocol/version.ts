/** Wersja kontraktu WS — bump przy breaking change. */
export const PROTOCOL_VERSION = 1 as const;

export type ProtocolVersion = typeof PROTOCOL_VERSION;
