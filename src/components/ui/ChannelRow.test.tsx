import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ChannelRow, { ChannelRowProps } from './ChannelRow';
const props: ChannelRowProps = {
  allChannelsReady: true,
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<ChannelRow {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ChannelRow {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
