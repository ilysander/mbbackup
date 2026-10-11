import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Banner, { BannerProps } from './Banner';

const props: BannerProps = {
  accessibilityLabel: 'accountfield_touchable_edit',
  content: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Banner {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Banner {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
