import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AdLarge, { AdLargeProps } from './AdLarge';

const props: AdLargeProps = {
  accessibilityLabel: 'modal_overlay',
  content: 'test',
  onClose: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AdLarge {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AdLarge {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
