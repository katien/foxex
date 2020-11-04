import express from 'express';
import {ConnectionManager} from './ConnectionManager';
import {Bittrex} from "./remote/Bittrex";
import {Poloniex} from "./remote/Poloniex";
import {OrderBookRepository} from "./OrderBookRepository";

const app = express();
const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
app.use(express.static( 'client/dist', {index: "index.html"}));

// register socketio with http server
const io = require('socket.io')(server);

// start bittrex and poloniex remote clients
const bittrex = new Bittrex();
const poloniex = new Poloniex();

const orderBookRepository = new OrderBookRepository(bittrex, poloniex)
new ConnectionManager(io, orderBookRepository);

