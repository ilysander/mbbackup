import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SettingsScreen from './SettingsScreen';

const props: any = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SettingsScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SettingsScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
