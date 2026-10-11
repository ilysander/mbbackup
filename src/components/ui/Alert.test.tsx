import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Alert, { AlertProps } from './Alert';

const props: AlertProps = {
  visible: true,
  message: 'sample',
  actionButton: {
    onPress: jest.fn(),
    accessibilityLabel: 'modal_overlay',
    loading: false,
    title: 'sample',
  },
  cancelButton: {
    onPress: jest.fn(),
    accessibilityLabel: 'modal_overlay',
    title: 'sample',
  },
  onClose: jest.fn(),
};

const propsWithoutFunction: AlertProps = {
  visible: true,
  message: 'sample',
  actionButton: {
    loading: true,
    accessibilityLabel: 'modal_overlay',
    title: 'sample',
  },
  cancelButton: {
    title: 'sample',
    accessibilityLabel: 'modal_overlay',
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Alert {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Alert {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with props', () => {
  const wrapper = renderer.create(<Alert {...props} />);
  wrapper.getInstance();
});

it('onClose', () => {
  const wrapper = renderer.create(<Alert {...props} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onClose();
});

it('onSuccess', () => {
  const wrapper = renderer.create(<Alert {...props} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onSuccess();
});

it('onCancel', () => {
  const wrapper = renderer.create(<Alert {...props} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onCancel();
});

it('onClose !== function', () => {
  const wrapper = renderer.create(<Alert {...propsWithoutFunction} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onClose();
});

it('onSuccess !== function', () => {
  const wrapper = renderer.create(<Alert {...propsWithoutFunction} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onSuccess();
});

it('onCancel !== function', () => {
  const wrapper = renderer.create(<Alert {...propsWithoutFunction} />);
  const instance = (wrapper.getInstance() as any) as Alert;
  instance.onCancel();
});
