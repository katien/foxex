export interface OrderBook {
  bid: Totals;
  ask: Totals;
}

export interface Totals {
  [price: string]: {
    bittrex: number;
    poloniex: number;
    combined: number;
  };
}
