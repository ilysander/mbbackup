import * as React from 'react';
import * as renderer from 'react-test-renderer';
import IconButton, { IconButtonProps } from './IconButton';

const props: IconButtonProps = {
  accessibilityLabel: 'accountlist_accountca',
  source: require('../../assets/images/cable-icon.png'),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<IconButton {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<IconButton {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
