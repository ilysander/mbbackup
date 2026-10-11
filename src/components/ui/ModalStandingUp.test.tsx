import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ModalStandingUp from './ModalStandingUp';

it('renders without crashing', () => {
  const snapshot = renderer.create(<ModalStandingUp />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ModalStandingUp />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
