import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ToastCenterItem, { ToastCenterItemProps } from './ToastCenterItem';

const props: ToastCenterItemProps = {
  onTimeout: jest.fn() as any,
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<ToastCenterItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ToastCenterItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
