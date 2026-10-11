import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InfoStaticContact, { InfoStaticContactProps } from './InfoStaticContact';

const props: InfoStaticContactProps = {
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<InfoStaticContact {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<InfoStaticContact {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
