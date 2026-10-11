import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SelectFrequentContactDropdown, {
  SelectFrequentContactDropdownProps,
} from './SelectFrequentContactDropdown';

const props: SelectFrequentContactDropdownProps = {
  accessibilityLabel: 'test',
  values: [],
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<SelectFrequentContactDropdown {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<SelectFrequentContactDropdown {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
