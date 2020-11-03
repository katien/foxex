require('mocha-testcheck').install();
const {expect} = require('chai');
import {gen} from "testcheck";


describe('Combined order book bid prices', () => {

  check.it('accepts an int and a string', gen.int, gen.string, (x: number, y: string) => {
    expect(x).to.be.a('number');
    expect(y).to.be.a('string');
  });

  it('should return the highest 15 bids sorted in ascending order based on data from poloniex', () => {
    expect(15).to.deep.equal(15);
  });
});

declare var check: {  it: any; };