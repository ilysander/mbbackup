import * as React from 'react';
import * as renderer from 'react-test-renderer';
import UpdateManager, { UpdateManagerProps } from './UpdateManager';

const props: UpdateManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<UpdateManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
