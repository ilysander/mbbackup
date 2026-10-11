import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ActionMenu, { ActionMenuProps } from './ActionMenu';

const props: ActionMenuProps = {
  accessibilityLabel: 'modal_overlay',
  onPressTooltip: jest.fn(),
  onLayout: jest.fn(),
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ActionMenu {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ActionMenu {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('updatePosition', () => {
  const wrapper = renderer.create(<ActionMenu {...props} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  if (!instance) {
    return;
  }

  instance.updatePosition();
});

it('onLayout', () => {
  const wrapper = renderer.create(<ActionMenu {...props} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.onLayout({} as any);
});

it('without onLayout', () => {
  const localProps = {
    ...props,
    onLayout: undefined,
  };
  const wrapper = renderer.create(<ActionMenu {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.onPressTooltip();
});
it('onPressTooltip', () => {
  const wrapper = renderer.create(<ActionMenu {...props} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.onPressTooltip();
});

it('without onPressTooltip', () => {
  const localProps = {
    ...props,
    onPressTooltip: undefined,
  };

  const wrapper = renderer.create(<ActionMenu {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.onPressTooltip();
});

it('toggle', () => {
  const wrapper = renderer.create(<ActionMenu {...props} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.onLayout({} as any);
  expect(instance.state.isVisible).toBe(false);
  instance.toggle();
  expect(instance.state.isVisible).toBe(true);
  instance.toggle();
  expect(instance.state.isVisible).toBe(false);
});

it('without onPress', () => {
  const localProps = {
    ...props,
    onPress: undefined,
  };
  const wrapper = renderer.create(<ActionMenu {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.toggle();
});

it('close', () => {
  const wrapper = renderer.create(<ActionMenu {...props} />);
  const instance = (wrapper.getInstance() as any) as ActionMenu;
  instance.close();
  expect(instance.state.isVisible).toBe(false);
});
