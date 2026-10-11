import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ScrollMore from './ScrollMore';

it('renders without crashing', () => {
  const snapshot = renderer.create(<ScrollMore />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ScrollMore />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
