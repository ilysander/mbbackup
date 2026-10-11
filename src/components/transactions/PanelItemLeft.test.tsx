import * as React from 'react';

import * as renderer from 'react-test-renderer';
import PanelItemLeft, { PanelItemLeftProps } from './PanelItemLeft';

const props: PanelItemLeftProps = {
  text: 'Préstamo Vivienda - 108624815',
  title: 'Mi préstamo',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<PanelItemLeft {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PanelItemLeft {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
