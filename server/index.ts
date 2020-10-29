import express from 'express';
import {ConnectionManager} from './connectionManager';
import {Bittrex} from "./orderbook/bittrex";
// rest of the code remains same
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.send('Express + TypeScript Server'));
let server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

const io = require('socket.io')(server);
const bittrex = new Bittrex();
const connectionManager = new ConnectionManager(io, bittrex);

