import * as React from 'react';

import * as renderer from 'react-test-renderer';
import PanelHeader, { PanelHeaderProps } from './PanelHeader';

const props: PanelHeaderProps = {
  accessibilityLabel: 'test',
  title: 'Descripción',
  subtitle: 'TransferDescription',
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<PanelHeader {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PanelHeader {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
