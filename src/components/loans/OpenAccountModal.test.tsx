import * as React from 'react';
import * as renderer from 'react-test-renderer';
import OpenAccountModal, { OpenAccountModalProps } from './OpenAccountModal';

const props: OpenAccountModalProps = {
  visible: true,
  openAccount: jest.fn(),
  closeModal: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<OpenAccountModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<OpenAccountModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
