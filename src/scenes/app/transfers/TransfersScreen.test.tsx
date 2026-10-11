import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {Emitter} from '../../../resources/listeners';
import {withCatch} from '../../../resources/util/Tests';
import TransfersScreen, {Props, TransfersScreenType} from './TransfersScreen';

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
    const snapshot = renderer.create(<TransfersScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<TransfersScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('setLoadingOff', () => {
    const wrapper = renderer.create(<TransfersScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersScreenType;
    instance.setLoadingOff();
    expect(instance.state.isLoading).toBe(false);
  });

  it(
    'loadFrequentContacts with catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<TransfersScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersScreenType;
      await instance.loadFrequentContacts();
    }),
  );
  it(
    'loadAccounts with catch',
    withCatch(true, async () => {
      const spy = jest.spyOn(Emitter, 'emit');
      const wrapper = renderer.create(<TransfersScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersScreenType;
      await instance.loadAccounts();
      expect(spy).toBeCalled();
    }),
  );

  Session.save('sample');
});
