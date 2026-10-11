import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AlertManager, { AlertManagerProps } from './AlertManager';

const props: AlertManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<AlertManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
