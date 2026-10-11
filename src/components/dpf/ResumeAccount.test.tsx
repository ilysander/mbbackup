import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ResumeAccount, { ResumeAccountProps } from './ResumeAccount';

const props: ResumeAccountProps = {
  accessibilityLabel: 'test',
  account: {
    idEnvironment: 0,
    idProduct: '33937890',
    productType: 'DPF',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: '10000001963730',
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Depósito 10000001963730',
    extraInfo: '4|1726|907|1|10000001963730|0|0|7|1',
    currency: '1',
    number: '1726',
    consolidatedAmount: 0,
    position: 350,
    canRead: false,
    permissions: null,
    openingDate: '2019-03-07T00:00:00.000-0500',
    closingDate: '2021-02-25T00:00:00.000-0500',
    term: 721,
    rateOfInterest: 2.9,
    capital: 350,
    interest: 20.62,
    productKey: 1726,
    currencyKey: 1,
    availableRetirements: 0,
    accruedInterest: 0,
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ResumeAccount {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ResumeAccount {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
