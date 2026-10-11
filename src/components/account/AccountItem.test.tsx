import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AccountItem, { AccountItemProps } from './AccountItem';

const props: AccountItemProps = {
  accessibilityLabel: 'modal_overlay',
  item: {
    idEnvironment: 0,
    idProduct: '28725203',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,

    label: '',
    shortLabel: 'Préstamo LineaDeCredito 109689003',
    extraInfo: '5|1712|463|1|109689003|0|0|1|7',
    currency: '1',
    number: '1712',
    consolidatedAmount: 0,
    position: 40293.7,
    canRead: false,
    permissions: null,
    loanAmount: 40293.7,
    amountPerDayOfLateness: 15789.66,
    totalAmountOfFees: 445,
    currentCapitalBalance: 40293.7,
    nextFeeAmount: 16234.66,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-03-14T00:00:00.000-0500',
    paymentDate: '2018-02-12T00:00:00.000-0500',
    paidFees: 0,
    totalFees: 12,
    apr: 25.64,
    aprc: 27.38,
    creditLineProductID: '26221416',
    category: 'CTS',
    loanNumber: '109689003',
    subFamily: '7',
    family: '1',
  },
  type: 'accountCC',
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  hasDetail: true,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AccountItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AccountItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with propsWithDeposit', () => {
  const propsWithDeposit = { ...props, type: 'deposit' } as AccountItemProps;
  const snapshot = renderer
    .create(<AccountItem {...propsWithDeposit} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with propsWithAccountCTS', () => {
  const propsWithAccountCTS = {
    ...props,
    type: 'accountCTS',
  } as AccountItemProps;
  const snapshot = renderer
    .create(<AccountItem {...propsWithAccountCTS} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with propsWithLoan', () => {
  const propsWithLoan = { ...props, type: 'loan' } as AccountItemProps;
  const wrapper = renderer.create(<AccountItem {...propsWithLoan} />);
  const instance = (wrapper.getInstance() as any) as AccountItem;
  instance.onPress();
  expect(propsWithLoan.navigation.navigate).toHaveBeenCalled();
});

it('render with propsWithAccountCA', () => {
  const propsWithAccountCA = {
    ...props,
    type: 'accountCA',
  } as AccountItemProps;
  const wrapper = renderer.create(<AccountItem {...propsWithAccountCA} />);
  const instance = (wrapper.getInstance() as any) as AccountItem;
  instance.onPress();
  expect(propsWithAccountCA.navigation.navigate).toHaveBeenCalled();
});

it('render with propsWithAccountCC', () => {
  const propsWithAccountCC = {
    ...props,
    type: 'accountCC',
  } as AccountItemProps;
  const wrapper = renderer.create(<AccountItem {...propsWithAccountCC} />);
  const instance = (wrapper.getInstance() as any) as AccountItem;
  instance.onPress();
  expect(propsWithAccountCC.navigation.navigate).toHaveBeenCalled();
});
