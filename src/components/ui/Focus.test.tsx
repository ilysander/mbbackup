import * as React from 'react';

import * as renderer from 'react-test-renderer';
import Focus, { FocusProps } from './Focus';

const props: FocusProps = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Focus {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Focus {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
