import * as React from 'react';
import {
  SafeAreaView as BaseSafeAreaView,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

export interface SafeAreaViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface SafeAreaViewState { }

export default class SafeAreaView2 extends React.Component<
  SafeAreaViewProps,
  SafeAreaViewState
> {
  render() {
    const { style, ...props } = this.props;
    return <BaseSafeAreaView style={[styles.container, style]} {...props} />;
  }
}
