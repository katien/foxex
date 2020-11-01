import express from 'express';
import {BrowserConnectionManager} from './browserConnectionManager';
import {Bittrex} from "./remote/bittrex";
import {Poloniex} from "./remote/poloniex";
import {OrderBookService} from "./orderbook/OrderBookService";
// rest of the code remains same
const app = express();
const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
app.use(express.static('client/dist', {index: "index.html"}));

// register socketio with http server
const io = require('socket.io')(server);

// start bittrex and poloniex remote clients
const bittrex = new Bittrex();
const poloniex = new Poloniex();

const orderBookService = new OrderBookService(bittrex, poloniex)
const connectionManager = new BrowserConnectionManager(io, orderBookService);

