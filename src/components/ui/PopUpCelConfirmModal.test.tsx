import * as React from 'react';

import * as renderer from 'react-test-renderer';
import PopUpCelConfirmModal, {
  PopUpCelConfirmModalProps,
} from './PopUpCelConfirmModal';

const props: PopUpCelConfirmModalProps = {
  isVisible: true,
  closeModal: jest.fn(),
};
it('renders without crashing', () => {
  const snapshot = renderer
    .create(<PopUpCelConfirmModal {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<PopUpCelConfirmModal {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
