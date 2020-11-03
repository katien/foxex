import {deduped, sortDesc} from "./util/PriceUtils";

require('mocha-testcheck').install();
const {expect} = require('chai');
import {gen} from "testcheck";
import {check} from "mocha-testcheck"
import {CombinedOrderBook} from "../types/CombinedOrderBook";
import {OrderBook, Totals} from "../types/OrderBook";


describe('Combined order book bid display prices', () => {
  check.it('should return the highest 15 bids sorted in descending order given order books data from bittrex',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let bids = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});
      const combinedOrderBook = new CombinedOrderBook(new OrderBook(bids, {}), new OrderBook({}, {}));
      let displayBidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);

      let uniqueBidsDesc = deduped(sortDesc(prices));
      expect(displayBidPrices).to.deep.equal(uniqueBidsDesc.slice(0, 15));
    });

  check.it('should return the highest 15 bids sorted in descending order given order book data from poloniex',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let bids = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});
      const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook(bids, {}));
      let displayBidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);

      let uniqueBidsDesc = deduped(sortDesc(prices));
      expect(displayBidPrices).to.deep.equal(uniqueBidsDesc.slice(0, 15));
    });

  check.it('should return the highest 15 bids sorted in descending order given order book data from both platforms',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    (bittrexPrices: string[], poloniexPrices: string[]) => {
      let bittrexBids = bittrexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});

      let poloniexBids = poloniexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});
      const combinedOrderBook = new CombinedOrderBook(new OrderBook(bittrexBids, {}), new OrderBook(poloniexBids, {}));
      let displayBidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);

      let uniqueBidsDesc = deduped(sortDesc(bittrexPrices.concat(poloniexPrices)));
      expect(displayBidPrices).to.deep.equal(uniqueBidsDesc.slice(0, 15));
    });
});

describe('Combined order book ask display prices', () => {
  check.it('should return the lowest 15 asks sorted in descending order given order books data from bittrex',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let asks = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});
      const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, asks), new OrderBook({}, {}));
      let displayAskPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);

      let uniqueAsksDesc = deduped(sortDesc(prices));
      expect(displayAskPrices).to.deep.equal(uniqueAsksDesc.slice(-15));
    });

  check.it('should return the lowest 15 asks sorted in descending order given order book data from poloniex',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 16}), (prices: string[]) => {
      let asks = prices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});
      const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook({}, asks));
      let displayAskPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);

      let uniqueAsksDesc = deduped(sortDesc(prices));
      expect(displayAskPrices).to.deep.equal(uniqueAsksDesc.slice(-15));
    });

  check.it('should return the lowest 15 asks sorted in descending order given order book data from both platforms',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}), gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    (bittrexPrices: string[], poloniexPrices: string[]) => {
      let bittrexAsks = bittrexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});

      let poloniexAsks = poloniexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price);
        return totals;
      }, {});

      const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, bittrexAsks), new OrderBook({}, poloniexAsks));
      let displayAskPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);

      let uniqueAsksDesc = deduped(sortDesc(bittrexPrices.concat(poloniexPrices)));
      expect(displayAskPrices).to.deep.equal(uniqueAsksDesc.slice(-15));
    });
});


describe('Combined order book totals', () => {
  check.it('should return correct bittrex, poloniex, and combined totals at each ask price point',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    (bittrexPrices: string[], poloniexPrices: string[]) => {

      let bittrexAsks = bittrexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) + 1;
        return totals;
      }, {});

      let poloniexAsks = poloniexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) + 2;
        return totals;
      }, {});

      const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, bittrexAsks), new OrderBook({}, poloniexAsks));
      combinedOrderBook.combinedTotals.ask.forEach(ct => {
        expect(ct.bittrex).to.deep.equal(String(bittrexAsks[ct.price] || 0));
        expect(ct.poloniex).to.deep.equal(String(poloniexAsks[ct.price] || 0));
        expect(ct.combined).to.deep.equal(String((bittrexAsks[ct.price] || 0) + (poloniexAsks[ct.price] || 0)));
      })
    });

  check.it('should return correct bittrex, poloniex, and combined totals at each bid price point',
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    gen.array(gen.posInt.then((i: number) => String(i)), {minSize: 20}),
    (bittrexPrices: string[], poloniexPrices: string[]) => {

      let bittrexBids = bittrexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) + 1;
        return totals;
      }, {});

      let poloniexBids = poloniexPrices.reduce((totals: Totals, price: string) => {
        totals[price] = Number(price) + 2;
        return totals;
      }, {});

      const combinedOrderBook = new CombinedOrderBook(new OrderBook(bittrexBids, {}), new OrderBook(poloniexBids, {}));
      combinedOrderBook.combinedTotals.bid.forEach(ct => {
        expect(ct.bittrex).to.deep.equal(String(bittrexBids[ct.price] || 0));
        expect(ct.poloniex).to.deep.equal(String(poloniexBids[ct.price] || 0));
        expect(ct.combined).to.deep.equal(String((bittrexBids[ct.price] || 0) + (poloniexBids[ct.price] || 0)));
      })
    });

});