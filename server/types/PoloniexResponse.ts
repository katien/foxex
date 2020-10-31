export interface PoloniexMessage {
  type: string;
  data: any;
}

export interface PoloniexOrderBook {
  bids: PoloniexTotals
  asks: PoloniexTotals
}

export interface PoloniexTotals {
  [price: string]: number
}

export interface PoloniexOrderBookUpdate {
  type: string,
  rate: string,
  amount: number
}
