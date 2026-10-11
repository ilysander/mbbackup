import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Channels from './Channels';

it('render just views', () => {
  const snapshot = renderer.create(<Channels />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
