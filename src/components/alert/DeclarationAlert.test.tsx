import * as React from 'react';
import * as renderer from 'react-test-renderer';
import DeclarationAlert, { DeclarationAlertProps } from './DeclarationAlert';

const props: DeclarationAlertProps = {
  loading: false,
  onReject: jest.fn(),
  onAgree: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DeclarationAlert {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DeclarationAlert {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('render with props', () => {
  const wrapper = renderer.create(<DeclarationAlert {...props} />);
  wrapper.getInstance();
});

it('render loading', () => {
  const props: DeclarationAlertProps = {
    loading: true,
    onReject: jest.fn(),
    onAgree: jest.fn(),
  };
  const wrapper = renderer.create(<DeclarationAlert {...props} />);
  wrapper.getInstance();
});
