import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import EmptyLoansScreen, {Props} from './EmptyLoansScreen';

const params: any = {};
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
    const snapshot = renderer.create(<EmptyLoansScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer.create(<EmptyLoansScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});
