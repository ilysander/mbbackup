import * as React from 'react';
import {BackHandler} from 'react-native';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import EnrollmentSMSScreen, {
  Props,
  State,
  EnrollmentSMSScreenType,
} from './EnrollmentSMSScreen';

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

const stateInvalid: State = {
  isLoading: false,
  isValid: false,
  allowSubmit: false,
  showResend: true,
  exchangeTokenResend: '',
  pressResend: true,
  header: '',
};

const stateInvalid2: State = {
  isLoading: true,
  isValid: false,
  allowSubmit: false,
  showResend: true,
  exchangeTokenResend: '',
  pressResend: true,
  header: '',
};

describe('enrollment', () => {
  it('renders without crashing', () => {
    const rendered = renderer
      .create(<EnrollmentSMSScreen {...props} />)
      .toJSON();
    expect(rendered).toBeTruthy();
  });

  it('render just views', () => {
    const tree = renderer.create(<EnrollmentSMSScreen {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Pressed back button on android', () => {
    const wrapper = renderer.create(<EnrollmentSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentSMSScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const spy = jest.spyOn(BackHandler, 'removeEventListener');
    const wrapper = renderer.create(<EnrollmentSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentSMSScreenType;
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });

  it('onReadCode', () => {
    const wrapper = renderer.create(<EnrollmentSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentSMSScreenType;
    instance.setState(stateInvalid2);
    instance.onReadCode('');
  });

  it('On Check Permissions', () => {
    const wrapper = renderer.create(<EnrollmentSMSScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as EnrollmentSMSScreenType;
    instance.setState(stateInvalid);
  });

  Session.save('sample');
});
