import * as React from 'react';
import * as renderer from 'react-test-renderer';
import MaintenanceModal, { MaintenanceModalProps } from './MaintenanceModal';

const props: MaintenanceModalProps = {
  onSuccess: jest.fn(),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<MaintenanceModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MaintenanceModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views without Function', () => {
  const props: MaintenanceModalProps = {
    onSuccess: jest.fn(),
  };
  const snapshot = renderer.create(<MaintenanceModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
