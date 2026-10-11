import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ModalChannels, { ModalChannelsProps } from './ModalChannels';
const props: ModalChannelsProps = {
  visible: true,
  allChannelsReady: false,
  titleTextLabel: 'test',
  subtitleTextLabel: 'test',
  textButton: 'test',
  bottom: 0,
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ModalChannels {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ModalChannels {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
