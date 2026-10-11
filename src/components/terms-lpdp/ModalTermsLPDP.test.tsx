import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ModalTermsLPDP, { ModalTermsLPDPProps } from './ModalTermsLPDP';
const props: ModalTermsLPDPProps = {
  onClose: () => {},
  accessibilityLabel: 'analytics_test',
  accessibilityLabelButtonClose: 'analytics_test',
  accessibilityLabelExpandableItem: 'analytics_test',
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<ModalTermsLPDP {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer.create(<ModalTermsLPDP {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
