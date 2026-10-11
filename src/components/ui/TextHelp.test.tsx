import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TextHelp, { TextHelpProps } from './TextHelp';

const props: TextHelpProps = { children: 'test' };

it('renders without crashing', () => {
  const snapshot = renderer.create(<TextHelp {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TextHelp {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
