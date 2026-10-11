import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ChipRow, { ChipRowProps } from './ChipRow';

const props: ChipRowProps = {
  accessibilityLabel: 'focus_toggle',
  item: {
    totalAmount: 1,
  },
  currencyKey: '1',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ChipRow {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ChipRow {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
