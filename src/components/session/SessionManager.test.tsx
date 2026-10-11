import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import SessionManager, { SessionManagerProps } from './SessionManager';

const props: SessionManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

describe('session', () => {
  it('render just views', () => {
    const snapshot = renderer.create(<SessionManager {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('calls componentDidMount', () => {
    const wrapper = renderer.create(<SessionManager {...props} />);
    wrapper.getInstance();
  });

  it('extendSession', () => {
    const wrapper = renderer.create(<SessionManager {...props} />);
    const instance = (wrapper.getInstance() as any) as SessionManager;
    instance.extendSession();
  });

  it('checkSession', () => {
    const wrapper = renderer.create(<SessionManager {...props} />);
    const instance = (wrapper.getInstance() as any) as SessionManager;
    instance.checkSession();
  });
  Session.save('sample');
});
