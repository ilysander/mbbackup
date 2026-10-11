import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ItemDescription, { ItemDescriptionProps } from './ItemDescription';

const props: ItemDescriptionProps = {
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ItemDescription {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ItemDescription {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
