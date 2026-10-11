import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonShortcut, {ButtonShortcutProps} from './ButtonShortcut';

const props: ButtonShortcutProps = {
  accessibilityLabel: 'analytics_test',
  title: 'test text',
  imageSource: require('../../assets/images/shortcut-payments.png'),
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ButtonShortcut {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ButtonShortcut {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress', () => {
  const wrapper = renderer.create(<ButtonShortcut {...props} />);
  const instance = wrapper.getInstance() as any as ButtonShortcut;
  instance.onPress({} as any);
});
