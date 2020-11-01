/**
 * Set of line items (all bids or all asks) in a Poloniex order book response
 * */
export interface PoloniexTotals {
  [price: string]: string
}