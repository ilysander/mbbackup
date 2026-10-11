import * as React from 'react';
import * as renderer from 'react-test-renderer';
import AccountField, { AccountFieldProps } from './AccountField';

const props: AccountFieldProps = {
  accessibilityLabel: 'modal_overlay',
  isDisabled: true,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views isLoading ', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    isLoading: true,
    isDisabled: false,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views enabled ', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    imageSource: require('../../assets/images/email-icon.png'),
    value: 'Test value',
    placeholder: 'Placeholder',
    isLoading: false,
    isDisabled: false,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views enabled without value', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    imageSource: require('../../assets/images/email-icon.png'),
    placeholder: 'Placeholder',
    subtitle: 'a@a.com',
    isLoading: false,
    isDisabled: false,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views disabled without value', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    imageSource: require('../../assets/images/email-icon.png'),
    placeholder: 'Placeholder',
    subtitle: 'a@a.com',
    isLoading: false,
    isDisabled: true,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<AccountField {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress is present', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    isDisabled: false,
    onPress: jest.fn(),
  };
  const wrapper = renderer.create(<AccountField {...props} />);
  const instance = (wrapper.getInstance() as any) as AccountField;
  instance.onPress({} as any);
  expect(instance.props.onPress).toBeCalled();
});

it('onPress: isDisabled is true', () => {
  const props: AccountFieldProps = {
    accessibilityLabel: 'modal_overlay',
    isDisabled: true,
    onPress: jest.fn(),
  };
  const wrapper = renderer.create(<AccountField {...props} />);
  const instance = (wrapper.getInstance() as any) as AccountField;
  expect(instance.onPress({} as any)).toBeUndefined();
});
