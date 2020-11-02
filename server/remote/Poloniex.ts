import {OrderBook, Totals} from "../types/OrderBook";
import {CurrencyPair} from "../types/CurrencyPair";
import {PoloniexClient} from "../types/poloniex/PoloniexClient";
import {PoloniexMessage} from "../types/poloniex/PoloniexMessage";
import {PoloniexOrderBook} from "../types/poloniex/PoloniexOrderBook";
import {PoloniexTotals} from "../types/poloniex/PoloniexTotals";
import {PoloniexOrderBookUpdate} from "../types/poloniex/PoloniexOrderBookUpdate";

const Client = require('poloniex-api-node');

/**
 * Subscribes to the Poloniex websocket order book API
 * maintains updated copies of order books for each subscribed currency pair
 * invokes onChange callback to notify subscribers of order book changes
 * */
export class Poloniex {

  /**
   * Callback to be invoked each time an update is pushed for an order book
   * Allows OrderBookRepository to subscribe to changes
   * */
  onChange?: (pair: CurrencyPair) => void


  /**
   * Locally maintained copies of order books for relevant currency pairs
   * CombinedOrderBooks in the OrderBookRepository maintain references to these objects,
   * they should never be overwritten, only updated so they are readonly
   * */
  readonly BTC_ETH: OrderBook = new OrderBook({}, {});
  readonly BTC_DOGE: OrderBook = new OrderBook({}, {});

  private client: PoloniexClient;

  /**
   * Create a poloniex client
   * subscribe to relevant currency pairs
   * register listeners for orderBook load and orderBookUpdate and reconnect logic
   * */
  constructor() {
    this.client = new Client();

    this.client.subscribe('BTC_ETH');
    this.client.subscribe('BTC_DOGE');

    this.client.on('message', this.handleMessages);
    this.registerErrorHandlers()
    this.client.openWebSocket();
  }

  handleMessages = (channelName: string, data: PoloniexMessage[], seq: number) => {
    const pair: CurrencyPair | undefined = (<any>CurrencyPair)[channelName];
    if (pair) {
      for (let message of data) {
        if (message.type === "orderBook") {
          this.processOrderBookMessage(pair, message.data);
        } else if (message.type === "orderBookModify" || message.type === "orderBookRemove") {
          this.processOrderBookUpdateMessage(pair, message.data);
        }
      }
    }
  }

  /**
   * Register error handling with reconnect logic
   * */
  registerErrorHandlers() {
    this.client.on('close', (reason, details) => {
      console.log(`Poloniex WebSocket connection disconnected, reconnecting.\nReason: ${reason}\nDetails: ${details}`);
      this.client.openWebSocket();
    });

    this.client.on('error', (error) => {
      console.log(`An error has occurred, reconnecting.\nError:${JSON.stringify(error)}`);
      this.client.openWebSocket();
    });
  }

  /**
   * A new order book has been received for a currency pair, update the local copy
   * */
  processOrderBookMessage(pair: CurrencyPair, book: PoloniexOrderBook): void {
    let orderBook = new OrderBook(this.parsePoloniexTotals(book.bids), this.parsePoloniexTotals(book.asks));
    Object.assign(this[pair], orderBook);
  }

  /**
   * An entry in an order book for a currency pair has been changed
   * update the local copy and notify observers
   * */
  processOrderBookUpdateMessage(pair: CurrencyPair, update: PoloniexOrderBookUpdate) {
    if (update.type === "bid")
      this[pair].updateBid(update.rate, Number(update.amount));
    else if (update.type === "ask")
      this[pair].updateAsk(update.rate, Number(update.amount));

    this.orderBookUpdateHandler(pair);
  }

  /**
   * Convert Poloniex response to standard Order Book Total format*/
  parsePoloniexTotals(input: PoloniexTotals): Totals {
    let output: Totals = {};
    for (let price in input) {
      output[price] = Number(input[price]);
    }
    return output;
  }

  /**
   * triggered each time an update is pushed for an order book
   * invokes onChange callback to notify OrderBookRepository that an order book has changed
   * */
  orderBookUpdateHandler = (pair: CurrencyPair) => {
    this.onChange?.(pair);
  }

}

