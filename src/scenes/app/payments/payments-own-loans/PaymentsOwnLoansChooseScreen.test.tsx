import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import PaymentsOwnLoansChooseScreen, {
  PaymentsOwnLoansChooseScreenType,
  Props,
} from './PaymentsOwnLoansChooseScreen';

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
  loan: {
    idEnvironment: 0,
    idProduct: '16115071',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Préstamo Vivienda 105396907',
    extraInfo: '5|1520|463|1|105396907|0|0|1|12',
    currency: '1',
    number: '1520',
    consolidatedAmount: 0,
    position: 30302.59,
    canRead: false,
    permissions: null,
    loanAmount: 30214.49,
    amountPerDayOfLateness: 3634.78,
    totalAmountOfFees: 1066.35,
    currentCapitalBalance: 3302.59,
    nextFeeAmount: 4701.13,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-07-16T00:00:00.000-0500',
    paymentDate: '2015-09-09T00:00:00.000-0500',
    paidFees: 33,
    totalFees: 36,
    apr: 22.56,
    aprc: 23.18,
    creditLineProductID: null,
    category: 'Vivienda',
    loanNumber: '105396907',
    subFamily: '12',
    family: '1',
  },
};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    pop: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsOwnLoansChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsOwnLoansChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('test goBack', async () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.goBack();
  });

  it('isValid', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    expect(instance.isValid()).toBe(false);
    jest.runOnlyPendingTimers();
  });

  it('submit', async () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.setState({indexOrigin: 0});
    await instance.submit();
  });

  it('tryToSubmit', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });

  it('tryToSubmit twice', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.tryToSubmit();
    instance.tryToSubmit();
    jest.runOnlyPendingTimers();
  });

  it('getAccountOrigin', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.setState({indexOrigin: 0});
    expect(instance.getAccountOrigin()).toEqual(params.accounts[0]);
  });

  it('getAccountOrigin without indexOrigin', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    expect(instance.getAccountOrigin()).toEqual({});
  });

  it('unmount', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    wrapper.unmount();
  });

  it('load', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.load();
  });

  it('isSameCurrency', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    expect(instance.isSameCurrency()).toBe(true);
  });

  it('changeOriginAccount', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.changeAccountOrigin(0);
  });

  it('isValidSilent', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.isValidSilent();
  });

  it('isValidSomeAccountOrigin', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.isValidSomeAccountOrigin();
  });

  it('isValidAccountOrigin', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.isValidAccountOrigin();
  });

  it('isValidPartial', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.isValidPartial();
  });

  it('isValidFunds', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansChooseScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansChooseScreenType;
    instance.isValidFunds(100);
  });

  Session.save('sample');
});
