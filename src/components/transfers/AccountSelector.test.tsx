import * as React from 'react';

import * as renderer from 'react-test-renderer';
import AccountSelector, { AccountSelectorProps } from './AccountSelector';

const props: AccountSelectorProps = {
  selectedIndex: 0,
  accessibilityLabel: 'sample',
  values: [
    {
      shortLabel: '',
      number: '123',
      balance: 123,
      category: 'CC',
      productType: 'DPF',
      availableBalance: 123,
      currency: '1',
      cci: '12313123',
    } as any,
  ],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AccountSelector {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AccountSelector {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
