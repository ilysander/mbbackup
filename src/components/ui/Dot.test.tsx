import * as React from 'react';

import * as renderer from 'react-test-renderer';
import Dot from './Dot';

it('renders without crashing', () => {
  const snapshot = renderer.create(<Dot />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Dot />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
