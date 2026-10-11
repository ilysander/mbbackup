import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SafeAreaView from './SafeAreaView';

it('renders without crashing', () => {
  const snapshot = renderer.create(<SafeAreaView />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SafeAreaView />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
