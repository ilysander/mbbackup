import * as React from 'react';
import * as renderer from 'react-test-renderer';
import LoginIncorrectInfoModal, {
  LoginIncorrectInfoModalProps,
} from './LoginIncorrectInfoModal';

const props: LoginIncorrectInfoModalProps = {
  visible: true,
  title: 'string',
  text: 'string',
  closeModal: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<LoginIncorrectInfoModal {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<LoginIncorrectInfoModal {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
