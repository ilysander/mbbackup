import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CheckLPDP, { Props } from './CheckLPDP';
const props: Props = {
  showTermsLpdp: () => {},
  dni: '12345678',
  accessibilityLabelCheck: 'analytics_test',
  accessibilityLabelLinkOpenModal: 'analytics_test',
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<CheckLPDP {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer.create(<CheckLPDP {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
