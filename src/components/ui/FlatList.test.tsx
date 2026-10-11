import * as React from 'react';

import * as renderer from 'react-test-renderer';
import FlatList, { FlatListProps } from './FlatList';

const props: FlatListProps<any> = {
  data: [],
  renderItem: () => {
    return null;
  },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FlatList {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FlatList {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
