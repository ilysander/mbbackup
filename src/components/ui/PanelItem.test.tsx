import * as React from 'react';

import * as renderer from 'react-test-renderer';
import PanelItem, { PanelItemProps } from './PanelItem';

const props: PanelItemProps = {
  accessibilityLabel: 'transactionpaymentloan_panelitem_transaction_type',
  left: 'Descripción',
  right: 'TransferDescription',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<PanelItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PanelItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
