import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import TransfersTypes, { TransfersTypesProps } from './TransfersTypes';

const props: TransfersTypesProps = {
  accessibilityLabel: 'test',
  navigation: { navigate: jest.fn() } as any,
  accounts: [],
  accountsWithCts: [],
  serviceAvailability: async () => {
    return false;
  },
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<TransfersTypes {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer.create(<TransfersTypes {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('loading data', () => {
    const wrapper = renderer.create(<TransfersTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as TransfersTypes;
    instance.onPressMyAccounts();
    expect(props.navigation.navigate).toHaveBeenCalled();
  });
  it('onPressOtherAccounts', () => {
    const wrapper = renderer.create(<TransfersTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as TransfersTypes;
    instance.onPressOtherAccounts();
  });
  it('onPressOtherBanks', () => {
    const wrapper = renderer.create(<TransfersTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as TransfersTypes;
    instance.onPressOtherBanks();
  });
  Session.save('sample');
});
