import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FeeItem, { FeeItemProps } from './FeeItem';

const props: FeeItemProps = {
  accessibilityLabel: 'modal_overlay',
  item: {},
  index: 0,
  currency: '1',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FeeItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FeeItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
