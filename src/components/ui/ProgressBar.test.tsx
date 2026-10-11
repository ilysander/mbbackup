import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProgressBar, { ProgressBarProps } from './ProgressBar';

const props: ProgressBarProps = {
  progress: 0.5,
  width: 300,
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ProgressBar {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ProgressBar {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('setValue lower than one', () => {
  const wrapper = renderer.create(<ProgressBar {...props} />);
  const instance = (wrapper.getInstance() as any) as ProgressBar;

  instance.setValue(0.8);
});

it('setValue greater than one', () => {
  const wrapper = renderer.create(<ProgressBar {...props} />);
  const instance = (wrapper.getInstance() as any) as ProgressBar;

  instance.setValue(1.8);
});
