import express from 'express';
import {ConnectionManager} from './connectionManager';
import {Bittrex} from "./remote/bittrex";
import {Poloniex} from "./remote/poloniex";
import {OrderBookRepository} from "./OrderBookRepository";
const app = express();
const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
app.use(express.static(process.env.NODE_ENV === "local" ? '../client/dist' : 'client/dist', {index: "index.html"}));

// register socketio with http server
const io = require('socket.io')(server);

// start bittrex and poloniex remote clients
const bittrex = new Bittrex();
const poloniex = new Poloniex();

const orderBookService = new OrderBookRepository(bittrex, poloniex)
const connectionManager = new ConnectionManager(io, orderBookService);

