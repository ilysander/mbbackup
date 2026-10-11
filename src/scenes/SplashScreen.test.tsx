import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SplashScreen, {Props} from './SplashScreen';

const props: Props = {
  navigation: {navigate: jest.fn()} as any,
  route: {} as any,
};

it('timeout to be called', () => {
  renderer.create(<SplashScreen {...props} />);
  expect(setTimeout).toHaveBeenCalledTimes(1);
});
it('timeout check isReallyMounted', () => {
  const wrapper = renderer.create(<SplashScreen {...props} />);
  const instance = wrapper.getInstance() as any as SplashScreen;
  jest.runOnlyPendingTimers();
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(instance).toHaveProperty('isReallyMounted', true);
});
it('isReallyMounted mount', () => {
  const wrapper = renderer.create(<SplashScreen {...props} />);
  const instance = wrapper.getInstance() as any as SplashScreen;
  expect(instance).toHaveProperty('isReallyMounted', true);
  wrapper.unmount();
  expect(instance).toHaveProperty('isReallyMounted', false);
});

it('renders without crashing', () => {
  const snapshot = renderer.create(<SplashScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SplashScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
