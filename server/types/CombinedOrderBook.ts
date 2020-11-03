import {OrderBook, Totals} from "./OrderBook";
import {CombinedBookResponse, CombinedTotals} from "./CombinedBookResponse";

/**
 * Bittrex and Poloniex order book data for a single currency pair
 * */
export class CombinedOrderBook {
  /**
   * Number of Bids and Asks to store
   * */
  private readonly ENTRY_COUNT = 15;

  private readonly bittrexOrderBook: OrderBook;
  private readonly poloniexOrderBook: OrderBook;

  constructor(bittrexOrderBook: OrderBook, poloniexOrderBook: OrderBook) {
    this.bittrexOrderBook = bittrexOrderBook;
    this.poloniexOrderBook = poloniexOrderBook;
  }

  /**
   * Generates a CombinedBookResponse with the highest bids and lowest asks from Bittrex and Poloniex
   * */
  get combinedTotals(): CombinedBookResponse {
    return {
      bid: this.displayBids,
      ask: this.displayAsks
    }
  }

  /**
   * Aggregates bids from Bittrex and Poloniex
   * sorts by descending price and returns first ENTRY_COUNT bids formatted as CombinedTotals
   * */
  private get displayBids(): CombinedTotals[] {
    let aggregatePrices = Object.keys({...this.bittrexOrderBook?.bid, ...this.poloniexOrderBook?.bid});
    let displayPrices = aggregatePrices
      .sort((a, b) => Number(a) > Number(b) ? -1 : 1)
      .slice(0, this.ENTRY_COUNT);

    return displayPrices.map((price) => ({
      price,
      combined: String((this.bittrexOrderBook.bid[price] || 0) + (this.poloniexOrderBook.bid[price] || 0)),
      bittrex: String(this.bittrexOrderBook.bid[price] || 0),
      poloniex: String(this.poloniexOrderBook.bid[price] || 0)
    }));
  }

  /**
   * Aggregates asks from Bittrex and Poloniex
   * sorts by descending price and returns last ENTRY_COUNT asks formatted as CombinedTotals
   * */
  private get displayAsks(): CombinedTotals[] {
    let aggregatePrices = Object.keys({...this.bittrexOrderBook?.ask, ...this.poloniexOrderBook?.ask});
    let displayPrices = aggregatePrices
      .sort((a, b) => Number(a) > Number(b) ? -1 : 1)
      .slice(-this.ENTRY_COUNT);
    return displayPrices.map((price) => ({
      price: price,
      combined: String((this.bittrexOrderBook.ask[price] || 0) + (this.poloniexOrderBook.ask[price] || 0)),
      bittrex: String(this.bittrexOrderBook.ask[price] || 0),
      poloniex: String(this.poloniexOrderBook.ask[price] || 0)
    }));
  }
}
