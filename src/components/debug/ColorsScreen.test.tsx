import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ColorsScreen from './ColorsScreen';

const props: any = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ColorsScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ColorsScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
