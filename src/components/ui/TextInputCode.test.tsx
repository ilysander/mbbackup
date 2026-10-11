import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TextInputCode from './TextInputCode';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<TextInputCode accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<TextInputCode accessibilityLabel={'modal_overlay'} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('focus', () => {
  const wrapper = renderer.create(
    <TextInputCode accessibilityLabel={'modal_overlay'} />
  );
  const instance = (wrapper.getInstance() as any) as TextInputCode;

  instance.focus();
});

it('blur', () => {
  const wrapper = renderer.create(
    <TextInputCode accessibilityLabel={'modal_overlay'} />
  );
  const instance = (wrapper.getInstance() as any) as TextInputCode;

  instance.blur();
});
