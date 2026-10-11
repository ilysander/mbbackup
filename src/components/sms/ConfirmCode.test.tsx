import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ConfirmCode, { ConfirmCodeProps } from './ConfirmCode';

const props: ConfirmCodeProps = {
  accessibilityLabel: 'test',
  onResend: async () => {
    return;
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ConfirmCode {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ConfirmCode {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
