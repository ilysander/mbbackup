import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InvalidPhoneAlert, { InvalidPhoneAlertProps } from './InvalidPhoneAlert';

const props: InvalidPhoneAlertProps = {
  accessibilityLabel: 'test',
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<InvalidPhoneAlert {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<InvalidPhoneAlert {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToProfile', () => {
  const wrapper = renderer.create(<InvalidPhoneAlert {...props} />);
  const instance = (wrapper.getInstance() as any) as InvalidPhoneAlert;
  instance.goToProfile();
  expect(props.navigation.navigate).toBeCalled();
});
