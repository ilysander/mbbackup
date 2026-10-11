import * as React from 'react';

import * as renderer from 'react-test-renderer';
import BulletItem, { BulletItemProps } from './BulletItem';

const props: BulletItemProps = {
  text: 'test',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<BulletItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<BulletItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
