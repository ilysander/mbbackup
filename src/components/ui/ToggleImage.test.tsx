import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ToggleImage, { ToggleImageProps } from './ToggleImage';

const props: ToggleImageProps = {
  accessibilityLabel: 'modal_overlay',
  onChangeValue: jest.fn(),
  imageSource: { uri: 'http://sample.com/image.png' },
  imageSourceActive: { uri: 'http://sample.com/image.png' },
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ToggleImage {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ToggleImage {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('without onChangeValue', () => {
  const localProps: ToggleImageProps = {
    accessibilityLabel: 'modal_overlay',
    onChangeValue: undefined,
    imageSource: { uri: 'http://sample.com/image.png' },
    imageSourceActive: { uri: 'http://sample.com/image.png' },
  };

  const wrapper = renderer.create(<ToggleImage {...localProps} />);
  const instance = (wrapper.getInstance() as any) as ToggleImage;
  instance.toggle();
});
