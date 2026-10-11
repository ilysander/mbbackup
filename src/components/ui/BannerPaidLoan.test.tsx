import * as React from 'react';
import * as renderer from 'react-test-renderer';
import BannerPaidLoan, { BannerPaidLoanProps } from './BannerPaidLoan';

const props: BannerPaidLoanProps = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<BannerPaidLoan {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<BannerPaidLoan {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
