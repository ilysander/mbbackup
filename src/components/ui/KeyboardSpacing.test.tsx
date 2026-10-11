import * as React from 'react';

import * as renderer from 'react-test-renderer';
import KeyboardSpacing from './KeyboardSpacing';

it('renders without crashing', () => {
  const snapshot = renderer.create(<KeyboardSpacing />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<KeyboardSpacing />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
