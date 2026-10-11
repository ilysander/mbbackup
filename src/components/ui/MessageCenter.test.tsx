import * as React from 'react';

import * as renderer from 'react-test-renderer';
import MessageCenter from './MessageCenter';

it('renders without crashing', () => {
  const snapshot = renderer.create(<MessageCenter />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MessageCenter />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
