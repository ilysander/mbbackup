import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TextInputChipAmount, {
  TextInputChipAmountProps,
} from './TextInputChipAmount';

const props: TextInputChipAmountProps = {
  inputChipSelected: false,
  accessibilityLabel: 'focus_toggle',
  topAmount: 10,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<TextInputChipAmount {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TextInputChipAmount {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
