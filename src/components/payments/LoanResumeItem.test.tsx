import * as React from 'react';
import * as renderer from 'react-test-renderer';
import LoanResumeItem, { LoanResumeItemProps } from './LoanResumeItem';

const props: LoanResumeItemProps = {
  accessibilityLabel: 'test',
  loan: {
    idEnvironment: 0,
    idProduct: '26919712',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Préstamo ActivoFijo 109022540',
    extraInfo: '5|1506|459|1|109022540|0|0|1|11',
    currency: '1',
    number: '1506',
    consolidatedAmount: 0,
    position: 9734.86,
    canRead: false,
    permissions: null,
    loanAmount: 35225.29,
    amountPerDayOfLateness: 10769.37,
    totalAmountOfFees: 370,
    currentCapitalBalance: 9734.86,
    nextFeeAmount: 11139988.37,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-12-10T00:00:00.000-0500',
    paymentDate: '2017-10-16T00:00:00.000-0500',
    paidFees: 9,
    totalFees: 12,
    apr: 31.37,
    aprc: 32.98,
    creditLineProductID: null,
    category: 'ActivoFijo',
    family: '1',
    subFamily: '11',
    loanNumber: '109022540',
  },
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<LoanResumeItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<LoanResumeItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
