import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Info, { InfoProps } from './Info';

const props: InfoProps = {
  accessibilityLabel: 'test',
  title: 'Demo',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Info {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Info {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
