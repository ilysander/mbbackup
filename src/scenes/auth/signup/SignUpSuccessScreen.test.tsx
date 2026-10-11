import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SignUpSuccessScreen, {
  Props,
  SignUpSuccessScreenType,
} from './SignUpSuccessScreen';

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

it('timeout to be called', () => {
  renderer.create(<SignUpSuccessScreen {...props} />);
  expect(setTimeout).toHaveBeenCalledTimes(1);
});
it('timeout check isReallyMounted', () => {
  const wrapper = renderer.create(<SignUpSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpSuccessScreenType;
  jest.runOnlyPendingTimers();
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(instance).toHaveProperty('isReallyMounted', true);
});
it('isReallyMounted mount', () => {
  const wrapper = renderer.create(<SignUpSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpSuccessScreenType;
  expect(instance).toHaveProperty('isReallyMounted', true);
  wrapper.unmount();
  expect(instance).toHaveProperty('isReallyMounted', false);
});

it('renders without crashing', () => {
  const snapshot = renderer.create(<SignUpSuccessScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('handleBackPress', () => {
  const wrapper = renderer.create(<SignUpSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpSuccessScreenType;

  expect(instance.handleBackPress()).toBe(false);
});

it('goToAuth', () => {
  const wrapper = renderer.create(<SignUpSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpSuccessScreenType;
  instance.goToAuth();
  expect(props.navigation.navigate).toHaveBeenCalled();
});

it('render just views', () => {
  const snapshot = renderer.create(<SignUpSuccessScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
