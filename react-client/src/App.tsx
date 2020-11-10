import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [orderBook, setOrderBook] = useState<OrderBook>();
  useEffect(() => {
    const socket = process.env.NODE_ENV === 'development' ? io("localhost:3000") : io();
    socket.emit("subscribe", "BTC_ETH");
    socket.on("orderBookLoaded", (orderBook: OrderBook) => {
      setOrderBook(orderBook);
    });
  }, []);

  return (
    <div id="app">
      <h1>Foxex</h1>
      <OrderTable title="ask" entries={orderBook?.ask}/>
      <OrderTable title="bid" entries={orderBook?.bid}/>
    </div>
  );
}


export default App;

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

export interface OrderBook {
  bid: Totals[];
  ask: Totals[];
}

export interface Totals {
  price: string
  bittrex: string;
  poloniex: string;
  combined: string;
}
