import * as React from 'react';
import * as renderer from 'react-test-renderer';
import QueriesHeader, { QueriesHeaderProps } from './QueriesHeader';

const props: QueriesHeaderProps = {
  accessibilityLabel: 'test',
  name: 'pedro',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<QueriesHeader {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<QueriesHeader {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
