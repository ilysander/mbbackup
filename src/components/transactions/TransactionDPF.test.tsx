import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TransactionDPF, { TransactionDPFProps } from './TransactionDPF';

const props: TransactionDPFProps = {
  resume: {
    amount: 350,
    bankName: undefined,
    creditAccount: '12321710',
    creditAccountLabel: 'Cuenta ahorro negocios (MN) - 2861209802',
    currency: '1',
    currencyLabel: '1',
    date: '12/02/2019 09:45:57',
    debitAccount: '12321710',
    debitAccountCurrency: '1',
    debitAccountLabel: 'Cuenta ahorro negocios (MN) - 2861209802',
    depositCurrency: '1',
    exchange: 1,
    frequency: '0',
    frequentContact: '',
    totalPaymentInterest: 'S/ 0.23',
    isFrequentContact: false,
    isSameCurrency: true,
    itf: '0.005',
    loanCurrency: '1',
    renewDeposit: false,
    requestedAmount: undefined,
    returnDate: '27/02/2019',
    term: '15',
    totalAmount: 350,
    transaction: '1020030',
    trea: '1.60%',
    userEmail: 'gmd-jenny.lopez@mibanco.com.pe',
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<TransactionDPF {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TransactionDPF {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
