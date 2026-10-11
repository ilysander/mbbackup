import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import LifeDevolutionScreen, {Props} from './LifeDevolutionScreen';

const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {} as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<LifeDevolutionScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<LifeDevolutionScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
