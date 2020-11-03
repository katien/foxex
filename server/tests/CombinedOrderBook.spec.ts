import {expect} from 'chai';
import 'mocha';
import {CombinedOrderBook} from "../types/CombinedOrderBook";
import {OrderBook, Totals} from "../types/OrderBook";

describe('Combined order book bid prices', () => {

  it('should return the highest 15 bids sorted in ascending order based on data from bittrex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let bids = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook(bids, {}), new OrderBook({}, {}));
    let bidPrices = Object.keys(combinedOrderBook.combinedTotals.bid);
    expect(bidPrices).to.deep.equal(prices.slice(5, prices.length));
  });

  it('should return the highest 15 bids sorted in ascending order based on data from poloniex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let bids = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook(bids, {}));
    let bidPrices = Object.keys(combinedOrderBook.combinedTotals.bid);
    expect(bidPrices).to.deep.equal(prices.slice(5, prices.length));
  });

  it('should return the highest 15 bids sorted in ascending order based on data from both platforms', () => {
    let bittrerxPrices = Array.from(Array(10).keys()).map(p => p.toString()); // 0..10
    let bittrerxBids = generateTotalsFromPriceArray(bittrerxPrices);
    let poloniexPrices = Array.from(Array(20).keys()).map(p => p.toString()); // 0..20
    let poloniexBids = generateTotalsFromPriceArray(poloniexPrices);

    const combinedOrderBook = new CombinedOrderBook(new OrderBook(bittrerxBids, {}), new OrderBook(poloniexBids, {}));
    let bidPrices = Object.keys(combinedOrderBook.combinedTotals.bid);
    expect(bidPrices.length).to.equal(15);
    expect(bidPrices).to.deep.equal(Array.from(Array(15).keys()).map(p => (p + 5).toString())); // 5..20
  });
});


describe('Combined order book ask prices', () => {
  it('should return the lowest 15 asks sorted in descending order based on data from bittrex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let asks = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, asks), new OrderBook({}, {}));
    let askPrices = Object.keys(combinedOrderBook.combinedTotals.ask);
    expect(askPrices).to.deep.equal(prices.slice(0, 15).reverse());
  });

  it('should return the lowest 15 asks sorted in descending order based on data from poloniex', () => {
    let prices = Array.from(Array(20).keys()).map(p => p.toString());
    let asks = generateTotalsFromPriceArray(prices);
    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, {}), new OrderBook({}, asks));
    let askPrices = Object.keys(combinedOrderBook.combinedTotals.ask);
    expect(askPrices).to.deep.equal(prices.slice(0, 15).reverse());
  });

  it('should return the lowest 15 asks sorted in descending order based on data from both platforms', () => {
    let bittrerxPrices = Array.from(Array(10).keys()).map(p => p.toString()); // 0..10
    let bittrerxAsks = generateTotalsFromPriceArray(bittrerxPrices);
    let poloniexPrices = Array.from(Array(20).keys()).map(p => p.toString()); // 0..20
    let poloniexAsks = generateTotalsFromPriceArray(poloniexPrices);

    const combinedOrderBook = new CombinedOrderBook(new OrderBook({}, bittrerxAsks), new OrderBook({}, poloniexAsks));
    let askPrices = Object.keys(combinedOrderBook.combinedTotals.ask);
    expect(askPrices.length).to.equal(15);
    expect(askPrices).to.deep.equal(Array.from(Array(15).keys()).reverse().map(p => p.toString())); // 0..15
  });
});

function generateTotalsFromPriceArray(prices: string[]) {
  return prices.reduce((a: Totals, b: string) => {
    a[b] = 1;
    return a;
  }, {});
}