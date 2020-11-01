/**
 * Represents a single line item in bids or asks of a Bittrex Order Book response
 * */
export interface BittrexResponseEntry {
  rate: number;
  quantity: number;
}
