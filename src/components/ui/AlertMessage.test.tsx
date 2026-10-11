import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AlertMessage, { AlertMessageProps } from './AlertMessage';

const props: AlertMessageProps = {
  accessibilityLabel: 'modal_overlay',
  message: 'example',
};
const alternativeProps: AlertMessageProps = {
  accessibilityLabel: 'modal_overlay',
  message: 'example',
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AlertMessage {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AlertMessage {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('Alert with onPress', () => {
  const snapshot = renderer
    .create(<AlertMessage {...alternativeProps} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
