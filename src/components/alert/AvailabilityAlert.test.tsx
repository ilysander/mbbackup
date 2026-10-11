import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AvailabilityAlert, { AvailabilityAlertProps } from './AvailabilityAlert';

const props: AvailabilityAlertProps = {
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AvailabilityAlert {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AvailabilityAlert {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
