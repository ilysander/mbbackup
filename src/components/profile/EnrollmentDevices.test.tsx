import * as React from 'react';
import * as renderer from 'react-test-renderer';
import EnrollmentDevices, { EnrollmentDevicesProps } from './EnrollmentDevices';

const props: EnrollmentDevicesProps = {
  devicesList: [],
  isLoading: false,
  openModal: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<EnrollmentDevices {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<EnrollmentDevices {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
