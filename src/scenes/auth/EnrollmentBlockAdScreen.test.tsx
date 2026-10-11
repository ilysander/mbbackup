import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import EnrollmentBlockAdScreen, {
  Props,
  EnrollmentBlockAdScreenType,
} from './EnrollmentBlockAdScreen';

const params: any = {};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const rendered = renderer
      .create(<EnrollmentBlockAdScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer
      .create(<EnrollmentBlockAdScreen {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<EnrollmentBlockAdScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlockAdScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<EnrollmentBlockAdScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlockAdScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });
});
