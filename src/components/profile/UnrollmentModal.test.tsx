import * as React from 'react';
import * as renderer from 'react-test-renderer';
import UnrollmentModal, { UnrollmentModalProps } from './UnrollmentModal';

const props: UnrollmentModalProps = {
  selectedPhoneName: 'test',
  thisPhone: true,
  visible: true,
  unrollDevice: jest.fn(),
  closeModal: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<UnrollmentModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<UnrollmentModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
