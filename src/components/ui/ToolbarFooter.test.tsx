import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ToolbarFooter, { ToolbarFooterProps } from './ToolbarFooter';
import { View } from 'react-native';

const props: ToolbarFooterProps = {
  children: <View />,
  accessibilityLabel: 'sample',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ToolbarFooter {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ToolbarFooter {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
