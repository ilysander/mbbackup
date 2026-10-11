import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SectionHeader from './SectionHeader';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<SectionHeader accessibilityLabel={'test'} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<SectionHeader accessibilityLabel={'test'} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
