import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ResumeBox, { ResumeBoxProps } from './ResumeBox';

const props: ResumeBoxProps = {
  accessibilityLabel: 'test',
  title: 'test',
  subtitle: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ResumeBox {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ResumeBox {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
