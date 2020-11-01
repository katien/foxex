/**
 * PoloniexMessage.data format for messages of type "orderBookModify" and "orderBookRemove"
 * Represents a new rate - amount entry in an order book for a currency pair
 * */
export interface PoloniexOrderBookUpdate {
  type: string,
  rate: string,
  amount: string
}
