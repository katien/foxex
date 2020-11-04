require('mocha-testcheck').install();
const {expect} = require('chai');
import {gen} from "testcheck";
import {check} from "mocha-testcheck";
import {OrderBook, Totals} from "../types/OrderBook";


describe('OrderBook', () => {
  check.it('should store, update, and remove bids',
    gen.array(gen.sPosInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let bids = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) * 2;
        return totals;
      }, {});

      const orderBook = new OrderBook(bids, {});
      for (const price of Object.keys(orderBook.bid)) {
        expect(orderBook.bid[price]).to.equal(Number(price) * 2);
        orderBook.updateBid(price, Number(price));
      }
      for (const price of Object.keys(orderBook.bid)) {
        expect(orderBook.bid[price]).to.equal(Number(price));
        orderBook.updateBid(price, 0);
      }

      expect(Object.keys(orderBook.bid).length).to.equal(0);
      orderBook.updateBid("1", 1);
      expect(orderBook.bid['1']).to.equal(1);
      expect(0).to.equal(1);
    });

  check.it('should store, update, and remove asks',
    gen.array(gen.sPosInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let asks = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) * 2;
        return totals;
      }, {});

      const orderBook = new OrderBook({}, asks);
      for (const price of Object.keys(orderBook.ask)) {
        expect(orderBook.ask[price]).to.equal(Number(price) * 2);
        orderBook.updateAsk(price, Number(price));
      }
      for (const price of Object.keys(orderBook.ask)) {
        expect(orderBook.ask[price]).to.equal(Number(price));
        orderBook.updateAsk(price, 0);
      }

      expect(Object.keys(orderBook.ask).length).to.equal(0);
      orderBook.updateAsk("1", 1);
      expect(orderBook.ask['1']).to.equal(1);
    });
});
