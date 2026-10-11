import * as React from 'react';
import { View } from 'react-native';

import * as renderer from 'react-test-renderer';
import { withFocused } from './ScreenContainer';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const props: any = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
  } as any,
};

export interface TemplateProps {}

export interface TemplateState {}

class Template extends React.Component<TemplateProps, TemplateState> {
  static navigationOptions: NativeStackNavigationOptions = {};

  render() {
    return <View />;
  }
}

export interface Template2Props {}

export interface Template2State {}

class Template2 extends React.Component<Template2Props, Template2State> {
  render() {
    return <View />;
  }
}

it('renders without crashing without navigationOptions', () => {
  const Sample = withFocused<any, any>(Template2);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});
it('renders without crashing without navigation', () => {
  const localProps = {
    ...props,
    navigation: undefined,
  };
  const Sample = withFocused<any, any>(Template2);
  const snapshot = renderer.create(<Sample {...localProps} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('renders without crashing', () => {
  const Sample = withFocused<any, any>(Template);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const Sample = withFocused<any, any>(Template);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('didFocus', () => {
  const Sample = withFocused<any, any>(Template);
  const wrapper = renderer.create(<Sample {...props} />);
  const instance = wrapper.getInstance() as any;
  instance.didFocus();
  expect(instance.state.isFocused).toBe(true);
});

it('willBlur', () => {
  const Sample = withFocused<any, any>(Template);
  const wrapper = renderer.create(<Sample {...props} />);
  const instance = wrapper.getInstance() as any;
  instance.willBlur();
  expect(instance.state.isFocused).toBe(false);
});

it('unmount', () => {
  const Sample = withFocused<any, any>(Template);
  const wrapper = renderer.create(<Sample {...props} />);
  wrapper.unmount();
});

it('unmount without navigation', () => {
  const localProps = {};
  const Sample = withFocused<any, any>(Template2);
  const wrapper = renderer.create(<Sample {...localProps} />);
  wrapper.unmount();
});

it('getScreenRef', () => {
  const localProps = {};
  const Sample = withFocused<any, any>(Template2);
  const wrapper = renderer.create(<Sample {...localProps} />);
  const instance = wrapper.getInstance() as any;
  instance.getScreenRef();
});
