import sio from 'socket.io';
import {Bittrex} from "./orderbook/bittrex";

export class ConnectionManager {
  bittrex: Bittrex
  io: sio.Server

  constructor(io: sio.Server, bittrex: Bittrex) {
    this.bittrex = bittrex;
    this.io = io;
    this.startListeners(io);
  }

  startListeners(io: sio.Server) {
    io.on('connection', (socket: sio.Socket) => {
      io.to(socket.id).emit('debug', `You are connected with id: ${socket.id}`);

      socket.on('subscribe', (pair: string) => {
        console.log(`client ${socket.id}  subscribed to pair ${pair}`);
        socket.join('BTC_ETH');
        io.to(socket.id).emit('orderBookLoaded', this.bittrex.BTC_ETH);
      });
    });
  }
}
