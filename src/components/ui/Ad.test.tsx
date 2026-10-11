import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Ad, { AdProps } from './Ad';

const props: AdProps = {
  accessibilityLabel: 'modal_overlay',
  content: 'test',
  onClose: jest.fn(),
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<Ad {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Ad {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
