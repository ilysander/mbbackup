import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SMSReader, { SMSReaderProps } from './SMSReader';

const props: SMSReaderProps = {
  onReadCode: jest.fn(),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<SMSReader {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SMSReader {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
