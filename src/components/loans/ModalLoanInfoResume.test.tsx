import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ModalLoanInfoResume, {
  ModalLoanInfoResumeProps,
} from './ModalLoanInfoResume';
const props: ModalLoanInfoResumeProps = {
  onClose: jest.fn(),
  goOpenAccount: jest.fn(),
  accessibilityLabel: 'focus_toggle',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<ModalLoanInfoResume {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ModalLoanInfoResume {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
