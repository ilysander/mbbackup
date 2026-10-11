import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ResumeHeader, { ResumeHeaderProps } from './ResumeHeader';

const props: ResumeHeaderProps = {
  accessibilityLabel: 'test',
  title: 'test',
  subtitle: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ResumeHeader {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ResumeHeader {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
