/**
 * Order book data for one currency pair on a single exchange
 * */
export class OrderBook {
  bid: Totals;
  ask: Totals;

  constructor(bid: Totals, ask: Totals) {
    this.bid = bid;
    this.ask = ask;
  }

  /**
   * Updates the entry for a price
   * Removes the entry if the amount is 0
   * */
  updateBid(price: string, amount: number) {
    if (amount > 0)
      this.bid[price] = amount;
    else
      delete this.bid[price];
  }

  /**
   * Updates the entry for a price
   * Removes the entry if the amount is 0
   * */
  updateAsk(price: string, amount: number) {
    if (amount > 0)
      this.ask[price] = amount;
    else
      delete this.ask[price];
  }
}

/**
 * Mapping of prices to amounts
 * */
export interface Totals {
  [price: string]: number
}