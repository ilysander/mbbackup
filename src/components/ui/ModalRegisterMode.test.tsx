import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ModalRegisterMode, { ModalRegisterModeProps } from './ModalRegisterMode';
const props: ModalRegisterModeProps = {
  onRegisterWithCard: jest.fn(),
  onRegisterWithDni: jest.fn(),
  textButton: 'test',
  accessibilityLabel: 'focus_toggle',
  accessibilityLabelDni: 'focus_toggle',
  accessibilityLabelCard: 'focus_toggle',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ModalRegisterMode {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ModalRegisterMode {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
