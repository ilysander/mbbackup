import * as React from 'react';
import * as renderer from 'react-test-renderer';
import MobileServiceManager, {
  HmsMobileServiceProps,
} from './MobileServiceManager';

const props: HmsMobileServiceProps = {
  accessibilityLabel: 'MobileServiceManager',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer
    .create(<MobileServiceManager {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});
