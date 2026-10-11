import * as React from 'react';
import { View } from 'react-native';
import * as renderer from 'react-test-renderer';
import { withMore } from './MoreContainer';

const props: any = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
  } as any,
};

export interface TemplateProps { }

export interface TemplateState { }

class Template extends React.Component<TemplateProps, TemplateState> {

  render() {
    return <View />;
  }
}

export interface Template2Props { }

export interface Template2State { }

class Template2 extends React.Component<Template2Props, Template2State> {
  render() {
    return <View />;
  }
}

it('renders without crashing without navigationOptions', () => {
  const Sample = withMore<any, any>(Template2);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});
it('renders without crashing without navigation', () => {
  const localProps = {
    ...props,
    navigation: undefined,
  };
  const Sample = withMore<any, any>(Template2);
  const snapshot = renderer.create(<Sample {...localProps} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('renders without crashing', () => {
  const Sample = withMore<any, any>(Template);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const Sample = withMore<any, any>(Template);
  const snapshot = renderer.create(<Sample {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('unmount', () => {
  const Sample = withMore<any, any>(Template);
  const wrapper = renderer.create(<Sample {...props} />);
  wrapper.unmount();
});

it('unmount without navigation', () => {
  const localProps = {};
  const Sample = withMore<any, any>(Template2);
  const wrapper = renderer.create(<Sample {...localProps} />);
  wrapper.unmount();
});
