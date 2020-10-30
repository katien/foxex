import sio from 'socket.io';
import {Bittrex} from "./remote/bittrex";

export class BrowserConnectionManager {
  bittrex: Bittrex
  io: sio.Server

  constructor(io: sio.Server, bittrex: Bittrex) {
    this.io = io;
    this.bittrex = bittrex;
    this.bittrex.onOrderBookUpdate = this.orderBookUpdateHandler;
    this.startListeners();
  }

  /**
   * Listens for browser connections and subscriptions to currency pairs
   * Handles pair subscriptions by adding clients to relevant rooms and dispatching most recent order book
   * */
  startListeners() {
    this.io.on('connection', (socket: sio.Socket) => {
      socket.on('subscribe', (pair: string) => {
        // join room for subscribed pair, leave all other rooms
        for (let room in socket.rooms) {
          if (room != socket.id) socket.leave(room);
        }
        socket.join(pair);
        // immediately dispatch order book for subscribed pair
        if (pair === "BTC_ETH") {
          this.io.to(socket.id).emit('orderBookLoaded', this.bittrex.BTC_ETH);
        } else if (pair === "BTC_DOGE") {
          this.io.to(socket.id).emit('orderBookLoaded', this.bittrex.BTC_DOGE);
        }
      });
    });
  }

  /**
   * handler is registered with bittrex and poloniex clients
   * triggered each time an update is pushed for an order book
   * broadcasts updated order book to relevant room
   * */
  orderBookUpdateHandler = (pair: string) => {
    if (pair === "BTC_ETH")
      this.io.to("BTC_ETH").emit('orderBookLoaded', this.bittrex.BTC_ETH);
    else if (pair === "BTC_DOGE")
      this.io.to("BTC_DOGE").emit('orderBookLoaded', this.bittrex.BTC_DOGE);
  }
}
