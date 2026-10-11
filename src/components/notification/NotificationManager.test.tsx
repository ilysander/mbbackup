import * as React from 'react';
import * as renderer from 'react-test-renderer';
import NotificationManager, {
  NotificationManagerProps,
} from './NotificationManager';

const props: NotificationManagerProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
};

it('render just views', () => {
  const snapshot = renderer.create(<NotificationManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
