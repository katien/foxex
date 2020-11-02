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
      bid: this.combineTotals(this.displayBids, this.bittrexOrderBook?.bid, this.poloniexOrderBook?.bid),
      ask: this.combineTotals(this.displayAsks, this.bittrexOrderBook?.ask, this.poloniexOrderBook?.ask)
    }
  }

  /**
   * ENTRY_COUNT highest bids to display in order book
   * */
  private get displayBids(): string[] {
    let prices = Object.keys({...this.bittrexOrderBook?.bid, ...this.poloniexOrderBook?.bid});
    return prices
      .sort((a, b) => Number(a) > Number(b) ? -1 : 1)
      .slice(0, this.ENTRY_COUNT);
  }

  /**
   * ENTRY_COUNT lowest asks to display in order book
   * */
  private get displayAsks(): string[] {
    let prices = Object.keys({...this.bittrexOrderBook?.ask, ...this.poloniexOrderBook?.ask});
    return prices
      .sort((a, b) => Number(a) > Number(b) ? -1 : 1)
      .slice(prices.length - this.ENTRY_COUNT, prices.length);
  }


  /**
   * Adds Bittrex and Poloniex totals if both books have entries at the same price point
   * */
  private combineTotals(prices: string[], bittrex: Totals, poloniex: Totals): CombinedTotals {
    let combined: CombinedTotals = {};
    for (let price of prices) {
      combined[price] = {
        combined: (bittrex[price] || 0) + (poloniex[price] || 0),
        bittrex: bittrex[price] || 0,
        poloniex: poloniex[price] || 0
      }
    }
    return combined;
  }
}
