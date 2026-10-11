import * as React from 'react';

import * as renderer from 'react-test-renderer';
import MaintenanceScreen, {Props} from './MaintenanceScreen';

const params: any = {
  item: {
    idEnvironment: 0,
    idProduct: '28725203',
    productType: 'PR',
    productTypeLabel: undefined,
    productTypeShortLabel: undefined,
    description: undefined,
    productAlias: undefined,
    smsAlias: undefined,
    label: '',
    shortLabel: 'Préstamo LineaDeCredito 109689003',
    extraInfo: '5|1712|463|1|109689003|0|0|1|7',
    currency: '1',
    number: '1712',
    consolidatedAmount: 0,
    position: 40293.7,
    canRead: false,
    permissions: undefined,
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
    category: 'LineaDeCredito',
    loanNumber: '109689003',
    subFamily: '7',
    family: '1',
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
  route: {
    params,
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<MaintenanceScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MaintenanceScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
