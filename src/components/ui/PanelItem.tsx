import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  content: {
    flexDirection: 'row',
  } as ViewStyle,
  left: {
    flex: 1,
  } as ViewStyle,
  right: {
    alignSelf: 'flex-end',
  } as ViewStyle,
  leftText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey3,
  } as TextStyle,
  rightText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
});

export interface PanelItemProps extends ViewProps {
  left?: string | React.ReactNode | React.ReactNode[];
  right?: string | React.ReactNode | React.ReactNode[];
}

export interface PanelItemState {}

export default class PanelItem extends React.Component<
  PanelItemProps,
  PanelItemState
> {
  render() {
    const { left, right, style, children, ...props } = this.props;
    return (
      <View style={[styles.container, style]} {...props}>
        <View style={styles.content}>
          <View style={styles.left}>
            {typeof left === 'string' ? (
              <Text style={styles.leftText}>{left}</Text>
            ) : (
              left
            )}
          </View>
          <View style={styles.right}>
            {typeof right === 'string' ? (
              <Text style={styles.rightText}>{right}</Text>
            ) : (
              right
            )}
          </View>
        </View>
        {children}
      </View>
    );
  }
}
