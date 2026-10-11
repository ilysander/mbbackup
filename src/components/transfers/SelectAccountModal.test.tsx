import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SelectAccountModal, {
  SelectAccountModalProps,
} from './SelectAccountModal';

const props: SelectAccountModalProps = {
  values: [],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SelectAccountModal {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SelectAccountModal {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
