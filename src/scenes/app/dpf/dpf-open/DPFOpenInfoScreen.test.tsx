import * as React from 'react';

import * as renderer from 'react-test-renderer';
import DPFOpenInfoScreen, {Props} from './DPFOpenInfoScreen';

const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  route: {} as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DPFOpenInfoScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DPFOpenInfoScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
