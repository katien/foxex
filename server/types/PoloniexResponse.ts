export interface PoloniexMessage {
  type: string;
  data: any;
}

export interface PoloniexOrderBook {
  bids: PoloniexTotals
  asks: PoloniexTotals
}

export interface PoloniexTotals {
  [price: string]: string
}

export interface PoloniexOrderBookUpdate {
  type: string,
  rate: string,
  amount: string
}
