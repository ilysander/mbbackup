import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FrequentContact, { FrequentContactProps } from './FrequentContact';

const frequentContact = {
  currency: 1,
  accountNumber: '123456789',
};
const props: FrequentContactProps = {
  accessibilityLabel: 'modal_overlay',
  frequentContact,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FrequentContact {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('with style', () => {
  const props: FrequentContactProps = {
    accessibilityLabel: 'modal_overlay',
    frequentContact: {
      currency: 1,
      accountNumber: '123456789',
    },
    containerStyle: {},
  };
  const snapshot = renderer.create(<FrequentContact {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views', () => {
  const snapshot = renderer.create(<FrequentContact {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
