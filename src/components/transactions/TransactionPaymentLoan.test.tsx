import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TransactionPaymentLoan, {
  TransactionPaymentLoanProps,
} from './TransactionPaymentLoan';

const props: TransactionPaymentLoanProps = {
  frequentContact: true,
  resume: {
    capital: 'S/ 778.50',
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
    interest: 'S/ 644.29',
    itf: 'S/ 0.05',
    overdue: 'S/ 212.27',
    otherAmount: '0.01',
    operationNumber: 1020324,
    loanAmount: {
      quantity: 1,
      currency: '1',
    },

    loanLabel: 'Mi super prestamo 12345678',
  },
  origin: {
    shortLabel: 'Préstamo LineaDeCredito 109689003',
    number: '1712',
  },
  loan: {
    loanNumber: '125689',
  },
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<TransactionPaymentLoan {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<TransactionPaymentLoan {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
