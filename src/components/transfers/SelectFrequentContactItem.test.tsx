import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SelectFrequentContactItem, {
  SelectFrequentContactItemProps,
} from './SelectFrequentContactItem';

const props: SelectFrequentContactItemProps = {
  accessibilityLabel: 'modal_overlay',
  item: {},
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<SelectFrequentContactItem {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<SelectFrequentContactItem {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
