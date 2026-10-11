import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ValidationModal, { ValidationModalProps } from './ValidationModal';

const props: ValidationModalProps = {
  title: 'sample',
  onCancel: jest.fn(),
  onSuccess: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ValidationModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ValidationModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('unmount', () => {
  const wrapper = renderer.create(<ValidationModal {...props} />);
  wrapper.unmount();
});

it('onSuccess', () => {
  const wrapper = renderer.create(<ValidationModal {...props} />);
  const instance = (wrapper.getInstance() as any) as ValidationModal;
  instance.onSuccess();
});

it('onCancel', () => {
  const wrapper = renderer.create(<ValidationModal {...props} />);
  const instance = (wrapper.getInstance() as any) as ValidationModal;
  instance.onCancel();
});
it('without onSuccess', () => {
  const localProps = {
    ...props,
    onSuccess: undefined,
  };
  const wrapper = renderer.create(<ValidationModal {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ValidationModal;
  instance.onSuccess();
});

it('without onCancel', () => {
  const localProps = {
    ...props,
    onCancel: undefined,
  };
  const wrapper = renderer.create(<ValidationModal {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ValidationModal;
  instance.onCancel();
});
