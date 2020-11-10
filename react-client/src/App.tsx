import React, {SyntheticEvent, useEffect, useState} from 'react';
import io from 'socket.io-client';
import './App.css';
import {OrderBook} from "./types/OrderBook";
import OrderTable from "./orderbook/OrderTable";
import {CurrencyPair} from "./types/CurrencyPair";

interface AppState {
  currencyPair: CurrencyPair,
  orderBook?: OrderBook
}

class App extends React.Component<{}, AppState> {
  socket: SocketIOClient.Socket // not reactive state - safe to store as a class field

  /**
   * initialize state and socket connection, set orderBookLoaded event callback
   * */
  constructor(props: {}) {
    super(props);
    this.state = {currencyPair: CurrencyPair.BTC_ETH};
    this.socket = process.env.NODE_ENV === 'development' ? io("localhost:3000") : io();
    this.socket.on("orderBookLoaded", this.orderBookLoaded);
  }

  /**
   * subscribe to default currencyPair
   * done here instead of constructor so orderBookLoaded doesn't invoke setState before component is rendered
   * */
  componentDidMount(): void {
    this.socket.emit("subscribe", this.state.currencyPair);
  }

  /**
   * Callbacks
   * use public class field syntax so that this is bound to the class instance and setState is available
   * */
  orderBookLoaded = (orderBook: OrderBook) => this.setState({orderBook});
  onChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    const currencyPair: CurrencyPair | undefined = (CurrencyPair)[e.currentTarget.value as CurrencyPair];
    this.setState({currencyPair});
    this.socket.emit("subscribe", currencyPair);
  };

  render() {
    let options = Object.keys(CurrencyPair).map(pair => <option key={pair}>{pair}</option>);
    return (
      <div id="app">
        <h1>Foxex</h1>
        <select value={this.state.currencyPair} onChange={this.onChange}>
          {options}
        </select>
        <OrderTable title="ask" entries={this.state.orderBook?.ask}/>
        <OrderTable title="bid" entries={this.state.orderBook?.bid}/>
      </div>
    );
  }
}

export default App;

