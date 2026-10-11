import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SelectAccountItem, { SelectAccountItemProps } from './SelectAccountItem';

const props: SelectAccountItemProps = {
  accessibilityLabel: 'modal_overlay',
  item: {} as any,
  selected: true,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SelectAccountItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SelectAccountItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
