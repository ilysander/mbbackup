import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Colors from '../../resources/constants/Colors';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  content: {
    paddingVertical: 30,
    alignItems: 'center',
  } as ViewStyle,
  textStyle: { color: Colors.grey4 } as TextStyle,
});

export interface EmptyMovementItemProps {}

export interface EmptyMovementItemState {}

export default class EmptyMovementItem extends React.Component<
  EmptyMovementItemProps,
  EmptyMovementItemState
> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.textStyle}>{L.emptymovementscreen_label}</Text>
        </View>
      </View>
    );
  }
}
