import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import EnrollmentBlackListScreen, {
  Props,
  EnrollmentBlackListScreenType,
} from './EnrollmentBlackListScreen';

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
      .create(<EnrollmentBlackListScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer
      .create(<EnrollmentBlackListScreen {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<EnrollmentBlackListScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlackListScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<EnrollmentBlackListScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentBlackListScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });
});
