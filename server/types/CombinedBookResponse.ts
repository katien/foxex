export interface CombinedBookResponse {
  bid: CombinedTotals;
  ask: CombinedTotals;
}

export interface CombinedTotals {
  [price: string]: {
    bittrex: number;
    poloniex: number;
    combined: number;
  };
}