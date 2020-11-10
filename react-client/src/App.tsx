import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './App.css';
import {OrderBook} from "./types/OrderBook";
import OrderTable from "./orderbook/OrderTable";

interface AppState {
  currencyPair: string,
  orderBook?: OrderBook
}

class App extends React.Component<{}, AppState> {
  socket: SocketIOClient.Socket

  constructor(props: {}) {
    super(props);
    this.state = {
      currencyPair: "BTC_ETH"
    };

    this.socket = process.env.NODE_ENV === 'development' ? io("localhost:3000") : io();
    this.socket.on("orderBookLoaded", this.orderBookLoaded);
  }

  componentDidMount(): void {
    // subscribe in componentDidMount instead of constructor so that orderBookLoaded doesn't call setState before the component is rendered
    this.socket.emit("subscribe", this.state.currencyPair);
  }

  orderBookLoaded = (orderBook: OrderBook) => this.setState({orderBook});

  render() {
    return (
      <div id="app">
        <h1>Foxex</h1>
        {/*<select value={this.state.currencyPair}>*/}
        {/*  <option>BTC_ETH</option>*/}
        {/*</select>*/}
        <OrderTable title="ask" entries={this.state.orderBook?.ask}/>
        <OrderTable title="bid" entries={this.state.orderBook?.bid}/>
      </div>
    );
  }

}

export default App;

