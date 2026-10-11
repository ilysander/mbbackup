import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {
  withAuth,
  withCatch,
  withFetchConfig,
} from '../../../resources/util/Tests';
import ChangeEmailScreen, {
  ChangeEmailScreenType,
  Props,
} from './ChangeEmailScreen';

const communicationConfigurations = [
  {
    idUser: 'e1d202b350414eceb01e3a1cb1959962',
    communicationType: 'message',
    subscribedSMS: false,
    subscribedMail: true,
    subscribedDefault: true,
    subscribedFacebook: false,
    subscribedTwitter: false,
  },
  {
    idUser: 'e1d202b350414eceb01e3a1cb1959962',
    communicationType: 'promos',
    subscribedSMS: false,
    subscribedMail: false,
    subscribedDefault: true,
    subscribedFacebook: false,
    subscribedTwitter: false,
  },
  {
    idUser: 'e1d202b350414eceb01e3a1cb1959962',
    communicationType: 'loanExpiration',
    subscribedSMS: false,
    subscribedMail: true,
    subscribedDefault: true,
    subscribedFacebook: false,
    subscribedTwitter: false,
  },
  {
    idUser: 'e1d202b350414eceb01e3a1cb1959962',
    communicationType: 'userBlock',
    subscribedSMS: true,
    subscribedMail: true,
    subscribedDefault: true,
    subscribedFacebook: false,
    subscribedTwitter: false,
  },
];

const params: any = {
  current: '',
};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('render just views', () => {
    const snapshot = renderer.create(<ChangeEmailScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goBack function', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    instance.goBack();
    expect(instance.props.navigation.goBack).toBeCalled();
  });

  it('onAlert function', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    instance.onAlert();
    expect(instance.state.showValidationModal).toBeFalsy();
  });

  it(
    'loading data with default',
    withAuth(
      'sample',
      withFetchConfig({session: 'default'}, async () => {
        const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ChangeEmailScreenType;
        await instance.load();
        expect(instance.state.current).toBe(params.current);
      }),
    ),
  );

  it(
    'loading data with status-code',
    withAuth(
      'sample',
      withFetchConfig({session: 'status-code'}, async () => {
        const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ChangeEmailScreenType;
        await instance.load();
        expect(instance.state.current).toBe(params.current);
      }),
    ),
  );

  it(
    'load function: catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as ChangeEmailScreenType;
      await instance.load();
      expect(instance.state.current).toBe(params.current);
    }),
  );

  it(
    'tryToChange function with default',
    withAuth(
      'sample',
      withFetchConfig({session: 'default'}, async () => {
        const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ChangeEmailScreenType;
        await instance.tryToChange();
        expect(instance.state.current).toBe(params.current);
      }),
    ),
  );

  it(
    'tryToChange function with status-code',
    withAuth(
      'sample',
      withFetchConfig({session: 'status-code'}, async () => {
        const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ChangeEmailScreenType;
        await instance.tryToChange();
        expect(instance.state.current).toBe(params.current);
      }),
    ),
  );

  it(
    'tryToChange function: catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as ChangeEmailScreenType;
      await instance.tryToChange();
      expect(instance.state.current).toBe(params.current);
    }),
  );

  it('showConfirmModal function', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    instance.showConfirmModal();
    expect(instance.state.showValidationModal).toBe(true);
  });

  it('cancelValidationModal function', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    instance.cancelValidationModal();
    expect(instance.props.navigation.navigate).toBeCalled();
  });

  it('getCommunicationConfigurationsValue message', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    expect(
      instance.getCommunicationConfigurationsValue(
        communicationConfigurations,
        'message',
      ),
    ).toBe('MAIL');
  });

  it('getCommunicationConfigurationsValue promos', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    expect(
      instance.getCommunicationConfigurationsValue(
        communicationConfigurations,
        'promos',
      ),
    ).toBe(null);
  });

  it('getCommunicationConfigurationsValue userBlock', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    expect(
      instance.getCommunicationConfigurationsValue(
        communicationConfigurations,
        'userBlock',
      ),
    ).toEqual(['MAIL', 'SMS']);
  });

  it('getCommunicationConfigurationsValue loanExpiration', () => {
    const wrapper = renderer.create(<ChangeEmailScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeEmailScreenType;
    expect(
      instance.getCommunicationConfigurationsValue(
        communicationConfigurations,
        'loanExpiration',
      ),
    ).toBe('MAIL');
  });

  Session.save('sample');
});
