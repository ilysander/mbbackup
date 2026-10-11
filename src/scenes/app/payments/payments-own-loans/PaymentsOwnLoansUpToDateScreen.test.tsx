import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import PaymentsOwnLoansUpToDateScreen, {
  PaymentsOwnLoansUpToDateScreenType,
  Props,
} from './PaymentsOwnLoansUpToDateScreen';

const params: any = {
  currency: '1',
  fees: [
    {
      id: 161,
      note: null,
      fee: 16,
      dueDate: '2019-02-04T00:00:00.000-0500',
      paymentDate: '2019-02-04T00:00:00.000-0500',
      amount: 2983,
      totalAmount: 2983.1,
      status: 'PENDING',
      closeDueDate: false,
      showPendingFee: 0,
    },
    {
      id: 162,
      note: null,
      fee: 17,
      dueDate: '2019-03-04T00:00:00.000-0500',
      paymentDate: '2019-03-04T00:00:00.000-0500',
      amount: 2983,
      totalAmount: 2983.1,
      status: 'PENDING',
      closeDueDate: false,
      showPendingFee: 0,
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
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    pop: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsOwnLoansUpToDateScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsOwnLoansUpToDateScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('test goBack', async () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansUpToDateScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansUpToDateScreenType;
    instance.goBack();
    expect(instance.props.navigation.pop).toBeCalled();
  });

  it('loading data', async () => {
    const wrapper = renderer.create(
      <PaymentsOwnLoansUpToDateScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsOwnLoansUpToDateScreenType;
    await instance.load();
    expect(instance.state.currency).toEqual(params.currency);
  });

  Session.save('sample');
});
