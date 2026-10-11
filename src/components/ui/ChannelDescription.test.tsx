import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ChannelDescription from './ChannelDescription';

it('renders without crashing', () => {
  const snapshot = renderer.create(<ChannelDescription />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ChannelDescription />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
