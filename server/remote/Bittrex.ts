import {OrderBook, Totals} from "../types/OrderBook";
import {BittrexClient} from "../types/bittrex/SignalRClient";
import {BittrexResponse} from "../types/bittrex/BittrexResponse";
import {CurrencyPair} from "../types/CurrencyPair";

const BittrexClient = require('bittrex-signalr-client');

/**
 * Subscribes to the Bittrex websocket order book API
 * maintains updated copies of order books for each subscribed currency pair
 * invokes onChange callback to notify subscribers of order book changes
 * */
export class Bittrex {

  /**
   * Callback to be invoked each time an update is pushed for an order book
   * Allows observers to subscribe to changes
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Locally maintained copies of order books for relevant currency pairs
   * CombinedOrderBooks in the OrderBookRepository maintain references to these objects,
   * they should never be overwritten, only updated so they are readonly
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
      watchdog: {markets: {timeout: 300000, reconnect: true}}
    });

    this.client.on('orderBook', this.orderBookLoadListener);
    this.client.on('orderBookUpdate', this.orderBookUpdateListener);

    this.client.subscribeToMarkets(['BTC-ETH', 'BTC-DOGE']);
  }

  /**
   * Full order book has been loaded for a currency pair
   * populate the existing order book with the new data
   * */
  private orderBookLoadListener = (response: BittrexResponse) => {
    let orderBook = this.parseBittrexResponse(response);
    if (response.pair === "BTC-ETH") {
      Object.assign(this.BTC_ETH, orderBook);
    } else if (response.pair === "BTC-DOGE") {
      Object.assign(this.BTC_DOGE, orderBook);
    }
  }

  /**
   * The order book for a currency pair has been updated
   * Update the local order book copy for that pair and notify observers
   * */
  private orderBookUpdateListener = (response: BittrexResponse) => {
    if (response.pair === "BTC-ETH") {
      this.processUpdate(response, this.BTC_ETH);
      this.orderBookUpdateHandler(CurrencyPair.BTC_ETH);
    } else if (response.pair === "BTC-DOGE") {
      this.processUpdate(response, this.BTC_DOGE);
      this.orderBookUpdateHandler(CurrencyPair.BTC_DOGE);
    }
  }

  /**
   * Builds an OrderBook from the data in a BittrexResponse
   * Format price to have consistent precision of 8
   * */
  private parseBittrexResponse(response: BittrexResponse): OrderBook {
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

  /**
   * Updates the supplied order book with data in the BittrexResponse
   * */
  private processUpdate(raw: BittrexResponse, book: OrderBook) {
    for (let record of raw.data.buy) {
      book.updateBid((record.rate.toFixed(8)), record.quantity)
    }
    for (let record of raw.data.sell) {
      book.updateAsk((record.rate.toFixed(8)), record.quantity)
    }
  }

  /**
   * triggered each time an update is pushed for an order book
   * invokes onChange callback to notify observers that an order book has changed
   * */
  private orderBookUpdateHandler = (pair: CurrencyPair) => this.onChange?.(pair);

}

