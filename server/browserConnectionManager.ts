import sio from 'socket.io';
import {OrderBookService} from "./orderbook/OrderBookService";
import {CurrencyPair} from "./types/CurrencyPair";

export class BrowserConnectionManager {
  orderBookService: OrderBookService
  io: sio.Server

  constructor(io: sio.Server, orderBookManager: OrderBookService) {
    this.io = io;
    this.orderBookService = orderBookManager;
    this.orderBookService.onChange = this.orderBookUpdateHandler;
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
        const subscribedPair: CurrencyPair | undefined = (<any>CurrencyPair)[pair];
        if (subscribedPair) {
          socket.join(pair);
          // immediately dispatch order book for subscribed pair
          this.io.to(socket.id).emit('orderBookLoaded', this.orderBookService.books[subscribedPair].combinedTotals);
        }
      });
    });
  }

  /**
   * handler is registered with bittrex and poloniex clients
   * triggered each time an update is pushed for an order book
   * broadcasts updated order book to relevant room
   * */
  orderBookUpdateHandler = (pair: CurrencyPair) => {
    this.io.to(pair).emit('orderBookLoaded', this.orderBookService.books[pair].combinedTotals);
  }
}
