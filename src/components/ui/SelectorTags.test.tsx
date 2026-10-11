import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SelectorTag, { SelectorTagProps } from './SelectorTag';

const props: SelectorTagProps<string> = {
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
  const snapshot = renderer.create(<SelectorTag {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SelectorTag {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
