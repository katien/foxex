/**
 * Combined order book response pushed to browser clients
 * CombinedTotals will be sorted in descending order and numbers will be formatted as display friendly strings
 * */
export interface CombinedBookResponse {
  bid: CombinedTotals[];
  ask: CombinedTotals[];
}

export interface CombinedTotals {
    price: string;
    bittrex: string;
    poloniex: string;
    combined: string;
}