import * as React from 'react';

import * as renderer from 'react-test-renderer';
import KeyboardAvoidingView from './KeyboardAvoidingView';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<KeyboardAvoidingView enabled={true} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<KeyboardAvoidingView enabled={true} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
