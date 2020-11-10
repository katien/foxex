import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders bid and ask titles and exchange labels', () => {
  render(<App />);

  // Clearly label which is ask book and which is the bids book
  const askTitleElement = screen.getByText(/ask/i);
  expect(askTitleElement).toBeInTheDocument();
  const bidTitleElement = screen.getByText(/bid/i);
  expect(bidTitleElement).toBeInTheDocument();

  // Clearly label which exchange has order volume at each price point
  const poloniexLabels = screen.getAllByText(/Poloniex/i);
  expect(poloniexLabels.length).toEqual(2);
  const bittrrexLabels = screen.getAllByText(/Bittrex/i);
  expect(bittrrexLabels.length).toEqual(2);
});
