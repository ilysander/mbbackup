import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FeesRow, { FeesRowProps } from './FeesRow';

const props: FeesRowProps = {
  accessibilityLabel: 'accountfield_touchable_edit',
  selected: false,
  item: {
    idEnvironment: 0,
    idProduct: null,
    productType: null,
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: null,
    shortLabel: null,
    extraInfo: null,
    currency: '1',
    number: null,
    consolidatedAmount: 0,
    position: 0,
    canRead: false,
    permissions: null,
    totalAmount: 350,
    insuranceDisposal: 1.03,
    amountFee: 101,
    accountKeyr: '3197210',
    itf: 0,
    numberFee: 4,
    payDay: 3,
    rate: 66.68,
    creditLine: '972736',
    loanUse: '2',
    tcea: 66.68,
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FeesRow {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FeesRow {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
