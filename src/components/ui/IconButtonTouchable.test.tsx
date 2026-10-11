import * as React from 'react';
import { Text } from 'react-native';
import * as renderer from 'react-test-renderer';
import IconButtonTouchable, { TouchableProps } from './IconButtonTouchable';

const props: TouchableProps = {
  accessibilityLabel: 'modal_overlay',
  onPress: jest.fn(),
  onLongPress: jest.fn(),
};

it('renders without crashing the UI', () => {
  const snapshot = renderer
    .create(
      <IconButtonTouchable {...props}>
        <Text>Testing</Text>
      </IconButtonTouchable>
    )
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just UI views', () => {
  const snapshot = renderer
    .create(
      <IconButtonTouchable {...props}>
        <Text>Testing</Text>
      </IconButtonTouchable>
    )
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
