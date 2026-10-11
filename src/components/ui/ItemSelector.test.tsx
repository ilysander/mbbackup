import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ItemSelector, { ItemSelectorProps } from './ItemSelector';

const props: ItemSelectorProps = {
  accessibilityLabel:
    'paymentsserviceschooseproviderscreen_itemselector_company',
  selectedIndex: 0,
  onPress: jest.fn(),
  values: ['sample'],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ItemSelector {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ItemSelector {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
