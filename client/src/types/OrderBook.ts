export interface OrderBook {
  bid: Totals[];
  ask: Totals[];
}

export interface Totals {
  price: string
  bittrex: string;
  poloniex: string;
  combined: string;
}
