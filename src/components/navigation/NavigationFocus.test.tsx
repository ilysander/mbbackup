import * as React from 'react';

import * as renderer from 'react-test-renderer';
import NavigationFocus, { NavigationFocusProps } from './NavigationFocus';

const props: NavigationFocusProps = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  onBlur: () => {
    return true;
  },
  onFocus: () => {
    return true;
  },
};

it('render just views', () => {
  const snapshot = renderer.create(<NavigationFocus {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
