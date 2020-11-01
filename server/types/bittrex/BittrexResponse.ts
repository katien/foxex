import {BittrexResponseEntry} from "./BittrexResponseEntry";
/**
 * Bittrex response containing a list of bid order book entries and a list of ask order book entries
 * Can contain a partial order book representing updates to be applied to locally stored full order book
 * */
export interface BittrexResponse {
  pair: string;
  data: {
    buy: BittrexResponseEntry[];
    sell: BittrexResponseEntry[];
  }
}