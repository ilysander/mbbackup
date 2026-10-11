import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DPFAvailabilityAlert, {
  DPFAvailabilityAlertProps,
} from './DPFAvailabilityAlert';

const props: DPFAvailabilityAlertProps = {
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<DPFAvailabilityAlert {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<DPFAvailabilityAlert {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
