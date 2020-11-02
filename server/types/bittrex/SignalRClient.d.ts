/**
 * Javascript Bittrex websocket client library
 * */
export interface BittrexClient {
  subscribeToMarkets(markets: string[]): void

  on(event: string, callback: (data: any) => void): void
}
