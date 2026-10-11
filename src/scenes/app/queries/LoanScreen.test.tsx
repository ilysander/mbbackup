import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import LoanScreen, {LoanScreenType, Props} from './LoanScreen';

const params: any = {
  item: {
    amountPerDayOfLateness: 1100.0,
    apr: 30.3,
    currency: '1',
    currentCapitalBalance: 1000.0,
    idProduct: '1100000',
    loanAmount: 1000.0,
    loanNumber: '1110000',
    nextFeeAmount: 7047.37,
    nextFeeDueDate: '2018-04-18T00:00:00.000-0500',
    paidFees: 5,
    paymentDate: '2017-10-17T00:00:00.000-0500',
    productType: 'PR',
    shortLabel: ' ',
    totalAmountOfFees: 100,
    totalFees: 7,
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<LoanScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<LoanScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('load', () => {
    const wrapper = renderer.create(<LoanScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as LoanScreenType;

    instance.load();
  });

  it('goBack', () => {
    const wrapper = renderer.create(<LoanScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as LoanScreenType;

    instance.goBack();
  });
  Session.save('sample');
});
