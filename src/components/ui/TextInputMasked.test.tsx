import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Formats } from '../../resources/constants';
import TextInputMasked, { TextInputMaskedProps } from './TextInputMasked';

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<TextInputMasked accessibilityLabel={'modal_overlay'} mask={{}} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<TextInputMasked accessibilityLabel={'modal_overlay'} mask={{}} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('View with in props', () => {
  const props: TextInputMaskedProps = {
    accessibilityLabel: 'modal_overlay',
    formatText: Formats.DebitCard,
    mask: '1234123412341234',
    imageSource: require('../../assets/images/card-icon.png'),
  };
  const snapshot = renderer.create(<TextInputMasked {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('View without format in props', () => {
  const props: TextInputMaskedProps = {
    accessibilityLabel: 'modal_overlay',
    formatText: undefined,
    mask: '1234123412341234',
    imageSource: require('../../assets/images/card-icon.png'),
  };
  const snapshot = renderer.create(<TextInputMasked {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
