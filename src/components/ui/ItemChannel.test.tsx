import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ItemChannel, { ItemChannelProps } from './ItemChannel';

const props: ItemChannelProps = {
  channelType: 'FistLabel',
  channelName: 'SecondLabel',
  accessibilityLabel: 'accessibilityLabel_test',
  imageSource: require('../../assets/images/cable-icon.png'),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<ItemChannel {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ItemChannel {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
