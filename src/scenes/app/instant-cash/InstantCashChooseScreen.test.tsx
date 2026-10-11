import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InstantCashChooseScreen, {
  Props,
  Params,
} from './InstantCashChooseScreen';
import Session from '../../../api/Session';

const params: Params = {
  seedA: 'eat_flargo_ini',
  amount: 10.0,
  creditLine: {
    currencyKey: 1,
  } as any,
  option: {
    insuranceDisposal: 5.0,
    currency: '1',
    itf: 0.0,
  } as any,
  destination: {
    destinationId: 1,
  } as any,
  paymentDate: '12/12/2020',
  insurances: [],
};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<InstantCashChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer
      .create(<InstantCashChooseScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});
