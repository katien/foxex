import {OrderBook, Totals} from "./OrderBook";

export class CombinedOrderBook {
  bittrexOrderBook?: OrderBook;
  poloniexOrderBook?: OrderBook;

  constructor(bittrexOrderBook?: OrderBook, poloniexOrderBook?: OrderBook) {
    this.bittrexOrderBook = bittrexOrderBook;
    this.poloniexOrderBook = poloniexOrderBook;
  }

  get asOrderBook(): OrderBook {
    return new OrderBook(this.bittrexOrderBook?.bid || {}, this.bittrexOrderBook?.ask || {})
  }

  get combinedBids(): Totals {
    return this.bittrexOrderBook?.bid || {}; // + this.poloniexOrderBook.bid
  }

  get combinedAsks(): Totals {
    return this.bittrexOrderBook?.ask || {}; // + this.poloniexOrderBook.ask
  }
}
