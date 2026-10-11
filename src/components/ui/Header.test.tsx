import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Header, { HeaderProps } from './Header';

const props: HeaderProps = {
  accessibilityLabel: 'test',
  title: 'Prueba',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<Header {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<Header {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
