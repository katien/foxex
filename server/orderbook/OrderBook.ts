export class OrderBook {
  bid: PricePoint;
  ask: PricePoint;

  constructor(bid: PricePoint, ask: PricePoint) {
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
 * Represents a line item in an order book
 * Mapping of price to total
 * */
export interface PricePoint {
  [price: string]: number
}