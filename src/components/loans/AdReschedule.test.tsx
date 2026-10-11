import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import AdReschedule, { AdRescheduleProps } from './AdReschedule';

const props: AdRescheduleProps = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
};

describe('session', () => {
  it('render just views', () => {
    const snapshot = renderer.create(<AdReschedule {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});
