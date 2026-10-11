import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ForgotPasswordSuccessScreen, {
  Props,
  ForgotPasswordSuccessScreenType,
} from './ForgotPasswordSuccessScreen';

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
  renderer.create(<ForgotPasswordSuccessScreen {...props} />);
  expect(setTimeout).toHaveBeenCalledTimes(0);
});
it('timeout check isReallyMounted', () => {
  const wrapper = renderer.create(<ForgotPasswordSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordSuccessScreenType;
  jest.runOnlyPendingTimers();
  expect(setTimeout).toHaveBeenCalledTimes(0);
  expect(instance).toHaveProperty('isReallyMounted', true);
});
it('isReallyMounted mount', () => {
  const wrapper = renderer.create(<ForgotPasswordSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordSuccessScreenType;
  expect(instance).toHaveProperty('isReallyMounted', true);
  wrapper.unmount();
  expect(instance).toHaveProperty('isReallyMounted', false);
});

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<ForgotPasswordSuccessScreen {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('handleBackPress', () => {
  const wrapper = renderer.create(<ForgotPasswordSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordSuccessScreenType;

  expect(instance.handleBackPress()).toBe(false);
});

it('goToAuth', () => {
  const wrapper = renderer.create(<ForgotPasswordSuccessScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordSuccessScreenType;
  instance.goToAuth();
  expect(props.navigation.navigate).toHaveBeenCalled();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<ForgotPasswordSuccessScreen {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
