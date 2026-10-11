import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {withFetchConfig} from '../../../resources/util/Tests';
import ForgotPasswordResetScreen, {
  Props,
  State,
  ForgotPasswordResetScreenType,
} from './ForgotPasswordResetScreen';

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
  isValid: false,
  allowSubmit: false,
  dictionary: [],
};

it('renders without crashing', () => {
  const rendered = renderer
    .create(<ForgotPasswordResetScreen {...props} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer
    .create(<ForgotPasswordResetScreen {...props} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('handleBackPress', () => {
  const wrapper = renderer.create(<ForgotPasswordResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordResetScreenType;
  expect(instance.handleBackPress()).toBe(false);
});

it('focus', () => {
  const wrapper = renderer.create(<ForgotPasswordResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as ForgotPasswordResetScreenType;
  instance.focus();
});

describe('session', () => {
  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<ForgotPasswordResetScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as ForgotPasswordResetScreenType;

      await instance.submit();
    }),
  );
  Session.save('sample');
});
