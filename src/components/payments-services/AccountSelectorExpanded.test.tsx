import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AccountSelectorExpanded, {
  AccountSelectorExpandedProps,
} from './AccountSelectorExpanded';

const props: AccountSelectorExpandedProps = {
  accessibilityLabel: 'test',
  selectedIndex: 1,
  onPress: jest.fn(),
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
    },
  ] as any,
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<AccountSelectorExpanded {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<AccountSelectorExpanded {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
