import * as React from 'react';
import * as renderer from 'react-test-renderer';
import EmailStatusModal, { EmailStatusModalProps } from './EmailStatusModal';

const props: EmailStatusModalProps = {
  isVisible: true,
  title: 'test',
  body: 'test',
  actionButtonTitle: 'test',
  cancelButtonTitle: 'test',
  goToChangeEmail: jest.fn(),
  closeModal: jest.fn(),
  closeAllModal: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<EmailStatusModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<EmailStatusModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
