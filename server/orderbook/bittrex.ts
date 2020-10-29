import {OrderBook} from "./OrderBook";

const BittrexClient = require('bittrex-signalr-client');

interface SignalRClient {
  subscribeToMarkets(markets: string[]): void

  on(event: string, callback: EventCallback): void
}

interface EventCallback {
  (data: any): void
}

export class Bittrex {
  private client: SignalRClient;

  BTC_ETH?: OrderBook;
  BTC_DOGE?: OrderBook;

  constructor() {
     this.client = new BittrexClient({
      pingTimeout: 10000,
      watchdog: {markets: {timeout: 60000, reconnect: true}}
    });

    this.client.on('orderBook', (data: any) => {
      if (data.pair === "BTC-ETH") {
        this.BTC_ETH = new OrderBook(this.formatDataForOrderBook(data.data.buy), this.formatDataForOrderBook(data.data.buy));
        console.log(`BTC_ETH orderBookLoaded:\n${JSON.stringify(this.BTC_ETH )}`);
      } else if (data.pair === "BTC-DOGE") {
        console.log(`orderBookLoaded:\n${JSON.stringify(data )}`);
        this.BTC_DOGE = new OrderBook(this.formatDataForOrderBook(data.data.buy), this.formatDataForOrderBook(data.data.buy));
        console.log(`BTC_ETH orderBookLoaded:\n${JSON.stringify(this.BTC_DOGE )}`);
      }
    });

    this.client.on('orderBookUpdate', (data: any) => {
      if (data.pair === "BTC-ETH") {
        console.log(`BTC_ETH orderBookUpdate:\n${JSON.stringify(data)}`);
      } else if (data.pair === "BTC-DOGE") {
        console.log(`BTC_DOGE orderBookUpdate:\n${JSON.stringify(data)}`);
      }
    });
    console.log(`subscribeToMarkets ['BTC-ETH', 'BTC-DOGE']`);

    this.client.subscribeToMarkets(['BTC-ETH', 'BTC-DOGE']);
  }

  formatDataForOrderBook(raw: any): { [price: number]: number } {
    let data: { [price: number]: number } = {};
    for (let record of raw) {
      let rate: number = record.rate.toFixed(8);
      data[rate] = record.quantity;
    }
    return data;
  }
}

let btr = new Bittrex();