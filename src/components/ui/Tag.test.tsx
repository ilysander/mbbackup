import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Tag, { TagProps } from './Tag';

const props: TagProps = {
  accessibilityLabel: 'test',
  title: 'test',
  value: 'test',
};
const alternativeProps: TagProps = {
  accessibilityLabel: 'test',
  title: 'test',
  value: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Tag {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('Type Secondary', () => {
  const snapshot = renderer.create(<Tag {...alternativeProps} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Tag {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
