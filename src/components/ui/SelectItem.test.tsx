import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SelectItem, { SelectItemProps } from './SelectItem';

const props: SelectItemProps = {
  item: 'test',
  accessibilityLabel:
    'paymentsserviceschooseproviderscreen_itemselector_company',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SelectItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});
