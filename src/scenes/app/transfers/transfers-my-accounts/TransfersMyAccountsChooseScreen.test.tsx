import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {Currencies} from '../../../../resources/constants';
import {withCatch, withFetchConfig} from '../../../../resources/util/Tests';
import TransfersMyAccountsChooseScreen, {
  Props,
  TransfersMyAccountsChooseScreenType,
} from './TransfersMyAccountsChooseScreen';

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
      .create(<TransfersMyAccountsChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersMyAccountsChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('loading data', async () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    await instance.load();
    expect(instance.state.accounts.length).toEqual(params.accounts.length);
  });
  it('tryToSubmit', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });
  it('tryToSubmit twice', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.tryToSubmit();
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });

  it('changeTargetAccount', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.changeTargetAccount(0);
    expect(instance.state.indexTarget).toBe(0);
  });

  it('render just views', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.setState({
      indexOrigin: 1,
      indexTarget: 1,
    });
    instance.changeOriginAccount(1);
  });

  it('getAccountOrigin invalid', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.setState({indexOrigin: -1});
    expect(JSON.stringify(instance.getAccountOrigin())).toBeUndefined();
  });

  it('clearAmount', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    if (instance.amountInput) {
      instance.amountInput.setValue('0');
      instance.clearAmount();
      expect(instance.amountInput.getValue()).toBe(0);
    }
  });
  it('clearAmount valid', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    if (instance.amountInput) {
      instance.amountInput.setValue('100');
      instance.clearAmount();
      expect(instance.amountInput.getValue()).toBe(100);
    }
  });

  it('clearAmount valid', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    if (instance.amountInput) {
      instance.amountInput.setValue('100');
      instance.clearAmount();
      expect(instance.amountInput.getValue()).toBe(100);
    }
  });

  it('getCurrency Soles', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    const currencySoles = {
      label: '1',
      name: 'Soles',
      symbol: 'S/',
      code: 'PEN',
    };

    instance.setState({
      indexCurrency: 0,
      currencies: [Currencies.PEN, Currencies.USD],
    });
    expect(instance.getCurrency()).toEqual(currencySoles);
  });

  it('getCurrency Dolares', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    const currencyDolares = {
      label: '2',
      name: 'Dólares',
      symbol: '$',
      code: 'USD',
    };
    instance.setState({
      indexCurrency: 1,
      currencies: [Currencies.PEN, Currencies.USD],
    });
    expect(instance.getCurrency()).toEqual(currencyDolares);
  });

  it('getAccountTarget', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.setState({
      indexTarget: -1,
    });
    expect(instance.getAccountTarget()).toBeUndefined();
  });

  it('isValidAmount', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    expect(instance.isValidAmount()).toBe(false);
    instance.changeOriginAccount(0);
    if (instance.amountInput) {
      instance.amountInput.setValue('1500000000');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 2,
      });
      expect(instance.isValidAmount()).toBe(false);
    }
  });

  it('isValidAmount', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    expect(instance.isValidAmount()).toBe(false);
    if (instance.amountInput) {
      instance.amountInput.setValue('100');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 3,
      });
      expect(instance.isValidAmount()).toBe(true);
    }
  });

  it('isNotValidAmount', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    expect(instance.isValidAmount()).toBe(false);
    instance.changeOriginAccount(0);
    if (instance.amountInput) {
      instance.amountInput.setValue('0');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 2,
      });
      expect(instance.isValidAmount()).toBe(false);
    }
  });

  it('isValidFundsUSD', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.setState({
      indexOrigin: 1,
      indexTarget: 2,
    });
    instance.isValidFundsUSD(0);
    expect(instance.isValidFundsUSD(0)).toBe(false);
  });

  it('isValidFundsPEN', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.setState({
      indexOrigin: 1,
      indexTarget: 2,
    });
    instance.isValidFundsPEN(0);
    expect(instance.isValidFundsPEN(0)).toBe(true);
  });

  it('thereAreSufficientFundsUSD', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.changeOriginAccount(0);
    expect(instance.isValidFundsUSD(10)).toBe(false);
  });

  it('thereAreSufficientFundsPEN', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    instance.changeOriginAccount(0);
    expect(instance.isValidFundsUSD(100)).toBe(false);
  });

  it('submit data', async () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsChooseScreenType;
    expect(instance.isValid()).toBe(false);
    instance.changeOriginAccount(0);

    instance.amountInput && instance.amountInput.setValue('60');

    instance.setState({
      indexOrigin: 1,
      indexTarget: 2,
    });
    expect(instance.isValid()).toBe(true);
    await instance.submit();
    expect(instance.state.isLoading).toBe(false);
  });
  it(
    'submit data with exception',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsChooseScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsChooseScreenType;
      expect(instance.isValid()).toBe(false);
      instance.changeOriginAccount(0);
      instance.amountInput && instance.amountInput.setValue('100');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 2,
      });
      expect(instance.isValid()).toBe(true);
      await instance.submit();
    }),
  );
  it(
    'submit data with status code error',
    withFetchConfig({session: 'status-code'}, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsChooseScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsChooseScreenType;
      expect(instance.isValid()).toBe(false);
      instance.changeOriginAccount(0);
      instance.amountInput && instance.amountInput.setValue('80');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 2,
      });
      expect(instance.isValid()).toBe(true);
      await instance.submit();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsChooseScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsChooseScreenType;
      expect(instance.isValid()).toBe(false);
      instance.changeOriginAccount(0);
      instance.amountInput && instance.amountInput.setValue('60');
      instance.setState({
        indexOrigin: 1,
        indexTarget: 2,
      });
      expect(instance.isValid()).toBe(true);
      await instance.submit();
      expect(instance.state.isLoading).toBe(false);
    }),
  );
  Session.save('sample');
});
