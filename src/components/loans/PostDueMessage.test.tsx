import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PostDueMessage, { PostDueMessageProps } from './PostDueMessage';

const props: PostDueMessageProps = {
  pastDueInstallments: 1,
  pastDueAmount: 100,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<PostDueMessage {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PostDueMessage {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
