import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Button, { ButtonProps } from './Button';

const props: ButtonProps = {
  accessibilityLabel: 'confirmationsendingmessage_text_set_mail',
  title: 'Sample',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<Button {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Button {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with props', () => {
  const props: ButtonProps = {
    accessibilityLabel: 'termsmodal_button_agree',
    onPress: jest.fn(),
    disabled: true,
    title: 'Sample',
  };

  const wrapper = renderer.create(<Button {...props} />);
  const instance = (wrapper.getInstance() as any) as Button;

  instance.onPress({} as any);
});

it('render without props', () => {
  const props: ButtonProps = {
    accessibilityLabel: 'termsmodal_button_agree',
    onPress: jest.fn(),
    disabled: false,
    title: 'Sample',
  };

  const wrapper = renderer.create(<Button {...props} />);
  const instance = (wrapper.getInstance() as any) as Button;

  instance.onPress({} as any);
});
