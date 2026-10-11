import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TitleBox from './TitleBox';

it('renders without crashing', () => {
  const snapshot = renderer.create(<TitleBox />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<TitleBox />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
