import {Bittrex} from "../remote/Bittrex";
import {CurrencyPair} from "../types/CurrencyPair";
import {CombinedOrderBook} from "../types/CombinedOrderBook";
import {Poloniex} from "../remote/Poloniex";

/**
 * Maintains a CombinedOrderBook for each currency pair
 * */
export class OrderBookRepository {
  /**
   * Callback to be invoked each time an update is pushed for an order book
   * Allows browser ConnectionManager to subscribe to changes
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Exchange clients
   * */
  private poloniex: Poloniex;
  private bittrex: Bittrex;

  /**
   * Combined order books for each currency pair
   * */
  books: { [pair in CurrencyPair]: CombinedOrderBook }

  /**
   * Instantiates a combined order book for each pair
   * Registers change listeners on bittrex and poloniex clients
   * */
  constructor(bittrex: Bittrex, poloniex: Poloniex) {
    this.bittrex = bittrex;
    this.bittrex.onChange = this.orderBookUpdateHandler;
    this.poloniex = poloniex;
    this.poloniex.onChange = this.orderBookUpdateHandler;

    this.books = {
      [CurrencyPair.BTC_ETH]: new CombinedOrderBook(this.bittrex.BTC_ETH, this.poloniex.BTC_ETH),
      [CurrencyPair.BTC_DOGE]: new CombinedOrderBook(this.bittrex.BTC_DOGE, this.poloniex.BTC_DOGE)
    };
  }

  /**
   * Registered with Poloniex and Bittrex clients
   * triggered each time an update is pushed for an order book
   * invokes onChange callback to notify observers that an order book has changed
   * */
  orderBookUpdateHandler = (pair: CurrencyPair) => this.onChange?.(pair);

}