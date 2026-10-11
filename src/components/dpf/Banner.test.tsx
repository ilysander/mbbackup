import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Banner from './Banner';

it('renders without crashing', () => {
  const snapshot = renderer.create(<Banner />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Banner />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
