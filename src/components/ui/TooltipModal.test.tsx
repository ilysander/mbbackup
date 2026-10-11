import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TooltipModal, { TooltipModalProps } from './TooltipModal';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(
      <TooltipModal accessibilityLabel={'modal_overlay'} message={'Sample'} />
    )
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(
      <TooltipModal accessibilityLabel={'modal_overlay'} message={'Sample'} />
    )
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with props onPress', () => {
  const props: TooltipModalProps = {
    accessibilityLabel: 'modal_overlay',
    onChange: jest.fn(),
    message: 'Sample',
  };

  const wrapper = renderer.create(<TooltipModal {...props} />);
  const instance = (wrapper.getInstance() as any) as TooltipModal;

  instance.toggle();
  expect(instance.state.isVisible).toBe(true);
});

it('render with no onChange', () => {
  const props: TooltipModalProps = {
    accessibilityLabel: 'modal_overlay',
    onChange: undefined,
    message: 'Sample',
  };

  const wrapper = renderer.create(<TooltipModal {...props} />);
  const instance = (wrapper.getInstance() as any) as TooltipModal;

  instance.toggle();
  expect(instance.state.isVisible).toBe(true);
});

it('render with props onClose', () => {
  const props: TooltipModalProps = {
    accessibilityLabel: 'modal_overlay',
    onChange: jest.fn(),
    message: 'Sample',
  };

  const wrapper = renderer.create(<TooltipModal {...props} />);
  const instance = (wrapper.getInstance() as any) as TooltipModal;

  instance.close();
  expect(instance.state.isVisible).toBe(false);
});
