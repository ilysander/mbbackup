import * as React from 'react';
import { View } from 'react-native';
import * as renderer from 'react-test-renderer';
import { withPlatform } from '../../resources/util/Tests';
import HandleError, { HandleErrorProps } from './HandleError';

const state = {
  handleError: false,
};
const props: HandleErrorProps = {
  accessibilityLabel: 'test',
  children: <View />,
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<HandleError {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it(
  'render just views ios',
  withPlatform('ios', async () => {
    const snapshot = renderer.create(<HandleError {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  })
);

it(
  'render just views android',
  withPlatform('android', async () => {
    const snapshot = renderer.create(<HandleError {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  })
);

it('test component did catch', () => {
  const wrapper = renderer.create(<HandleError {...props} />);
  const instance = (wrapper.getInstance() as any) as HandleError;
  instance.setState(state);
  instance.componentDidCatch(new Error('ha ocurrido un error'));
});

it(
  'test component did catch',
  withPlatform('android', async () => {
    const wrapper = renderer.create(<HandleError {...props} />);
    const instance = (wrapper.getInstance() as any) as HandleError;
    instance.setState(state);
    instance.componentDidCatch(new Error('ha ocurrido un error'));
  })
);

it('test onPress', () => {
  const wrapper = renderer.create(<HandleError {...props} />);
  const instance = (wrapper.getInstance() as any) as HandleError;
  instance.setState(state);
  instance.onPress();
  const isMessageErrorVisible = instance.state.handleError;
  expect(isMessageErrorVisible).toBe(false);
});
