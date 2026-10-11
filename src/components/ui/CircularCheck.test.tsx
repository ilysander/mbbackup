import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CircularCheck, { CircularCheckProps } from './CircularCheck';

const props: CircularCheckProps = {
  accessibilityLabel: 'modal_overlay',
  placeholder: 'example',
  accent: true,
  onChangeValue: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<CircularCheck {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<CircularCheck {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('toggle', () => {
  const wrapper = renderer.create(<CircularCheck {...props} />);
  const instance = (wrapper.getInstance() as any) as CircularCheck;
  expect(instance.state.checked).toBe(false);
  instance.toggle();
  expect(instance.state.checked).toBe(true);
  instance.toggle();
  expect(instance.state.checked).toBe(false);
});

it('without onChangeValue', () => {
  const localProps: CircularCheckProps = {
    accessibilityLabel: 'modal_overlay',
    onChangeValue: undefined,
  };

  const wrapper = renderer.create(<CircularCheck {...localProps} />);
  const instance = (wrapper.getInstance() as any) as CircularCheck;
  instance.toggle();
});
