import {OrderBook, Totals} from "./OrderBook";

export class CombinedOrderBook {
  bittrexOrderBook?: OrderBook;
  poloniexOrderBook?: OrderBook;


  constructor(bittrexOrderBook?: OrderBook, poloniexOrderBook?: OrderBook) {
    this.bittrexOrderBook = bittrexOrderBook;
    this.poloniexOrderBook = poloniexOrderBook;
  }

  get combinedTotals(): OrderBook {
    return new OrderBook(this.combinedBids, this.combinedAsks)
  }

  get combinedBids(): Totals {
    let combined: Totals = this.poloniexOrderBook?.bid || {};
    for (let price of Object.keys(this.bittrexOrderBook?.bid || {})) {
      if (combined[price]) {
        combined[price] += (this.bittrexOrderBook?.bid[price] || 0);
      } else {
        combined[price] = this.bittrexOrderBook?.bid[price] || 0;
      }
    }
    return combined;
  }

  get combinedAsks(): Totals {
    let combined: Totals = this.poloniexOrderBook?.ask || {};
    for (let price of Object.keys(this.bittrexOrderBook?.ask || {})) {
      if (combined[price]) {
        combined[price] += (this.bittrexOrderBook?.ask[price] || 0);
      } else {
        combined[price] = this.bittrexOrderBook?.ask[price] || 0;
      }
    }
    return combined;
  }
}
