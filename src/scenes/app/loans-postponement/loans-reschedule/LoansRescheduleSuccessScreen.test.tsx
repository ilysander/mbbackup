import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import LoansRescheduleSuccessScreen, {
  Props,
  NavigationParams,
} from './LoansRescheduleSuccessScreen';

const params: NavigationParams = {
  loan: {
    idEnvironment: 0,
    idProduct: '23506791',
    productType: 'PR',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Préstamo ActivoFijo 107766522',
    extraInfo: '5|1502|1|1|107766522|0|0|1|11',
    currency: '1',
    number: '1502',
    consolidatedAmount: 0,
    position: 53682.36,
    canRead: false,
    permissions: null,
    loanAmount: 151924.33,
    amountPerDayOfLateness: 19361.46,
    totalAmountOfFees: 968.28,
    currentCapitalBalance: 53682.36,
    nextFeeAmount: 20329.74,
    groupFeeAmount: 0,
    nextFeeDueDate: '2019-07-25T00:00:00.000-0500',
    paymentDate: '2017-02-24T00:00:00.000-0500',
    paidFees: 16,
    totalFees: 24,
    apr: 16.77,
    aprc: 18.26,
    creditLineProductID: null,
    category: 'ActivoFijo',
    loanNumber: '107766522',
    subFamily: '11',
    family: '1',
    reschedule: {
      code: 0,
      type: 1,
      calculationDate: '27/03/2020',
      message: 'Prestamo aplica para la reprogramación.',
      enabled: 1,
      status: 1,
    },
  },
  amountLoan: '151924.33',
  fee: 1900.67,
  tcea: 45.56,
  periodGrace: 3,
  term: 3,
  datePay: '25/04/2020',
  currency: 1,
  operationNumber: 67686868,
  operationDate: '11/03/2020',
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {},
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<LoansRescheduleSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<LoansRescheduleSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
