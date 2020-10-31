import {OrderBook, Totals} from "../orderbook/OrderBook";
import {CurrencyPair} from "../types/CurrencyPair";
import {PoloniexClient} from "../types/PoloniexClient";
import {PoloniexMessage, PoloniexOrderBook, PoloniexOrderBookUpdate} from "../types/PoloniexResponse";

const Client = require('poloniex-api-node');


export class Poloniex {

  /**
   * Invoked after the order book for a currency pair has been updated to notify observers
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Level of precision to allow in order books
   * */
  readonly PRECISION = 8;

  /**
   * Locally maintained copies of order books for relevant currency pairs
   * lateinit
   * TODO: handle missing order book/reload
   * */
  readonly BTC_ETH: OrderBook = new OrderBook({}, {});
  readonly BTC_DOGE: OrderBook = new OrderBook({}, {});

  private client: PoloniexClient;

  /**
   * Create a bittrex client
   * subscribe to relevant currency pairs
   * register listeners for orderBook load and orderBookUpdate
   * */
  constructor() {
    this.client = new Client();

    this.client.subscribe('BTC_ETH');
    this.client.subscribe('BTC_DOGE');

    this.client.on('message', (channelName, data: PoloniexMessage[], seq) => {
      console.log(channelName);
      const pair: CurrencyPair | undefined = (<any>CurrencyPair)[channelName];
      if (pair) {
        for (let message of data) {
          this.messageHandler(pair, message);
        }
      }
    });

    this.client.on('open', () => {
      console.log(`Poloniex WebSocket connection open`);
    });

    this.client.on('close', (reason, details) => {
      console.log(`Poloniex WebSocket connection disconnected, reconnecting. Reason: ${reason}\nDetails: ${details}`);
      this.client.openWebSocket();
    });

    this.client.on('error', (error) => {
      console.log(`An error has occurred, reconnecting ${JSON.stringify(error)}`);
      this.client.openWebSocket();
    });
    this.client.openWebSocket();

  }


  messageHandler = (pair: CurrencyPair, message: PoloniexMessage) => {
    if (message.type === "orderBook") {
      this.processOrderBook(pair, message.data);
    } else if (message.type === "orderBookModify" || message.type === "orderBookRemove") {
      this.processOrderBookUpdate(pair, message.data);
    }
  }

  processOrderBook(pair: CurrencyPair, book: PoloniexOrderBook): void {
    let orderBook = new OrderBook(book.bids, book.asks);
    Object.assign(this[pair], orderBook);
  }

  processOrderBookUpdate(pair: CurrencyPair, update: PoloniexOrderBookUpdate) {
    if (update.type === "bid")
      this[pair].updateBid(update.rate, update.amount);
    else if (update.type === "ask")
      this[pair].updateAsk(update.rate, update.amount);


    this.orderBookUpdateHandler(pair);
  }

  orderBookUpdateHandler = (pair: CurrencyPair) => {
    this.onChange?.(pair);
  }

}

