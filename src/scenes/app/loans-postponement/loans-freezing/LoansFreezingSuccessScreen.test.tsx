import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import LoansFreezingSuccessScreen, {
  Props,
  NavigationParams,
} from './LoansFreezingSuccessScreen';

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
  phone: '999888777',
  feesFreezing: [
    {
      fee: {
        number: 1,
        amount: 7477.6,
        capital: 0.0,
        interest: 0.0,
        itf: 0.0,
        expenses: 0.0,
        mora: 0.0,
        expirationdate: '01/09/2020',
      },
      nameMonth: 'Mayo',
    },
  ],
  numberCredit: 1213546,
  tcea: 0,
  currency: 1,
  operationNumber: 546813,
  operationDate: '26/03/2019 08:24:23',
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
      .create(<LoansFreezingSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<LoansFreezingSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
