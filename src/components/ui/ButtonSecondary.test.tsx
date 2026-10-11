import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonSecondary from './ButtonSecondary';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<ButtonSecondary accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<ButtonSecondary accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
