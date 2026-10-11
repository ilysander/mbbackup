import * as React from 'react';
import * as renderer from 'react-test-renderer';
import RootManager, { RootManagerProps } from './RootManager';

const props: RootManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<RootManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
