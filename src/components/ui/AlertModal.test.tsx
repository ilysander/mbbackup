import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AlertModal, { AlertModalProps } from './AlertModal';

const props: AlertModalProps = {
  onSuccess: jest.fn(),
  icon: require('../../assets/images/warning-icon.png'),
  message: 'Ha ocurrido un error ...',
  title: 'Alert',
  actionButton: undefined,
  cancelButton: undefined,
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<AlertModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AlertModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views without Function', () => {
  const props: AlertModalProps = {
    onSuccess: jest.fn(),
    icon: { uri: 'https://sample.com/image.png' },
    message: 'Ha ocurrido un error ...',
    title: 'Alert',
    actionButton: undefined,
    cancelButton: undefined,
  };
  const snapshot = renderer.create(<AlertModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
