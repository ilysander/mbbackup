import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Separator, { SeparatorProps } from './Separator';

const props: SeparatorProps = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Separator {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Separator {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
