import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProgressInfo, { ProgressInfoProps } from './ProgressInfo';

const props: ProgressInfoProps = {
  progress: 0.5,
  width: 300,
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ProgressInfo {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ProgressInfo {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
