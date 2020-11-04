import {OrderBook, Totals} from "../types/OrderBook";
import {CurrencyPair} from "../types/CurrencyPair";
import {PoloniexClient} from "../types/poloniex/PoloniexClient";
import {PoloniexMessage} from "../types/poloniex/PoloniexMessage";
import {PoloniexOrderBook} from "../types/poloniex/PoloniexOrderBook";
import {PoloniexTotals} from "../types/poloniex/PoloniexTotals";
import {PoloniexOrderBookUpdate, UpdateType} from "../types/poloniex/PoloniexOrderBookUpdate";

const Client = require("poloniex-api-node");

/**
 * Subscribes to the Poloniex websocket order book API
 * maintains updated copies of order books for each subscribed currency pair
 * invokes onChange callback to notify subscribers of order book changes
 * */
export class Poloniex {

  /**
   * Callback to be invoked each time an update is pushed for an order book
   * Allows observers to subscribe to changes
   * */
  onChange?: (pair: CurrencyPair) => void

  /**
   * Locally maintained copies of order books for relevant currency pairs
   * CombinedOrderBooks in the OrderBookRepository maintain references to these objects,
   * they should never be overwritten, only updated so they are readonly
   * */
  readonly BTC_ETH: OrderBook = new OrderBook({}, {});
  readonly BTC_DOGE: OrderBook = new OrderBook({}, {});

  private readonly subscribedMarkets = [CurrencyPair.BTC_DOGE, CurrencyPair.BTC_ETH];

  /**
   * Poloniex API events
   * */
  private readonly NEW_ORDER_BOOK_EVENT = "orderBook";
  private readonly ORDER_BOOK_MODIFY_EVENT = "orderBookModify";
  private readonly ORDER_BOOK_REMOVE_EVENT = "orderBookRemove";
  private readonly MESSAGES_EVENT = "message";
  private readonly CLOSE_EVENT = "close";
  private readonly ERROR_EVENT = "error";


  private client: PoloniexClient;

  /**
   * Create a poloniex client
   * subscribe to relevant currency pairs
   * register listeners for orderBook load and orderBookUpdate and reconnect logic
   * */
  constructor() {
    this.client = new Client();

    for (let market of this.subscribedMarkets) {
      this.client.subscribe(market);
    }

    this.client.on(this.MESSAGES_EVENT, this.handleMessages);
    this.registerErrorHandlers()
    this.client.openWebSocket();
  }

  /**
   * Poloniex messages come in batches and a single batch can contain multiple message types
   * triggers processing for each message in a batch
   * */
  private handleMessages = (channelName: string, data: PoloniexMessage[], seq: number) => {
    const pair: CurrencyPair | undefined = (<any>CurrencyPair)[channelName];
    if (pair) {
      for (let message of data) {
        if (message.type === this.NEW_ORDER_BOOK_EVENT) {
          this.processOrderBookMessage(pair, message.data);
        } else if (message.type === this.ORDER_BOOK_MODIFY_EVENT || message.type === this.ORDER_BOOK_REMOVE_EVENT) {
          this.processOrderBookUpdateMessage(pair, message.data);
        }
      }
    }
  }

  /**
   * Register error handling with reconnect logic
   * */
  private registerErrorHandlers() {
    this.client.on(this.CLOSE_EVENT, (reason, details) => {
      console.log(`Poloniex WebSocket connection disconnected, reconnecting.\nReason: ${reason}\nDetails: ${details}`);
      this.client.openWebSocket();
    });

    this.client.on(this.ERROR_EVENT, (error) => {
      console.log(`An error has occurred, reconnecting.\nError:${JSON.stringify(error)}`);
      this.client.openWebSocket();
    });
  }

  /**
   * A new order book has been received for a currency pair, update the local copy
   * */
  private processOrderBookMessage(pair: CurrencyPair, book: PoloniexOrderBook): void {
    let orderBook = new OrderBook(this.parsePoloniexTotals(book.bids), this.parsePoloniexTotals(book.asks));
    Object.assign(this[pair], orderBook);
  }

  /**
   * An entry in an order book for a currency pair has been changed
   * update the local copy and notify observers
   * */
  private processOrderBookUpdateMessage(pair: CurrencyPair, update: PoloniexOrderBookUpdate) {
    if (update.type === UpdateType.bid)
      this[pair].updateBid(update.rate, Number(update.amount));
    else if (update.type === UpdateType.ask)
      this[pair].updateAsk(update.rate, Number(update.amount));

    this.orderBookUpdateHandler(pair);
  }

  /**
   * Convert Poloniex response to standard Order Book Total format*/
  private parsePoloniexTotals(input: PoloniexTotals): Totals {
    let output: Totals = {};
    for (let price in input) {
      output[price] = Number(input[price]);
    }
    return output;
  }

  /**
   * triggered each time an update is pushed for an order book
   * invokes onChange callback to notify observers that an order book has changed
   * */
  private orderBookUpdateHandler = (pair: CurrencyPair) => this.onChange?.(pair);
}

