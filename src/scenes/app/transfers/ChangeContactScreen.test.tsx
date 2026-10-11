import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import ChangeContactScreen, {Props} from './ChangeContactScreen';

const params: any = {};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
  route: {} as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<ChangeContactScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<ChangeContactScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
