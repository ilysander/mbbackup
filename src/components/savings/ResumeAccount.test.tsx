import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ResumeAccount, { ResumeAccountProps } from './ResumeAccount';

const props: ResumeAccountProps = {
  accessibilityLabel: 'test',
  account: {
    idEnvironment: 0,
    idProduct: '31240209',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Ahorro por un sueño (MN) 6009363244',
    extraInfo: '3|1428|12|1|6009363244|0|0|8|3',
    currency: '1',
    number: '6009363244',
    consolidatedAmount: 0,
    position: 5409.26,
    canRead: false,
    permissions: null,
    cci: '04901200600936324480',
    availableBalance: 5409.26,
    balance: 5409.26,
    rate: 0,
    category: 'apsSoles',
    family: '8',
  } as any,
};

const propsWithBalanceNull: ResumeAccountProps = {
  accessibilityLabel: 'test',
  account: {
    idEnvironment: 0,
    idProduct: '31240209',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Ahorro por un sueño (MN) 6009363244',
    extraInfo: '3|1428|12|1|6009363244|0|0|8|3',
    currency: '1',
    number: '6009363244',
    consolidatedAmount: 0,
    position: 5409.26,
    canRead: false,
    permissions: null,
    cci: '04901200600936324480',
    availableBalance: null,
    balance: null,
    rate: 0,
    category: 'apsSoles',
    family: '8',
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

it('render just views', () => {
  const snapshot = renderer
    .create(<ResumeAccount {...propsWithBalanceNull} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('shareAccount', async () => {
  const wrapper = renderer.create(<ResumeAccount {...props} />);
  const instance = (wrapper.getInstance() as any) as ResumeAccount;
  await instance.shareAccount();
});
