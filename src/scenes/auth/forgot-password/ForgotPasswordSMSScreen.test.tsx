import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {
  withAuth,
  withCatch,
  withFetchConfig,
} from '../../../resources/util/Tests';
import ForgotPasswordSMSScreen, {
  Props,
  State,
  ForgotPasswordSMSScreenType,
} from './ForgotPasswordSMSScreen';

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
const state: State = {
  isLoading: false,
  isValid: true,
  allowSubmit: false,
  showResend: true,
  exchangeTokenResend: '',
  pressResend: true,
};

const stateInvalid: State = {
  isLoading: false,
  isValid: false,
  allowSubmit: false,
  showResend: true,
  exchangeTokenResend: '',
  pressResend: true,
};

const stateInvalid2: State = {
  isLoading: true,
  isValid: false,
  allowSubmit: false,
  showResend: true,
  exchangeTokenResend: '',
  pressResend: true,
};

describe('session', () => {
  it('renders without crashing', () => {
    const rendered = renderer
      .create(<ForgotPasswordSMSScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer
      .create(<ForgotPasswordSMSScreen {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it(
    'submit',
    withAuth(
      'sample',
      withFetchConfig({session: 'default'}, async () => {
        const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ForgotPasswordSMSScreenType;
        instance.setState(state);
        await instance.submit();
      }),
    ),
  );

  it(
    'submit invalid',
    withAuth(
      'sample',
      withFetchConfig({session: 'default'}, async () => {
        const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as ForgotPasswordSMSScreenType;
        instance.setState(stateInvalid);
        await instance.submit();
      }),
    ),
  );

  it(
    'submit catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as ForgotPasswordSMSScreenType;
      instance.setState(state);
      await instance.submit();
      jest.runOnlyPendingTimers();
    }),
  );

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ForgotPasswordSMSScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ForgotPasswordSMSScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });

  it('onReadCode', () => {
    const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ForgotPasswordSMSScreenType;
    instance.setState(stateInvalid2);
    instance.onReadCode('');
  });

  it('On Check Permissions', () => {
    const wrapper = renderer.create(<ForgotPasswordSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ForgotPasswordSMSScreenType;
    instance.setState(stateInvalid);
  });

  Session.save('sample');
});
