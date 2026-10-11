import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {Currencies} from '../../../../resources/constants';
import {L} from '../../../../resources/language';
import {withCatch} from '../../../../resources/util/Tests';
import DPFOpenChooseScreen, {
  DPFOpenChooseScreenType,
  Props,
} from './DPFOpenChooseScreen';

const params: any = {
  currency: Currencies.PEN,
  accounts: [],
  dpf: {
    client: '1177429',
    product: '1726',
    amount: 1000,
    rate: 4.9,
    term: 721,
    amountgenerated: 1100.55,
  },
  user: {},
};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<DPFOpenChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<DPFOpenChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goToInfo', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;

    instance.goToInfo();
    expect(props.navigation.navigate).toBeCalled();
  });

  it('hideConfirmModal', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;

    instance.hideConfirmModal();
    expect(instance.state.showConfirmModal).toBe(false);
  });

  it('hideInvalidModal', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;

    instance.hideInvalidModal();
    expect(instance.state.showInvalidModal).toBe(false);
  });

  it('confirmModal', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;

    await instance.confirmModal();
    expect(instance.state.showConfirmModal).toBe(false);
    expect(instance.state.isLoading).toBe(false);
  });

  it('isValid', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.isValid()).toBe(false);
  });

  it('isValidAccountTarget', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.isValidAccountTarget()).toBe(false);
  });

  it('isValidAccountOrigin', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.isValidAccountOrigin()).toBe(false);
  });

  it('isValidAccountOriginBalance', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.isValidAccountOriginBalance()).toBe(true);
  });

  it('getAccountTargetPlaceholder', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.getAccountTargetPlaceholder()).toBe(
      L.dpfopenchoosescreen_accountselector_title_target_placeholder_pen,
    );
  });

  it('getErrorAccountTargetDifferentCurrency', () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.getErrorAccountTargetDifferentCurrency()).toBe(
      L.dpfopenchoosescreen_error_account_target_different_currency_pen,
    );
  });

  it('loadProfile', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    await instance.loadProfile();
  });
  it(
    'loadProfile withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenChooseScreenType;
      await instance.loadProfile();
    }),
  );

  it('load', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    await instance.load();
  });
  it(
    'load withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenChooseScreenType;
      await instance.load();
    }),
  );

  it('submit', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    await instance.submit();
  });
  it(
    'submit withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenChooseScreenType;
      await instance.submit();
    }),
  );

  it('changeTargetAccount', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    instance.changeTargetAccount(0);
  });

  it('changeOriginAccount', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    instance.changeOriginAccount(0);
  });

  it('getAccountTarget', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.getAccountTarget()).toEqual({});
  });

  it('getAccountOrigin', async () => {
    const wrapper = renderer.create(<DPFOpenChooseScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenChooseScreenType;
    expect(instance.getAccountOrigin()).toEqual({});
  });

  Session.save('sample');
});
