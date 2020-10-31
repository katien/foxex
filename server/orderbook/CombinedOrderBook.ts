import {OrderBook, Totals} from "./OrderBook";
import {CombinedBookResponse, CombinedTotals} from "../types/CombinedBookResponse";

export class CombinedOrderBook {
  private readonly LIMIT = 15;
  bittrexOrderBook?: OrderBook;
  poloniexOrderBook?: OrderBook;


  constructor(bittrexOrderBook?: OrderBook, poloniexOrderBook?: OrderBook) {
    this.bittrexOrderBook = bittrexOrderBook;
    this.poloniexOrderBook = poloniexOrderBook;
  }

  get combinedTotals(): CombinedBookResponse {
    return {
      bid: this.combineTotals(this.bittrexOrderBook?.bid || {}, this.poloniexOrderBook?.bid || {}, true),
      ask: this.combineTotals(this.bittrexOrderBook?.ask || {}, this.poloniexOrderBook?.ask || {}, false)
    }
  }

  private combineTotals(bittrex: Totals, poloniex: Totals, bid: boolean): CombinedTotals {

    let combined: CombinedTotals = {};
    let prices = Object.keys({
      ...bittrex,
      ...poloniex
    });
    // sort ask by highest to lowest
    prices = bid ?
      prices.sort((a, b) => a > b ? -1 : 1).slice(0, this.LIMIT) :
      prices.sort((a, b) => a < b ? -1 : 1).slice(0, this.LIMIT)


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
