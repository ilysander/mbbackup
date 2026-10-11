import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { withCatch, withPlatform } from '../../resources/util/Tests';
import NetworkManager, { NetworkManagerProps } from './NetworkManager';

const props: NetworkManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<NetworkManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it(
  'onChangeState using ios DEV',
  withPlatform('ios', async () => {
    const wrapper = renderer.create(<NetworkManager {...props} />);
    const instance = (wrapper.getInstance() as any) as NetworkManager;

    await instance.onChangeState({ isConnected: true } as any);

    jest.runOnlyPendingTimers();
    expect(instance.state.isConnected).toBe(true);
  })
);

it(
  'onChangeState using ios CATCH',
  withPlatform(
    'ios',
    withCatch(true, async () => {
      const wrapper = renderer.create(<NetworkManager {...props} />);
      const instance = (wrapper.getInstance() as any) as NetworkManager;

      await instance.onChangeState({ isConnected: true } as any);

      jest.runOnlyPendingTimers();

      expect(instance.state.isConnected).toBe(true);
    })
  )
);

it(
  'onChangeState using android DEV',
  withPlatform('android', async () => {
    const wrapper = renderer.create(<NetworkManager {...props} />);
    const instance = (wrapper.getInstance() as any) as NetworkManager;

    instance.setState({
      isConnected: true,
    });

    await instance.onChangeState({ isConnected: true } as any);

    jest.runOnlyPendingTimers();

    if (instance.state.isConnected) {
      expect(instance.state.isConnected).toBe(true);
    } else {
      expect(instance.state.isConnected).toBe(undefined);
    }
  })
);

it(
  'onChangeState using android CATCH',
  withPlatform(
    'ios',
    withCatch(true, async () => {
      const wrapper = renderer.create(<NetworkManager {...props} />);
      const instance = (wrapper.getInstance() as any) as NetworkManager;

      await instance.onChangeState({ isConnected: true } as any);

      jest.runOnlyPendingTimers();

      expect(instance.state.isConnected).toBe(true);
    })
  )
);

it('handleAppStateChange', () => {
  const wrapper = renderer.create(<NetworkManager {...props} />);
  const instance = (wrapper.getInstance() as any) as NetworkManager;
  instance.setState({
    appState: 'active',
  });
  instance.handleAppStateChange('active');
  expect(instance.state.appState).toBe('active');
});

it('handleAppStateChange', () => {
  const wrapper = renderer.create(<NetworkManager {...props} />);
  const instance = (wrapper.getInstance() as any) as NetworkManager;
  instance.setState({
    appState: 'inactive',
  });
  instance.handleAppStateChange('active');
  expect(instance.state.appState).toBe('active');
});

it('handleAppStateChange', () => {
  const wrapper = renderer.create(<NetworkManager {...props} />);
  const instance = (wrapper.getInstance() as any) as NetworkManager;
  instance.setState({
    appState: 'background',
  });
  instance.handleAppStateChange('background');
  expect(instance.state.appState).toBe('background');
});

it('updateState', async () => {
  const wrapper = renderer.create(<NetworkManager {...props} />);
  const instance = (wrapper.getInstance() as any) as NetworkManager;
  jest.runOnlyPendingTimers();

  await instance.updateState();

  jest.runOnlyPendingTimers();
  expect(instance.state.appState).toBe('active');
});
