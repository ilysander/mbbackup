import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DeviceItem, { DeviceItemProps } from './DeviceItem';

const props: DeviceItemProps = {
  accessibilityLabel: 'modal_overlay',
  lastConexion: 'test',
  deviceName: 'test',
  deviceNameDescription: 'test',
  selected: false,
  actionName: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DeviceItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DeviceItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
