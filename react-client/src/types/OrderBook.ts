import {Totals} from "./Totals";

export interface OrderBook {
  bid: Totals[];
  ask: Totals[];
}