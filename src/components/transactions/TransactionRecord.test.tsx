import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TransactionRecord, { TransactionRecordProps } from './TransactionRecord';

const props: TransactionRecordProps = {
  resume: {
    amount: 1,
    currency: '1',
    sourceName: '',
    sourceAccount: '',
    targetName: '',
    transaction: '',
    targetAccount: '',
    date: '31/01/2018 22:45:45',
    recipient: '',
    description: '',
    loanAmount: {
      quantity: 1,
      currency: '1',
    },
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
    loan: {
      loanNumber: '125689',
    },
    loanLabel: 'Mi super prestamo 12345678',
    origin: {
      shortLabel: 'Préstamo LineaDeCredito 109689003',
      number: '1712',
    },
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<TransactionRecord {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TransactionRecord {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
