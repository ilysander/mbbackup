import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../../api/Session';
import SelectorAmount, { ScreenProps, Props } from './SelectorAmount';
import { TextInputAmount } from '../../../../../components/ui';

const screenProps: ScreenProps = {
  onBlurAmount: jest.fn() as any,
  amountInput: React.createRef<TextInputAmount>(),
  onChangeFees: jest.fn(),
  onChangeTab: jest.fn(),
  isLastPayment: false,
  errorFee: '',
  fees: [
    {
      selected: true,
      enabled: true,
      statement: {
        id: 179,
        note: null,
        fee: 34,
        dueDate: '2018-07-16T00:00:00.000-0500',
        paymentDate: '2018-07-16T00:00:00.000-0500',
        amount: 1138.21,
        totalAmount: 0,
        status: 'DUE',
        closeDueDate: false,
        showPendingFee: 0,
      },
    },
    {
      selected: false,
      enabled: true,
      statement: {
        id: 180,
        note: null,
        fee: 35,
        dueDate: '2018-08-14T00:00:00.000-0500',
        paymentDate: '2018-08-14T00:00:00.000-0500',
        amount: 1139.1,
        totalAmount: 1139.7,
        status: 'DUE',
        closeDueDate: false,
        showPendingFee: 0,
      },
    },
    {
      selected: false,
      enabled: false,
      statement: {
        id: 181,
        note: null,
        fee: 35,
        dueDate: '2018-08-14T00:00:00.000-0500',
        paymentDate: '2018-08-14T00:00:00.000-0500',
        amount: 1139.1,
        totalAmount: 1139.7,
        status: 'DUE',
        closeDueDate: false,
        showPendingFee: 0,
      },
    },
    {
      selected: false,
      enabled: false,
      statement: {
        id: 182,
        note: null,
        fee: 35,
        dueDate: '2018-08-14T00:00:00.000-0500',
        paymentDate: '2018-08-14T00:00:00.000-0500',
        amount: 1139.1,
        totalAmount: 1139.7,
        status: 'DUE',
        closeDueDate: false,
        showPendingFee: 0,
      },
    },
    {
      selected: false,
      enabled: false,
      statement: {
        id: 183,
        note: null,
        fee: 36,
        dueDate: '2018-08-14T00:00:00.000-0500',
        paymentDate: '2018-08-14T00:00:00.000-0500',
        amount: 1139.1,
        totalAmount: 1139.7,
        status: 'PENDING',
        closeDueDate: true,
        showPendingFee: 1,
      },
    },
  ],
  loan: {
    idEnvironment: 0,
    idProduct: '16115071',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Préstamo Vivienda 105396907',
    extraInfo: '5|1520|463|1|105396907|0|0|1|12',
    currency: '1',
    number: '1520',
    consolidatedAmount: 0,
    position: 3302.59,
    canRead: false,
    permissions: null,
    loanAmount: 30214.49,
    amountPerDayOfLateness: 3634.78,
    totalAmountOfFees: 1066.35,
    currentCapitalBalance: 3302.59,
    nextFeeAmount: 4701.13,
    groupFeeAmount: 0,
    nextFeeDueDate: '2018-07-16T00:00:00.000-0500',
    paymentDate: '2015-09-09T00:00:00.000-0500',
    paidFees: 33,
    totalFees: 36,
    apr: 22.56,
    aprc: 23.18,
    creditLineProductID: null,
    category: 'Vivienda',
    loanNumber: '105396907',
    subFamily: '12',
    family: '1',
  },
};
const props: Props = {
  screenProps,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<SelectorAmount {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<SelectorAmount {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('onSelect', () => {
    const wrapper = renderer.create(<SelectorAmount {...props} />);
    const instance = (wrapper.getInstance() as any) as SelectorAmount;
    instance.onSelect(1, true);
    expect(screenProps.onChangeTab).toBeCalled();
  });

  Session.save('sample');
});
