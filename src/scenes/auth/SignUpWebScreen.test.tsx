import * as React from 'react';

import * as renderer from 'react-test-renderer';
import SignUpWebScreen, {Props} from './SignUpWebScreen';

const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<SignUpWebScreen {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
