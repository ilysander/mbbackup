import * as React from 'react';
import * as renderer from 'react-test-renderer';
import LoadingInitPhase from './LoadingInitPhase';

it('renders without crashing', () => {
  const snapshot = renderer.create(<LoadingInitPhase />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<LoadingInitPhase />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
