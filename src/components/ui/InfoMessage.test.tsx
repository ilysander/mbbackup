import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InfoMessage, { InfoMessageProps } from './InfoMessage';

const props: InfoMessageProps = {
  accessibilityLabel: 'test',
  message: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<InfoMessage {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<InfoMessage {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
