import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TypesItem, { TypesItemProps } from './TypesItem';

const props: TypesItemProps = {
  accessibilityLabel: 'modal_overlay',
  title: 'transferencias a terceros',
  onPress: jest.fn(),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<TypesItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TypesItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
