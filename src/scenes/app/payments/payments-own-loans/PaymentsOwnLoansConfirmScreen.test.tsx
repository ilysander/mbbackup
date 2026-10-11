import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import PaymentsOwnLoansConfirmScreen, {
  PaymentsOwnLoansConfirmScreenType,
  Props,
} from './PaymentsOwnLoansConfirmScreen';

const params: any = {
  resume: {
    creditAccountCurrency: 1,
    creditAccountHolder: 'LOAYZA GARCIA EUFRACIO',
    creditAccountNumber: '6007644726',
    creditAmount: 20, // valor para el destino
    debitAccountCurrency: '1', // currency de origen
    debitAccountHolder: 'TORRES SALAZAR SUSY VANESSA',
    debitAmount: 20, // valor debitado
    debitProductLabel: 'Ahorro Fácil (MN) 6009361985',
    exchangeRate: 'asd dasdasd asd S/ 12.23',
    exchange: 3.33,
    operationNumber: 1020324,
    creditCurrency: '2',
    loanAmount: {
      quantity: 1,
      currency: '1',
    },
    loanLabel: 'Mi super prestamo 12345678',
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

  currency: {
    label: '1',
    name: 'Soles',
    symbol: 'S/',
  },
  loan: {
    loanNumber: '12345678',
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
      .create(<PaymentsOwnLoansConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsOwnLoansConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('toggleDetails', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.toggleDetails();
  });

  it('onChangeCheckboxTermsValue', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.onChangeCheckboxTermsValue(true);
    expect(instance.state.isTermsValid).toBe(true);
  });

  it('onAcceptTerms', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.onAcceptTerms();
    if (instance.terms) {
      expect(instance.terms.getValue()).toBe(true);
    }
  });

  it('blur', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.blur();
  });

  it('submit', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.submit();
  });

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(
        <PaymentsOwnLoansConfirmScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

      instance.submit();
    }),
  );

  it('goBack', () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansConfirmScreenType;

    instance.goBack();
  });

  Session.save('sample');
});
