import * as React from 'react';

import * as renderer from 'react-test-renderer';
import Modal from './Modal';

it('renders without crashing', () => {
  const snapshot = renderer.create(<Modal />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Modal />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
