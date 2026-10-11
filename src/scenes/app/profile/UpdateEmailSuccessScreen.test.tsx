import * as React from 'react';
import * as renderer from 'react-test-renderer';
import UpdateEmailSuccessScreen, {Props} from './UpdateEmailSuccessScreen';
import Session from '../../../api/Session';
const params: any = {};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<UpdateEmailSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer
      .create(<UpdateEmailSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});
