import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TextInput from './TextInput';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<TextInput accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<TextInput accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
