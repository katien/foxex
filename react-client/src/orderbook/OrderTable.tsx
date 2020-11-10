import React  from 'react';
import {Totals} from "../types/Totals";

interface OrderTableProps {
  entries?: Totals[],
  title: string
}

function OrderTable(props: OrderTableProps) {
  const entries = props.entries?.map((entry: Totals) =>
    <li key={entry.price}>
      <span>{entry.price}</span>
      <span className="bittrex">{entry.bittrex}</span>
      <span className="poloniex">{entry.poloniex}</span>
      <span>{entry.combined}</span>
    </li>
  );
  return <>
    <h2>{props.title}</h2>
    <ul className="table">
      <li className="head">
        <span>Price</span>
        <span className="bittrex">Bittrex</span>
        <span className="poloniex">Poloniex</span>
        <span>Combined</span>
      </li>
      {entries}
    </ul>
  </>;
}

export default OrderTable;

