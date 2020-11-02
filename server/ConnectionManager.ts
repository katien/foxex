import sio from 'socket.io';
import {OrderBookService} from "./orderbook/OrderBookService";
import {CurrencyPair} from "./types/CurrencyPair";

/**
 * Maintains websocket connections to browsers
 * publishes order book updates to browsers
 * */
export class ConnectionManager {
  orderBookService: OrderBookService
  io: sio.Server

  constructor(io: sio.Server, orderBookManager: OrderBookService) {
    this.io = io;
    this.orderBookService = orderBookManager;
    this.orderBookService.onChange = this.orderBookUpdateHandler;

    // Listens for new browser connections
    this.io.on('connection', this.connectionHandler)
  }

  /**
   * Registers handler for subscriptions to currency pairs
   * On new pair subscription adds clients to relevant rooms and immediately emits current copy of order book
   * */
  connectionHandler = (socket: sio.Socket) => {
    socket.on('subscribe', (pair: string) => {
      // leave all other rooms
      for (let room in socket.rooms) {
        if (room != socket.id) socket.leave(room);
      }
      // ensure the pair being requested is a valid currency pair
      const subscribedPair: CurrencyPair | undefined = (<any>CurrencyPair)[pair];
      if (subscribedPair) {
        socket.join(pair);
        // immediately dispatch order book for subscribed pair
        this.io.to(socket.id).emit('orderBookLoaded', this.orderBookService.books[subscribedPair].combinedTotals);
      }
    });
  }

  /**
   * Registered with OrderBookService
   * triggered each time an update is pushed for an order book
   * broadcasts updated order book to relevant room
   * */
  orderBookUpdateHandler = (pair: CurrencyPair) => {
    this.io.to(pair).emit('orderBookLoaded', this.orderBookService.books[pair].combinedTotals);
  }
}
