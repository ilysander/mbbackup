import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ActionMenuItem, { ActionMenuItemProps } from './ActionMenuItem';

const props: ActionMenuItemProps = {
  accessibilityLabel: 'modal_overlay',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ActionMenuItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ActionMenuItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
