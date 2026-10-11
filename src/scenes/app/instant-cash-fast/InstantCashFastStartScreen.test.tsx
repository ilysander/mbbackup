import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InstantCashFastStartScreen, {Props} from './InstantCashFastStartScreen';
import Session from '../../../api/Session';

const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {} as any,
};
describe('session', () => {
  it('render just view', () => {
    const snapshot = renderer
      .create(<InstantCashFastStartScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});
