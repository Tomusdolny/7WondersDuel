type Listener = (event: { data?: unknown }) => void;

/**
 * Minimalny mock `WebSocket` do testów — bez realnej sieci.
 * Testy sterują cyklem życia przez `simulateOpen` / `simulateMessage` / `simulateClose`.
 */
export class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  static instances: MockWebSocket[] = [];

  readonly url: string;
  readyState = MockWebSocket.CONNECTING;
  readonly sentMessages: string[] = [];
  private readonly listeners = new Map<string, Listener[]>();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: Listener): void {
    const existing = this.listeners.get(type) ?? [];
    existing.push(listener);
    this.listeners.set(type, existing);
  }

  removeEventListener(type: string, listener: Listener): void {
    const existing = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      existing.filter((registered) => registered !== listener),
    );
  }

  send(data: string): void {
    this.sentMessages.push(data);
  }

  close(): void {
    this.simulateClose();
  }

  private emit(type: string, event: { data?: unknown }): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }

  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.emit('open', {});
  }

  simulateMessage(data: unknown): void {
    this.emit('message', { data });
  }

  simulateClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.emit('close', {});
  }

  simulateError(): void {
    this.emit('error', {});
  }
}
