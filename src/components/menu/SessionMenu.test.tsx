import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SessionMenu, {SessionMenuProps} from './SessionMenu';
import {ParamListBase} from '@react-navigation/routers';

const params: ParamListBase = {};
const props: SessionMenuProps = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {},
    goBack: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<SessionMenu {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<SessionMenu {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
