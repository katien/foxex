import {OrderBook, Totals} from "./OrderBook";
import {CombinedBookResponse, CombinedTotals} from "../types/CombinedBookResponse";

export class CombinedOrderBook {
  bittrexOrderBook?: OrderBook;
  poloniexOrderBook?: OrderBook;


  constructor(bittrexOrderBook?: OrderBook, poloniexOrderBook?: OrderBook) {
    this.bittrexOrderBook = bittrexOrderBook;
    this.poloniexOrderBook = poloniexOrderBook;
  }

  get combinedTotals(): CombinedBookResponse {
    return {
      bid: this.combineTotals(this.bittrexOrderBook?.bid || {}, this.poloniexOrderBook?.bid || {}),
      ask: this.combineTotals(this.bittrexOrderBook?.ask || {}, this.poloniexOrderBook?.ask || {})
    }
  }

  private combineTotals(bittrex: Totals, poloniex: Totals): CombinedTotals {
    let combined: CombinedTotals = {};
    for (let price of Object.keys({
      ...bittrex,
      ...poloniex
    })) {
      combined[price] = {
        combined: (bittrex[price] || 0) + (poloniex[price] || 0),
        bittrex: bittrex[price] || 0,
        poloniex: poloniex[price] || 0
      }
    }
    return combined;
  }
}
