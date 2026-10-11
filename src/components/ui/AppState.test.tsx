import * as React from 'react';

import * as renderer from 'react-test-renderer';
import AppState from './AppState';

it('render just views', () => {
  const snapshot = renderer
    .create(
      <AppState
        onActive={() => {
          return true;
        }}
        onInactive={() => {
          return true;
        }}
      />
    )
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
