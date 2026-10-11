import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ResumeBoxStatus, { ResumeBoxStatusProps } from './ResumeBoxStatus';

const props: ResumeBoxStatusProps = {
  text: 'test',
  accessibilityLabel: 'test',
  imageSource: require('../../assets/images/arrow-icon.png'),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ResumeBoxStatus {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ResumeBoxStatus {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
