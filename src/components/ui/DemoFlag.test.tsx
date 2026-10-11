import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DemoFlag, { DemoFlagProps } from './DemoFlag';

const props: DemoFlagProps = {
  accessibilityLabel: 'test',
  style: {},
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DemoFlag {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DemoFlag {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
