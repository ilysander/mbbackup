import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {withFetchConfig} from '../../../resources/util/Tests';
import SignUpResetScreen, {
  Props,
  State,
  SignUpResetScreenType,
} from './SignUpResetScreen';

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
  showTerms: false,
  isLoading: false,
  isTermsValid: true,
  isValid: false,
  allowSubmit: false,
  dictionary: [],
};

it('renders without crashing', () => {
  const rendered = renderer.create(<SignUpResetScreen {...props} />).toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer.create(<SignUpResetScreen {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
it('closeTerms', () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;
  instance.acceptTerms();
  expect(instance.state.showTerms).toBe(false);
});

it('handleBackPress', () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;

  expect(instance.handleBackPress()).toBe(false);
});

it('closeTerms', () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;
  instance.closeTerms();
  expect(instance.state.showTerms).toBe(false);
});

it('focus', () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;
  instance.focus();
  expect(instance.state.showTerms).toBe(false);
});

it('onChangeCheckboxTermsValue', () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;
  instance.onChangeCheckboxTermsValue(true);
  expect(instance.state.isTermsValid).toBe(true);
});

it('submit', async () => {
  const wrapper = renderer.create(<SignUpResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpResetScreenType;
  instance.setState(state);

  await instance.submit();

  expect(instance.state.isValid).toBe(false);
});

describe('session', () => {
  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<SignUpResetScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as SignUpResetScreenType;

      await instance.submit();
    }),
  );
  Session.save('sample');
});
