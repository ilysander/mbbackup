import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ItemSelectorModal, { ItemSelectorModalProps } from './ItemSelectorModal';

const props: ItemSelectorModalProps = {
  values: [],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ItemSelectorModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ItemSelectorModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
