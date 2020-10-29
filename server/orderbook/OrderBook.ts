export class OrderBook {
  bid: { [price: number]: number };
  ask: { [price: number]: number };

  constructor(bid: { [price: number]: number }, ask: { [price: number]: number }) {
    this.bid = bid;
    this.ask = ask;
  }

  // if 0 is supplied, the entry is removed
  updateBid(rate: number, total: number) {
    if (total > 0)
      this.bid[rate] = total;
    else
      delete this.bid[rate];

  }

  // if 0 is supplied, the entry is removed
  updateAsk(rate: number, total: number) {
    if (total > 0)
      this.ask[rate] = total;
    else
      delete this.ask[rate];

  }
}

