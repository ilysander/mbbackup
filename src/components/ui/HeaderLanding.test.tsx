import * as React from 'react';
import * as renderer from 'react-test-renderer';
import HeaderLanding from './HeaderLanding';

it('renders without crashing', () => {
  const snapshot = renderer.create(<HeaderLanding />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<HeaderLanding />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
