import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withCatch, withFetchConfig} from '../../../../resources/util/Tests';
import TransfersMyAccountsSuccessScreen, {
  Props,
  TransfersMyAccountsSuccessScreenType,
} from './TransfersMyAccountsSuccessScreen';

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
    const snapshot = renderer
      .create(<TransfersMyAccountsSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersMyAccountsSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goToProfile', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
    instance.goToProfile();
    expect(instance.props.navigation.navigate).toHaveBeenCalled();
  });

  it('goToTransfersMenu', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
    instance.goToTransfersMenu();
    expect(instance.props.navigation.navigate).toHaveBeenCalled();
  });

  it('handleBackPress', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
    expect(instance.handleBackPress()).toBe(false);
  });

  it('load', async () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
    await instance.load();
    expect(instance.state.isLoading).toBe(false);
  });

  it(
    'load',
    withFetchConfig({session: 'default'}, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsSuccessScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
      await instance.load();
      expect(instance.state.resume).not.toEqual(null);
    }),
  );

  it(
    'load with catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsSuccessScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsSuccessScreenType;
      instance.load();
      expect(instance.state.resume).not.toEqual(null);
    }),
  );
  Session.save('sample');
});
