import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CardView from './CardView';

it('renders without crashing', () => {
  const snapshot = renderer.create(<CardView />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<CardView />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
