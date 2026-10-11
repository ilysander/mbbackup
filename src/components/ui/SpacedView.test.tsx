import * as React from 'react';
import { Text } from 'react-native';
import * as renderer from 'react-test-renderer';
import SpacedView, { SpacedViewProps } from './SpacedView';

const props: SpacedViewProps = {
  children: [
    <Text key={'1'}>test</Text>,
    <Text key={'2'}>test</Text>,
    <Text key={'3'}>test</Text>,
  ],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SpacedView {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SpacedView {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
