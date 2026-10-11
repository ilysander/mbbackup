import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CheckBox, { CheckBoxProps } from './CheckBox';

const props: CheckBoxProps = {
  accessibilityLabel: 'modal_overlay',
  placeholder: 'example',
  accent: true,
  onChangeValue: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<CheckBox {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<CheckBox {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('toggle', () => {
  const wrapper = renderer.create(<CheckBox {...props} />);
  const instance = (wrapper.getInstance() as any) as CheckBox;
  expect(instance.state.checked).toBe(false);
  instance.toggle();
  expect(instance.state.checked).toBe(true);
  instance.toggle();
  expect(instance.state.checked).toBe(false);
});

it('without onChangeValue', () => {
  const localProps: CheckBoxProps = {
    accessibilityLabel: 'modal_overlay',
    onChangeValue: undefined,
  };

  const wrapper = renderer.create(<CheckBox {...localProps} />);
  const instance = (wrapper.getInstance() as any) as CheckBox;
  instance.toggle();
});
