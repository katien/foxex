import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './App.css';
import {OrderBook} from "./types/OrderBook";
import OrderTable from "./orderbook/OrderTable";

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

