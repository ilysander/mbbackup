import * as React from 'react';
import * as renderer from 'react-test-renderer';
import LoanItem, { LoanItemProps } from './LoanItem';

const props: LoanItemProps = {
  accessibilityLabel: 'modal_overlay',
  navigation: {} as any,
  item: {
    idEnvironment: 0,
    idProduct: '28530094',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Préstamo CapitalDeTrabajo 109627324',
    extraInfo: '5|1503|552|2|109627324|0|0|1|11',
    currency: '2',
    number: '1503',
    consolidatedAmount: 0,
    position: 14057.42,
    canRead: false,
    permissions: null,
    loanAmount: 10000.05,
    amountPerDayOfLateness: 8736.58,
    totalAmountOfFees: 148.3,
    currentCapitalBalance: 14057.42,
    nextFeeAmount: 8884.88,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-08-14T00:00:00.000-0500',
    paymentDate: '2018-01-31T00:00:00.000-0500',
    paidFees: 5,
    totalFees: 12,
    apr: 17.88,
    aprc: 19.21,
    creditLineProductID: null,
    category: 'CapitalDeTrabajo',
    loanNumber: '109627324',
    subFamily: '11',
    family: '1',
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<LoanItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<LoanItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
