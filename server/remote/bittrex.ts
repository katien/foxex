import {OrderBook, Totals} from "../orderbook/OrderBook";
import {SignalRClient} from "../types/SignalRClient";
import {BittrexResponse} from "../types/BittrexResponse";
import {CurrencyPair} from "../types/CurrencyPair";

const BittrexClient = require('bittrex-signalr-client');

export class Bittrex {

  /**
   * Invoked after the order book for a currency pair has been updated to notify observers
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Level of precision to allow in order books
   * */
  readonly PRECISION = 8;

  /**
   * Locally maintained copies of order books for relevant currency pairs
   * lateinit
   * TODO: handle missing order book/reload
   * */
  readonly BTC_ETH: OrderBook = new OrderBook({}, {});
  readonly BTC_DOGE: OrderBook = new OrderBook({}, {});

  private client: SignalRClient;

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
    let orderBook = this.parseBittrexResponseToOrderBook(response);
    if (response.pair === "BTC-ETH") {
      Object.assign(this.BTC_ETH, orderBook);
      console.log(`BTC_ETH orderBookLoaded:\n${JSON.stringify(this.BTC_ETH)}`);
    } else if (response.pair === "BTC-DOGE") {
      console.log(`orderBookLoaded:\n${JSON.stringify(response)}`);
      Object.assign(this.BTC_DOGE, orderBook);
      console.log(`BTC_ETH orderBookLoaded:\n${JSON.stringify(this.BTC_DOGE)}`);
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
        console.log(`BTC_ETH orderBookUpdate:\n${JSON.stringify(response)}`);
        this.orderBookUpdateHandler(CurrencyPair.BTC_ETH);
      }
    } else if (response.pair === "BTC-DOGE") {
      if (this.BTC_DOGE) {
        this.processUpdate(response, this.BTC_DOGE);
        console.log(`BTC_DOGE orderBookUpdate:\n${JSON.stringify(response)}`);
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
      let rate: string = (record.rate.toFixed(this.PRECISION));
      ask[rate] = record.quantity;
    }
    let bid: Totals = {};
    for (let record of response.data.buy) {
      let rate: string = (record.rate.toFixed(this.PRECISION));
      bid[rate] = record.quantity;
    }
    return new OrderBook(bid, ask);
  }

  private processUpdate(raw: BittrexResponse, book: OrderBook): void {
    for (let record of raw.data.buy) {
      book.updateBid((record.rate.toFixed(this.PRECISION)), record.quantity)
    }
    for (let record of raw.data.sell) {
      book.updateAsk((record.rate.toFixed(this.PRECISION)), record.quantity)
    }
  }
}

