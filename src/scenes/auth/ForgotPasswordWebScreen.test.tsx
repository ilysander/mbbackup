import * as React from 'react';

import * as renderer from 'react-test-renderer';
import ForgotPasswordWebScreen, {Props} from './ForgotPasswordWebScreen';

const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {} as any,
};

it('render just views', () => {
  const snapshot = renderer
    .create(<ForgotPasswordWebScreen {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
