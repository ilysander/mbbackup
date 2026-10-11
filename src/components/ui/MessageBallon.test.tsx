import * as React from 'react';
import * as renderer from 'react-test-renderer';
import MessageBallon, { MessageBallonProps } from './MessageBallon';
const props: MessageBallonProps = {
  message: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<MessageBallon {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MessageBallon {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
