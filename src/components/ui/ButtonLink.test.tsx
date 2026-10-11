import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ButtonLink, { ButtonLinkProps } from './ButtonLink';

const props: ButtonLinkProps = {
  accessibilityLabel: 'modal_overlay',
  style: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onPress: jest.fn(),
  strong: true,
  accent: 'primary',
  isDisabled: false,
  isLoading: false,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ButtonLink {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ButtonLink {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views without strong ', () => {
  const props: ButtonLinkProps = {
    accessibilityLabel: 'modal_overlay',
    style: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onPress: jest.fn(),
    strong: false,
    isDisabled: false,
    isLoading: false,
  };
  const snapshot = renderer.create(<ButtonLink {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress', () => {
  const wrapper = renderer.create(<ButtonLink {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonLink;
  instance.onPress({} as any);
  expect(props.onPress).toHaveBeenCalled();
});

it('onPress, is already loading ', () => {
  const props: ButtonLinkProps = {
    accessibilityLabel: 'modal_overlay',
    style: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onPress: jest.fn(),
    isDisabled: false,
    isLoading: true,
  };
  const wrapper = renderer.create(<ButtonLink {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonLink;
  instance.onPress({} as any);
  expect(props.onPress).not.toHaveBeenCalled();
});

it('onPress, undefined ', () => {
  const props: ButtonLinkProps = {
    accessibilityLabel: 'modal_overlay',
    style: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onPress: undefined,
    isDisabled: false,
    isLoading: false,
  };
  const wrapper = renderer.create(<ButtonLink {...props} />);
  const instance = (wrapper.getInstance() as any) as ButtonLink;
  const spy = jest.spyOn(instance, 'onPress');
  instance.onPress({} as any);
  expect(spy).toReturn();
});
