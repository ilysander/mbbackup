import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SecureKeyboard, { SecureKeyboardProps } from './SecureKeyboard';

const props: SecureKeyboardProps = { onKeyPressed: jest.fn() };

it('renders without crashing', () => {
  const snapshot = renderer.create(<SecureKeyboard {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SecureKeyboard {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('renders without crashing random type', () => {
  const snapshot = renderer
    .create(<SecureKeyboard {...props} type={'random'} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});
