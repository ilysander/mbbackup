import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import DPFOpenConfirmScreen, {
  DPFOpenConfirmScreenType,
  Props,
} from './DPFOpenConfirmScreen';
import {ParamListBase} from '@react-navigation/native';

const params: ParamListBase = {
  resume: {
    amountCurrency: '1',
    bankName: 'CMAC Sullana',
    beneficiaryName: 'HORNA PINGO CARLOS DAVID',
    creditAccountCCI: '80510100000062319937',
    debitAccountID: '12441143',
    debitAccountLabel: 'Cuenta ahorro negocios (MN) 1184378706',
    interbankComission: 0.8,
    itf: 0,
    mail: 'gerson.pardo@avantica.net',
    mibancoComission: 0,
    requestedAmount: 1,
    totalAmount: 1.8,
    transferReason: '',
  },

  origin: {
    availableBalance: 459.56,
    balance: 459.56,
    canRead: false,
    category: 'afSoles',
    cci: '04947400600936198500',
    consolidatedAmount: 0,
    currency: '1',
    description: null,
    extraInfo: '3|1412|474|1|6009361985|0|0|8|3',
    family: '8',
    idEnvironment: 0,
    idProduct: '31239124',
    label: '',
    number: '6009361985',
    permissions: null,
    position: 459.56,
    productAlias: null,
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    rate: 0,
    shortLabel: 'Ahorro Fácil (MN) 6009361985',
    smsAlias: null,
  },
  target: {
    availableBalance: 459.56,
    balance: 459.56,
    canRead: false,
    category: 'afSoles',
    cci: '04947400600936198500',
    consolidatedAmount: 0,
    currency: '1',
    description: null,
    extraInfo: '3|1412|474|1|6009361985|0|0|8|3',
    family: '8',
    idEnvironment: 0,
    idProduct: '31239124',
    label: '',
    number: '6009361985',
    permissions: null,
    position: 459.56,
    productAlias: null,
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    rate: 0,
    shortLabel: 'Ahorro Fácil (MN) 6009361985',
    smsAlias: null,
  },
  user: {
    mobilePhone: '986343863',
  },

  currency: {
    label: '1',
    name: 'Soles',
    symbol: 'S/',
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<DPFOpenConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<DPFOpenConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goBack', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.goBack();
  });

  it('onCheckPermissions', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;
    instance.onCheckPermissions(true);
  });

  it('onReadCode', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;
    instance.code && instance.code.focus();
    instance.onReadCode('123456');
  });

  it('onResend', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;
    instance.onResend();
  });

  it('blur', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.blur();
  });

  it('submit', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.submit();
  });

  it('submit', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.onAcceptTerms();
    instance.terms && expect(instance.terms.getValue()).toBe(true);
  });

  it('tooltipAction', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.tooltipAction();
  });

  it('isValid', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.isValid();
  });

  it('tryToSubmit', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.tryToSubmit();

    instance.code && instance.code.setValue('12345');

    instance.tryToSubmit();
  });

  it('tryToSubmit with code', () => {
    const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenConfirmScreenType;

    instance.code && instance.code.setValue('12345');

    instance.tryToSubmit();
  });

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenConfirmScreenType;

      instance.submit();
    }),
  );

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<DPFOpenConfirmScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenConfirmScreenType;

      instance.submit();
    }),
  );
  Session.save('sample');
});
