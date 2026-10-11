import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DetailList, { DetailListProps } from './DetailList';

const props: DetailListProps = {
  elements: [
    {
      element: 'S/. 1.00',
      currency: '1',
      label: '',
      alwaysVisible: true,
    },
  ],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DetailList {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DetailList {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
