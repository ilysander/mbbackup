import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FormSteps, { FormStepsProps } from './FormSteps';

const props: FormStepsProps = {
  total: 4,
  current: 1,
};
const alternativeProps: FormStepsProps = {
  marginHorizontal: 60,
  total: 4,
  current: 1,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FormSteps {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('With Separator Width', () => {
  const snapshot = renderer
    .create(<FormSteps {...alternativeProps} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FormSteps {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
