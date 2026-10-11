import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ExchangeRate, { ExchangeRateProps } from './ExchangeRate';

const props: ExchangeRateProps = {
  exchangeRate: '2',
  debitAmount: '22',
  currencyLabel: 'Cambio',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ExchangeRate {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ExchangeRate {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
