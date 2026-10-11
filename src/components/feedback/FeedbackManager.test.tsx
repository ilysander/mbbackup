import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FeedbackManager, {FeedbackManagerProps} from './FeedbackManager';

const props: FeedbackManagerProps = {
  accessibilityLabel: 'test',
};

it('render just views', () => {
  const snapshot = renderer.create(<FeedbackManager {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});
