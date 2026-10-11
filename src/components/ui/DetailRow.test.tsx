import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DetailRow, { DetailRowProps } from './DetailRow';

const props: DetailRowProps = {
  text: 'Préstamo Vivienda - 108624815',
  label: 'Depósito',
  accessibilityLabel: '',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DetailRow {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DetailRow {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
