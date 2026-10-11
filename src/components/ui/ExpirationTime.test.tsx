import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ExpirationTime from './ExpirationTime';

it('render just views', () => {
  const snapshot = renderer.create(<ExpirationTime />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
