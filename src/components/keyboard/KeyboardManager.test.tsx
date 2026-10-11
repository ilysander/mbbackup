import * as React from 'react';
import * as renderer from 'react-test-renderer';
import KeyboardManager, { KeyboardManagerProps } from './KeyboardManager';

const props: KeyboardManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<KeyboardManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render', () => {
  const wrapper = renderer.create(<KeyboardManager {...props} />);
  const instance = (wrapper.getInstance() as any) as KeyboardManager;
  instance.render();
});
