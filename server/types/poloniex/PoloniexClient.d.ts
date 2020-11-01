/**
 * Wrapper for javascript Poloniex websocket client library
 * */
export interface PoloniexClient {
  subscribe(markets: string): void;
  on(event: string, callback: (channelName: string, data: any, seq: number) => void): void;

  openWebSocket(): void;
}
