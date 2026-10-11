import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CommissionLabel, { CommissionLabelProps } from './CommissionLabel';
const props: CommissionLabelProps = {
  imageSourceLeft: require('../../assets/images/bg-confite-large.png'),
  imageSourceRight: require('../../assets/images/bg-confite-large.png'),
  text: 'test',
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<CommissionLabel {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<CommissionLabel {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
