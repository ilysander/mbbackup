import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FacephiButton, { FacephiButtonProps } from './FacephiButton';

const props: FacephiButtonProps = {
  onValidationStart: jest.fn(),
  typeOfValidation: 'Front',
  capturedImage: 'image',
  title: 'title',
  subtitle: 'subtitle',
  iconFrontImage: require('../../assets/images/cable-icon.png'),
  active: true,
  accessibilityLabel: 'IdentityCheckLoginDniBackOk',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<FacephiButton {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FacephiButton {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
