import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import SignUpFacephiResetScreen, {
  Props,
  State,
  SignUpFacephiResetScreenType,
} from './SignUpFacephiResetScreen';

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
  showBackWarning: false,
  dictionary: [],
};

it('renders without crashing', () => {
  const rendered = renderer
    .create(<SignUpFacephiResetScreen {...props} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer
    .create(<SignUpFacephiResetScreen {...props} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
it('closeTerms', () => {
  const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiResetScreenType;
  instance.acceptTerms();
  expect(instance.state.showTerms).toBe(false);
});

it('handleBackPress', () => {
  const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiResetScreenType;

  expect(instance.handleBackPress()).toBe(false);
});

it('closeTerms', () => {
  const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiResetScreenType;
  instance.closeTerms();
  expect(instance.state.showTerms).toBe(false);
});

it('focus', () => {
  const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiResetScreenType;
  instance.focus();
  expect(instance.state.showTerms).toBe(false);
});

it('onChangeCheckboxTermsValue', () => {
  const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiResetScreenType;
  instance.onChangeCheckboxTermsValue(true);
  expect(instance.state.isTermsValid).toBe(true);
});

describe('session', () => {
  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<SignUpFacephiResetScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as SignUpFacephiResetScreenType;

      await instance.submit();
    }),
  );
  Session.save('sample');
});
