import {expect} from 'chai';
import 'mocha';
import {CombinedOrderBook} from "../types/CombinedOrderBook";
import {OrderBook, Totals} from "../types/OrderBook";

describe('Combined order book bid prices', () => {

  it('should return the highest 15 bids sorted in ascending order based on data from bittrex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let bids = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook(bids, {}), new OrderBook({}, {}));
    let bidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);
    expect(bidPrices).to.deep.equal(prices.reverse().slice(0, 15));
  });

  it('should return the highest 15 bids sorted in ascending order based on data from poloniex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let bids = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook(bids, {}));
    let bidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);
    expect(bidPrices).to.deep.equal(prices.reverse().slice(0, 15));
  });

  it('should return the highest 15 bids sorted in ascending order based on data from both platforms', () => {
    let bittrerxPrices = Array.from(Array(10).keys()).map(p => p.toString()); // 0..10
    let bittrerxBids = generateTotalsFromPriceArray(bittrerxPrices);
    let poloniexPrices = Array.from(Array(20).keys()).map(p => p.toString()); // 0..20
    let poloniexBids = generateTotalsFromPriceArray(poloniexPrices);

    const combinedOrderBook = new CombinedOrderBook(new OrderBook(bittrerxBids, {}), new OrderBook(poloniexBids, {}));
    let bidPrices = combinedOrderBook.combinedTotals.bid.map(b => b.price);
    expect(bidPrices.length).to.equal(15);
    expect(bidPrices).to.deep.equal(Array.from(Array(20).keys()).map(p => p.toString()).reverse().slice(0, 15)); // 5..20
  });
});


describe('Combined order book ask prices', () => {
  it('should return the lowest 15 asks sorted in descending order based on data from bittrex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let asks = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, asks), new OrderBook({}, {}));
    let askPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);
    expect(askPrices).to.deep.equal(prices.slice(0, 15).reverse());
  });

  it('should return the lowest 15 asks sorted in descending order based on data from poloniex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let asks = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook({}, asks));
    let askPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);

    expect(askPrices).to.deep.equal(prices.slice(0, 15).reverse());
  });

  it('should return the lowest 15 asks sorted in descending order based on data from both platforms', () => {
    let bittrerxPrices = Array.from(Array(10).keys()).map(p => p.toString()); // 0..10
    let bittrerxAsks = generateTotalsFromPriceArray(bittrerxPrices);
    let poloniexPrices = Array.from(Array(20).keys()).map(p => p.toString()); // 0..20
    let poloniexAsks = generateTotalsFromPriceArray(poloniexPrices);

    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, bittrerxAsks), new OrderBook({}, poloniexAsks));
    let askPrices = combinedOrderBook.combinedTotals.ask.map(a => a.price);

    expect(askPrices.length).to.equal(15);
    expect(askPrices).to.deep.equal(Array.from(Array(20).keys()).map(p => p.toString()).slice(0, 15).reverse()); // 15..0
  });
});


describe('Combined order book totals', () => {
  it('should return correct combined totals for each price', () => {
    let bittrexBid: Totals = [1, 2, 3, 4, 5, 6, 9, 12, 23, 27, 34, 56].reduce((a: Totals, b: number) => {
      a[String(b)] = b * 2;
      return a;
    }, {});
    let poloniexBid: Totals = [1, 2, 3, 4, 5, 6, 9, 12, 23, 27, 34, 56].reduce((a: Totals, p: number) => {
      a[String(p)] = p;
      return a;
    }, {});

    const combinedOrderBook = new CombinedOrderBook(new OrderBook(bittrexBid, {}), new OrderBook(poloniexBid, {}));
    let bidTotals = combinedOrderBook.combinedTotals.bid;
    for (const t of bidTotals) {
      expect(t.combined).to.equal(String(Number(t.bittrex) + Number(t.poloniex)));
      expect(t.combined).to.equal(String(bittrexBid[t.price] + poloniexBid[t.price]));
    }
  });
});

function generateTotalsFromPriceArray(prices: string[]) {
  return prices.reduce((a: Totals, b: string) => {
    a[b] = 1;
    return a;
  }, {});
}