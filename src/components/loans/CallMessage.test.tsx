import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CallMessage from './CallMessage';

it('render just views', () => {
  const snapshot = renderer.create(<CallMessage />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
