import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Selector, { SelectorProps } from './Selector';

const props: SelectorProps<string> = {
  accessibilityLabel: 'test',
  onSelectIndex: jest.fn(),
  options: [
    {
      label: 'sample1',
      value: '1',
    },
    {
      label: 'sample2',
      value: '2',
    },
  ],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Selector {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Selector {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
