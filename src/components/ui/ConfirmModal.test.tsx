import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ConfirmModal from './ConfirmModal';

it('renders without crashing', () => {
  const snapshot = renderer.create(<ConfirmModal />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ConfirmModal />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
