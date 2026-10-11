import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import SavingScreen, {Props} from './SavingScreen';

const params: any = {
  item: {
    shortLabel: '',
    number: '',
    cci: '123123',
    availableBalance: 1000,
    currency: 1,
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
    const snapshot = renderer.create(<SavingScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<SavingScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
