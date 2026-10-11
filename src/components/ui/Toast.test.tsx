import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Toast, { ToastProps } from './Toast';

const props: ToastProps = {
  message: 'example',
};
const alternativeProps: ToastProps = {
  message: 'example',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Toast {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Toast {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('Alert with onPress', () => {
  const snapshot = renderer.create(<Toast {...alternativeProps} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
