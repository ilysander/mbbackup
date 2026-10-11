import * as React from 'react';
import {
  StyleProp,
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
    flexDirection: 'row',
  } as ViewStyle,
  label: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  text: {
    color: Colors.grey5,
    ...Font(),
    fontSize: 14,
    alignItems: 'flex-end',
  } as TextStyle,
  labelContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  textContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
});

export interface DetailRowProps extends ViewProps {
  label: string;
  text: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
}

export interface DetailRowState {}

export default class DetailRow extends React.PureComponent<
  DetailRowProps,
  DetailRowState
> {
  render() {
    const {
      label,
      text,
      style,
      labelStyle,
      textStyle,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel || 'detailrow'}
        {...props}
      >
        <View style={styles.labelContainer}>
          <Text
            accessibilityLabel={`detailrow_label`}
            style={[styles.label, labelStyle]}
          >
            {label}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text
            accessibilityLabel={`detailrow_value`}
            style={[styles.text, textStyle]}
          >
            {text}
          </Text>
        </View>
      </View>
    );
  }
}
