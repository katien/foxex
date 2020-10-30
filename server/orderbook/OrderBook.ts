export class OrderBook {
  bid: Totals;
  ask: Totals;

  constructor(bid: Totals, ask: Totals) {
    this.bid = bid;
    this.ask = ask;
  }

  // if 0 is supplied, the entry is removed
  updateBid(rate: string, total: number) {
    if (total > 0)
      this.bid[rate] = total;
    else
      delete this.bid[rate];
  }

  // if 0 is supplied, the entry is removed
  updateAsk(rate: string, total: number) {
    if (total > 0)
      this.ask[rate] = total;
    else
      delete this.ask[rate];

  }
}

/**
 * Represents line items in an order book, either the set of bids or the set of asks
 * Mappings of prices to totals
 * */
export interface Totals {
  [price: string]: number
}