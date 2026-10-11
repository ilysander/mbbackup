import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Tooltip, { TooltipProps } from './Tooltip';

it('renders without crashing', () => {
  const props: TooltipProps = {
    showInitial: true,
    accessibilityLabel: 'modal_overlay',
    navigation: {
      addListener: jest.fn(),
    } as any,
  };

  const snapshot = renderer.create(<Tooltip {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render with props', () => {
  const props: TooltipProps = {
    showInitial: true,
    accessibilityLabel: 'modal_overlay',
    onPress: jest.fn(),
    onLayout: jest.fn(),
    onPressTooltip: jest.fn(),
    navigation: {
      addListener: jest.fn(),
    } as any,
  };

  const wrapper = renderer.create(<Tooltip {...props} />);
  const instance = (wrapper.getInstance() as any) as Tooltip;

  instance.onLayout({} as any);
});

it('render with props onClose', () => {
  const props: TooltipProps = {
    showInitial: true,
    accessibilityLabel: 'modal_overlay',
    onPress: jest.fn(),
    onLayout: jest.fn(),
    onPressTooltip: jest.fn(),
    navigation: {
      addListener: jest.fn(),
    } as any,
  };

  const wrapper = renderer.create(<Tooltip {...props} />);
  const instance = (wrapper.getInstance() as any) as Tooltip;

  instance.close();
  expect(instance.state.isVisible).toBe(false);
});

it('render just views', () => {
  const props: TooltipProps = {
    showInitial: true,
    accessibilityLabel: 'modal_overlay',
    navigation: {
      addListener: jest.fn(),
    } as any,
  };
  const snapshot = renderer.create(<Tooltip {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
