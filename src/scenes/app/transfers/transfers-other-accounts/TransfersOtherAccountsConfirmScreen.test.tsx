import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import TransfersOtherAccountsConfirmScreen, {
  Props,
  TransfersOtherAccountsConfirmScreenType,
} from './TransfersOtherAccountsConfirmScreen';

const params: any = {
  resume: {
    creditAccountCurrency: 1,
    creditAccountHolder: 'LOAYZA GARCIA EUFRACIO',
    creditAccountNumber: '6007644726',
    creditAmount: 20, // valor para el destino
    debitAccountCurrency: '1', // currency de origen
    debitAccountHolder: 'TORRES SALAZAR SUSY VANESSA',
    debitAmount: '20.00', // valor debitado
    debitProductLabel: 'Ahorro Fácil (MN) 6009361985',
    exchangeRate: 1,
    operationNumber: 1020324,
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
      .create(<TransfersOtherAccountsConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersOtherAccountsConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goBack', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;

    instance.goBack();
  });

  it('onChangeCheckSaveTransference', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    instance.onChangeCheckSaveTransference(true);
    expect(instance.state.isFrequentContact).toBe(true);

    instance.note && instance.note.focus();
  });

  it('onCheckPermissions', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    instance.onCheckPermissions(true);
  });

  it('onReadCode', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    instance.code && instance.code.focus();
    instance.onReadCode('123456');
  });

  it('note focus', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    instance.code && instance.code.focus();
    instance.onChangeCheckSaveTransference(true);
    instance.note && instance.note.focus();
    instance.code && instance.code.focus();
  });

  it('onResend', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    instance.onChangeCheckSaveTransference(true);
    instance.onResend();
  });

  it('chanche Note', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    const newValue = 'nueva nota';
    instance.onChangeNote(newValue);

    expect(instance.state.frequentContactName).toBe(newValue);
  });

  it('blur', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;

    instance.blur();
  });

  it('validateFrequentContact value', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;
    const newValue = '';
    instance.validateFrequentContact(newValue);
  });

  it('submit', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;

    instance.submit();
  });

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(
        <TransfersOtherAccountsConfirmScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersOtherAccountsConfirmScreenType;

      instance.submit();
    }),
  );

  Session.save('sample');
});
