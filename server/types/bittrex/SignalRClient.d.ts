/**
 * Wrapper for javascript Bittrex websocket client library
 * */
export interface SignalRClient {
  subscribeToMarkets(markets: string[]): void

  on(event: string, callback: (data: any) => void): void
}
