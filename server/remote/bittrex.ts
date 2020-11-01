import {OrderBook, Totals} from "../orderbook/OrderBook";
import {BittrexClient} from "../types/bittrex/SignalRClient";
import {BittrexResponse} from "../types/bittrex/BittrexResponse";
import {CurrencyPair} from "../types/CurrencyPair";

const BittrexClient = require('bittrex-signalr-client');

export class Bittrex {

  /**
   * Invoked after the order book for a currency pair has been updated to notify observers
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Locally maintained copies of order books for relevant currency pairs
   * lateinit
   * TODO: handle missing order book/reload
   * */
  readonly BTC_ETH: OrderBook = new OrderBook({}, {});
  readonly BTC_DOGE: OrderBook = new OrderBook({}, {});

  private client: BittrexClient;

  /**
   * Create a bittrex client
   * subscribe to relevant currency pairs
   * register listeners for orderBook load and orderBookUpdate
   * */
  constructor() {
    this.client = new BittrexClient({
      pingTimeout: 10000,
      watchdog: {markets: {timeout: 60000, reconnect: true}}
    });

    this.client.on('orderBook', this.orderBookLoadListener);
    this.client.on('orderBookUpdate', this.orderBookUpdateListener);

    this.client.subscribeToMarkets(['BTC-ETH', 'BTC-DOGE']);
  }

  /**
   * Full order book has been loaded for a currency pair
   * format the data and replace the existing order book with the new data
   * */
  orderBookLoadListener = (response: BittrexResponse) => {
    console.log(`bittrex orderBookLoaded ${response.pair}`);
    let orderBook = this.parseBittrexResponseToOrderBook(response);
    if (response.pair === "BTC-ETH") {
      Object.assign(this.BTC_ETH, orderBook);
    } else if (response.pair === "BTC-DOGE") {
      Object.assign(this.BTC_DOGE, orderBook);
    }
  }

  /**
   * The order book for a currency pair has been updated
   * Update the local order book copy for that pair
   * invoke onOrderBookUpdate to notify observers of the change
   * */
  orderBookUpdateListener = (response: BittrexResponse) => {
    if (response.pair === "BTC-ETH") {
      if (this.BTC_ETH) {
        this.processUpdate(response, this.BTC_ETH);
        this.orderBookUpdateHandler(CurrencyPair.BTC_ETH);
      }
    } else if (response.pair === "BTC-DOGE") {
      if (this.BTC_DOGE) {
        this.processUpdate(response, this.BTC_DOGE);
        this.orderBookUpdateHandler(CurrencyPair.BTC_DOGE);
      }
    }
  }
  orderBookUpdateHandler = (pair: CurrencyPair) => {
    this.onChange?.(pair);
  }

  private parseBittrexResponseToOrderBook(response: BittrexResponse): OrderBook {
    let ask: Totals = {};
    for (let record of response.data.sell) {
      let rate: string = (record.rate.toFixed(8));
      ask[rate] = record.quantity;
    }
    let bid: Totals = {};
    for (let record of response.data.buy) {
      let rate: string = (record.rate.toFixed(8));
      bid[rate] = record.quantity;
    }
    return new OrderBook(bid, ask);
  }

  private processUpdate(raw: BittrexResponse, book: OrderBook): void {
    for (let record of raw.data.buy) {
      book.updateBid((record.rate.toFixed(8)), record.quantity)
    }
    for (let record of raw.data.sell) {
      book.updateAsk((record.rate.toFixed(8)), record.quantity)
    }
  }
}

