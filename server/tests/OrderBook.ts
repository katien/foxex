import {expect} from 'chai';
import 'mocha';
import {CombinedOrderBook} from "../types/CombinedOrderBook";
import {OrderBook, Totals} from "../types/OrderBook";

describe('OrderBook', () => {
  it('should update bids in the order book', () => {
    let bid: Totals = [1, 2, 3, 4, 5, 6, 9, 12, 23, 27, 34, 56].reduce((a: Totals, price: number) => {
      a[String(price)] = price * 2;
      return a;
    }, {});
    let orderBook = new OrderBook(bid, {});
    for (const price in orderBook.bid) {
      expect(orderBook.bid[price]).to.equal(Number(price) * 2);
      orderBook.updateBid(price, Number(price));
    }

    for (const price in orderBook.bid) {
      expect(orderBook.bid[price]).to.equal(Number(price));
      orderBook.updateBid(price, 0);
    }
    expect(Object.keys(orderBook.bid).length).to.equal(0);
    orderBook.updateBid("1", 1);
    expect(orderBook.bid['1']).to.equal(1);
  });

  it('should update asks in the order book', () => {
    let ask: Totals = [1, 2, 3, 4, 5, 6, 9, 12, 23, 27, 34, 56].reduce((a: Totals, price: number) => {
      a[String(price)] = price * 2;
      return a;
    }, {});
    let orderBook = new OrderBook({}, ask);
    for (const price in orderBook.ask) {
      expect(orderBook.ask[price]).to.equal(Number(price) * 2);
      orderBook.updateAsk(price, Number(price));
    }

    for (const price in orderBook.ask) {
      expect(orderBook.ask[price]).to.equal(Number(price));
      orderBook.updateAsk(price, 0);
    }
    expect(Object.keys(orderBook.ask).length).to.equal(0);
    orderBook.updateAsk("1", 1);
    expect(orderBook.ask['1']).to.equal(1);
  });
});

