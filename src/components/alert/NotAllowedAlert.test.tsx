import * as React from 'react';
import * as renderer from 'react-test-renderer';
import NotAllowedAlert, { NotAllowedAlertProps } from './NotAllowedAlert';

const props: NotAllowedAlertProps = {
  accessibilityLabel: 'test',
  accessibilityLabelBtn: 'analytics_test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<NotAllowedAlert {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<NotAllowedAlert {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
