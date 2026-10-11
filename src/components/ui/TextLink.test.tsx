import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TextLink, { TextLinkProps } from './TextLink';

const props: TextLinkProps = {
  accessibilityLabel: 'modal_overlay',
  style: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onPress: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<TextLink {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TextLink {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render just views without strong ', () => {
  const props: TextLinkProps = {
    accessibilityLabel: 'modal_overlay',
    style: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onPress: jest.fn(),
  };
  const snapshot = renderer.create(<TextLink {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('onPress', () => {
  const wrapper = renderer.create(<TextLink {...props} />);
  const instance = (wrapper.getInstance() as any) as TextLink;
  instance.onPress({} as any);
  expect(props.onPress).toHaveBeenCalled();
});
