import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Happy, { HappyProps } from './Happy';

const props: HappyProps = {
  accessibilityLabel: 'test',
  title: 'Prueba',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<Happy {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Happy {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
