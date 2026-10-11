import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import TransfersOtherBanksChooseScreen, {
  Props,
  TransfersOtherBanksChooseScreenType,
} from './TransfersOtherBanksChooseScreen';

const params: any = {
  accounts: [
    {
      idEnvironment: 0,
      idProduct: '31725128',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Cuenta ahorro negocios (ME) 6009812324',
      extraInfo: '3|1415|496|2|6009812324|0|0|8|3',
      currency: '2',
      number: '6009812324',
      consolidatedAmount: 0,
      position: 970,
      canRead: false,
      permissions: null,
      cci: '04949600600981232437',
      availableBalance: 970,
      balance: 970,
      rate: 0,
      category: 'anDolares',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '31725125',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Ahorro Fácil (MN) 6009812294',
      extraInfo: '3|1412|496|1|6009812294|0|0|8|3',
      currency: '1',
      number: '6009812294',
      consolidatedAmount: 0,
      position: 960,
      canRead: false,
      permissions: null,
      cci: '04949600600981229432',
      availableBalance: 960,
      balance: 960,
      rate: 0,
      category: 'afSoles',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '31725127',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Ahorro Fácil (ME) 6009812316',
      extraInfo: '3|1413|496|2|6009812316|0|0|8|3',
      currency: '2',
      number: '6009812316',
      consolidatedAmount: 0,
      position: 920.79,
      canRead: false,
      permissions: null,
      cci: '04949600600981231633',
      availableBalance: 920.79,
      balance: 920.79,
      rate: 0,
      category: 'afDolares',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '31725126',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Cuenta ahorro negocios (MN) 6009812308',
      extraInfo: '3|1414|496|1|6009812308|0|0|8|3',
      currency: '1',
      number: '6009812308',
      consolidatedAmount: 0,
      position: 1050,
      canRead: false,
      permissions: null,
      cci: '04949600600981230830',
      availableBalance: 1050,
      balance: 1050,
      rate: 0,
      category: 'anSoles',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '13979999',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Full ahorro (MN) 6000031672',
      extraInfo: '3|1416|454|1|6000031672|0|0|8|3',
      currency: '1',
      number: '6000031672',
      consolidatedAmount: 0,
      position: 1499.95,
      canRead: false,
      permissions: null,
      cci: '04945400600003167223',
      availableBalance: 1499.95,
      balance: 1499.95,
      rate: 0,
      category: 'faSoles',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '31725129',
      productType: 'CC',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Mi Chequera (MN) 5000004016',
      extraInfo: '2|1408|496|1|5000004016|0|0|10|2',
      currency: '1',
      number: '5000004016',
      consolidatedAmount: 0,
      position: 1499.95,
      canRead: false,
      permissions: null,
      cci: '04949600500000401637',
      availableBalance: 1499.95,
      balance: 1499.95,
      rate: 0,
      category: 'ccSoles',
      family: '10',
    },
  ],
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
      .create(<TransfersOtherBanksChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('loading data', async () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.goBack();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('loading data', async () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    await instance.load();
    expect(instance.state.accounts.length).toEqual(params.accounts.length);
  });

  it('tryToSubmit', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });

  it('tryToSubmit twice', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.tryToSubmit();
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });

  it('changeCurrency', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.changeCurrency(1);
    expect(instance.state.indexCurrency).toBe(1);
    instance.amountInput && expect(instance.amountInput.getValue()).toBe(0);
  });

  it('onSubmitEditingTarget invalid', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    expect(instance.isValidTarget()).toBe(false);
    instance.onSubmitEditingTarget();
  });
  it('onSubmitEditingTarget valid', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    expect(instance.isValidTarget()).toBe(false);
    instance.targetInput &&
      instance.targetInput.setValue('12345678912345678900');
    expect(instance.isValidTarget()).toBe(true);
    instance.onSubmitEditingTarget();
  });

  it('getAccountOrigin invalid', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.setState({indexOrigin: -1});
    expect(JSON.stringify(instance.getAccountOrigin())).toBe(undefined);
  });
  it('clearAmount', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.amountInput && instance.amountInput.setValue('0');
    instance.clearAmount();
    instance.amountInput && expect(instance.amountInput.getValue()).toBe(0);
  });
  it('clearAmount valid', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.amountInput && instance.amountInput.setValue('100');
    instance.clearAmount();
    instance.amountInput && expect(instance.amountInput.getValue()).toBe(100);
  });
  it('onChangeTarget', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.onChangeTarget('12345678912345678900');
  });
  it('onChangeTarget empty', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.onChangeTarget('');
  });

  it('onBlurTarget', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.onBlurAmount();
    expect(instance.isValidAmount()).toBe(false);
  });

  it('onBlurAmount unmounted', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    instance.amountInput = null;
    instance.onBlurAmount();
  });

  it('isValidAmount', async () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    expect(instance.isValidAmount()).toBe(false);
    instance.changeOriginAccount(3);
    instance.amountInput && instance.amountInput.setValue('99999999');
    expect(instance.isValidAmount()).toBe(false);
  });

  it('submit invalid all', async () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksChooseScreenType;
    expect(instance.isValid()).toBe(false);
    instance.amountInput && instance.amountInput.setValue('0');
    instance.targetInput && instance.targetInput.setValue('123');
    await instance.submit();
    expect(instance.isValid()).toBe(false);
  });

  it(
    'loading data with empty',
    withFetchConfig({session: 'empty'}, async () => {
      const wrapper = renderer.create(
        <TransfersOtherBanksChooseScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersOtherBanksChooseScreenType;
      await instance.submit();
      expect(instance.state.accounts.length).toBe(6);
      expect(instance.state.isLoading).toBe(false);
    }),
  );
  it(
    'loading data with status code error',
    withFetchConfig({session: 'status-code'}, async () => {
      const wrapper = renderer.create(
        <TransfersOtherBanksChooseScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersOtherBanksChooseScreenType;
      await instance.submit();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  Session.save('sample');
});
