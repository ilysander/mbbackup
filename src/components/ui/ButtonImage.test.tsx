import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonImage, { ButtonImageProps } from './ButtonImage';

const props: ButtonImageProps = {
  accessibilityLabel: 'modal_overlay',
  imageStyle: { width: 20, height: 20 },
  style: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSource: 5,
  onPress: jest.fn(),
  isDisabled: false,
  isLoading: false,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ButtonImage {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ButtonImage {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views when loaded is hidden', () => {
  const customProps: ButtonImageProps = {
    ...props,
    loadingColor: undefined,
    isDisabled: false,
    isLoading: false,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<ButtonImage {...customProps} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views when it has been loaded', () => {
  const customProps: ButtonImageProps = {
    ...props,
    isLoading: true,
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<ButtonImage {...customProps} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress Canceled', () => {
  const customProps: ButtonImageProps = {
    ...props,
    isLoading: false,
    isDisabled: true,
    onPress: jest.fn(),
  };
  const wrapper = renderer.create(<ButtonImage {...customProps} />);
  const instance = (wrapper.getInstance() as any) as ButtonImage;
  instance.onPress({} as any);
  expect(instance.props.onPress).not.toBeCalled();
});
it('onPress passed', () => {
  const customProps: ButtonImageProps = {
    ...props,
    isLoading: false,
    isDisabled: false,
    onPress: jest.fn(),
  };
  const wrapper = renderer.create(<ButtonImage {...customProps} />);
  const instance = (wrapper.getInstance() as any) as ButtonImage;
  instance.onPress({} as any);
  expect(instance.props.onPress).toBeCalled();
});

it('getButtonRef', () => {
  const customProps = {
    ...props,
    isLoading: false,
    isDisabled: false,
    onPress: jest.fn(),
  };
  const wrapper = renderer.create(<ButtonImage {...customProps} />);
  const instance = (wrapper.getInstance() as any) as ButtonImage;
  expect(typeof instance.getButtonRef()).toBe('object');
});
