import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import SignUpInvalidScreen, {
  Props,
  SignUpInvalidScreenType,
} from './SignUpInvalidScreen';

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

const stateInvalid = {
  isLoading: false,
};

describe('session', () => {
  it('renders without crashing', () => {
    const rendered = renderer
      .create(<SignUpInvalidScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer.create(<SignUpInvalidScreen {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<SignUpInvalidScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignUpInvalidScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<SignUpInvalidScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignUpInvalidScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });

  it('On Check Permissions', () => {
    const wrapper = renderer.create(<SignUpInvalidScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignUpInvalidScreenType;
    instance.setState(stateInvalid);
  });

  Session.save('sample');
});
