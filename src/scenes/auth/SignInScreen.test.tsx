import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import {withFetchConfig} from '../../resources/util/Tests';
import SignInScreen, {Props, SignInScreenType} from './SignInScreen';

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

it('renders without crashing', () => {
  const snapshot = renderer.create(<SignInScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SignInScreen {...props} />).toJSON();

  expect(snapshot).toMatchSnapshot();
});

it('tryToSignIn', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.tryToSubmit();
});
it('signIn', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.setState({});
  instance.submit();
});

it('signInApi', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.signInApi(
    '4334660300154580',
    '111111',
    'key',
    'captchademo',
    '1234567',
  );
});

it('goToSignUp', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToSignUp();
});

it('goToForgotPassword', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToForgotPassword();
});

it('validateForm', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.isValid();
  jest.runOnlyPendingTimers();
});

it('goToLocation', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToLocation();
});
it('goToContact', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToContact();
});
it('goToContactScreenWithError', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToContactScreenWithError({});
});
it('onChangeValueCheck', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.onChangeValueCheck(true);
});
it('goToContactScreenOrOpenPhone', () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToContactScreenOrOpenPhone(true, url);
});
it('goToContactScreenOrOpenPhone:false', () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.goToContactScreenOrOpenPhone(false, url);
});

it('onChangeValueCheck:false', () => {
  const wrapper = renderer.create(<SignInScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignInScreenType;

  instance.onChangeValueCheck(false);
});

describe('session', () => {
  it('load', async () => {
    const wrapper = renderer.create(<SignInScreen {...props} />);
    (wrapper.getInstance() as any).getScreenRef() as SignInScreenType;
  });

  it('onPressInputCreditCard', async () => {
    const wrapper = renderer.create(<SignInScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignInScreenType;
    instance.onPressInputCreditCard();
  });

  it('toggleDebug', () => {
    const wrapper = renderer.create(<SignInScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignInScreenType;

    instance.toggleDebug();
  });
  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<SignInScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as SignInScreenType;

      await instance.submit();
    }),
  );
  Session.save('sample');
});
