import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: Colors.grey2,
  } as ViewStyle,
  vertical: {
    width: 1,
    backgroundColor: Colors.grey2,
  } as ViewStyle,
});

export interface SeparatorProps {
  style?: StyleProp<ViewStyle>;
  vertical?: boolean;
}

export interface SeparatorState {}

export default class Separator extends React.Component<
  SeparatorProps,
  SeparatorState
> {
  static defaultProps = {
    vertical: false,
  };

  render() {
    const { style, vertical, ...props } = this.props;

    return (
      <View
        style={[vertical ? styles.vertical : styles.horizontal, style]}
        {...props}
      />
    );
  }
}
