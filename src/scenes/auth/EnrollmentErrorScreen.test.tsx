import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import EnrollmentBlockValScreen, {
  Props,
  EnrollmentBlockValScreenType,
} from './EnrollmentBlockValScreen';

const params: any = {};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
  route: {} as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const rendered = renderer
      .create(<EnrollmentBlockValScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer
      .create(<EnrollmentBlockValScreen {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<EnrollmentBlockValScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlockValScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<EnrollmentBlockValScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlockValScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });
});
