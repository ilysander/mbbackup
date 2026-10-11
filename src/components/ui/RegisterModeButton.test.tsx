import * as React from 'react';
import * as renderer from 'react-test-renderer';
import RegisterModeButton, {
  RegisterModeButtonProps,
} from './RegisterModeButton';
const props: RegisterModeButtonProps = {
  onPress: jest.fn(),
  title: 'test',
  imageSource: require('../../assets/images/arrow-icon.png'),
  accessibilityLabel: 'focus_toggle',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<RegisterModeButton {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<RegisterModeButton {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
