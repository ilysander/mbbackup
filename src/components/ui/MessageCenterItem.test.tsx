import * as React from 'react';
import * as renderer from 'react-test-renderer';
import MessageCenterItem, { MessageCenterItemProps } from './MessageCenterItem';

const props: MessageCenterItemProps = {
  message: 'test',
  accessibilityLabel: 'modal_overlay',
  onTimeout: jest.fn() as any,
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<MessageCenterItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MessageCenterItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
