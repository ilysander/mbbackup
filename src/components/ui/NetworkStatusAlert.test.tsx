import * as React from 'react';

import * as renderer from 'react-test-renderer';
import NetworkStatusAlert from './NetworkStatusAlert';

it('renders without crashing', () => {
  const wrapper = renderer.create(<NetworkStatusAlert />);
  const instance = (wrapper.getInstance() as any) as NetworkStatusAlert;
  instance.setState({ isConnected: false });
  const snapshot = wrapper.toJSON();

  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<NetworkStatusAlert />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onChangeState', () => {
  const goodProps = {
    onChangeNetworkStatus: jest.fn() as any,
  };

  const wrapper = renderer.create(<NetworkStatusAlert {...goodProps} />);
  const instance = (wrapper.getInstance() as any) as NetworkStatusAlert;

  instance.onChangeNetworkState({ isConnected: true });
  expect(instance.state.isConnected).toBe(true);

  instance.onChangeNetworkState({ isConnected: false });
  expect(instance.state.isConnected).toBe(false);
});

it('isReallyMounted mount', () => {
  const wrapper = renderer.create(<NetworkStatusAlert />);
  wrapper.unmount();
});
