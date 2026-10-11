import * as React from 'react';
import { View } from 'react-native';

export interface FeedbackManagerProps {
  accessibilityLabel: string;
}

export interface FeedbackManagerState { }

export default class FeedbackManager extends React.Component<
  FeedbackManagerProps,
  FeedbackManagerState
> {
  static bugReporting() {
    return true;
  }

  render() {
    const { accessibilityLabel } = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
