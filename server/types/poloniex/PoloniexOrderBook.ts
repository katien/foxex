import {PoloniexTotals} from "./PoloniexTotals";
/**
 * PoloniexMessage.data format for messages of type "orderBook"
 * Represents the full order book for a currency pair
 * */
export interface PoloniexOrderBook {
  bids: PoloniexTotals
  asks: PoloniexTotals
}