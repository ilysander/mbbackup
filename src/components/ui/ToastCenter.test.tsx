import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ToastCenter from './ToastCenter';

it('renders without crashing', () => {
  const snapshot = renderer.create(<ToastCenter />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ToastCenter />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
