import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonExternal, { ButtonExternalProps } from './ButtonExternal';

const props: ButtonExternalProps = {
  accessibilityLabel: 'modal_overlay',
  imageStyle: { width: 20, height: 20 },
  style: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSource: 5,
  underline: true,
  onPress: jest.fn(),
  isDisabled: false,
  isLoading: false,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ButtonExternal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ButtonExternal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress', () => {
  const wrapper = renderer.create(<ButtonExternal {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonExternal;
  instance.onPress({} as any);
  expect(props.onPress).toHaveBeenCalled();
});

it('onPress, is already loading ', () => {
  const props: ButtonExternalProps = {
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
    isLoading: true,
  };
  const wrapper = renderer.create(<ButtonExternal {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonExternal;
  instance.onPress({} as any);
  expect(props.onPress).not.toHaveBeenCalled();
});

it('onPress, undefined ', () => {
  const props: ButtonExternalProps = {
    accessibilityLabel: 'modal_overlay',
    imageStyle: { width: 20, height: 20 },
    style: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageSource: 5,
    onPress: undefined,
    isDisabled: false,
    isLoading: false,
  };
  const wrapper = renderer.create(<ButtonExternal {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonExternal;
  const spy = jest.spyOn(instance, 'onPress');
  instance.onPress({} as any);
  expect(spy).toReturn();
});
