import * as React from 'react';

import * as renderer from 'react-test-renderer';
import CopilotModal from './CopilotModal';

const props: any = {};

it('renders without crashing', () => {
  const snapshot = renderer.create(<CopilotModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<CopilotModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
