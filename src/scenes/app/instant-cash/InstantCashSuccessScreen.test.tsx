import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InstantCashSuccessScreen, {
  Props,
  Params,
} from './InstantCashSuccessScreen';
import Session from '../../../api/Session';

const params: Params = {
  seedA: 'eat_flargo_ini',
  target: {
    idEnvironment: 0,
    idProduct: '26224632',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Ahorro por un sueño (MN) 6005291079',
    extraInfo: '3|1428|350|1|6005291079|0|0|8|3',
    currency: '1',
    number: '6005291079',
    consolidatedAmount: 0,
    position: 1000.01,
    canRead: false,
    permissions: null,
    cci: '04935000600529107925',
    availableBalance: 1000.01,
    balance: 1000.01,
    rate: 0,
    rateOfInterest: 0,
    category: 'apsSoles',
    family: '8',
  },
  idTransaction: 'sample',
  amount: 999,
  currency: '1',
  itfFormated: 'S/ 0.05',
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
      .create(<InstantCashSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer
      .create(<InstantCashSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});
