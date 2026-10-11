import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Panel, { PanelProps } from './Panel';

const props: PanelProps = {
  accessibilityLabel: 'test',
  title: 'Prueba',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Panel {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Panel {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
