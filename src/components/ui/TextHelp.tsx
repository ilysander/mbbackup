import * as React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  text: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  centerText: {
    textAlign: 'center',
    alignSelf: 'center',
  } as TextStyle,
});

export interface TextHelpProps extends TextProps {
  children?: string | React.ReactNode;
  center?: boolean;
}

export interface TextHelpState {}

export default class TextHelp extends React.Component<
  TextHelpProps,
  TextHelpState
> {
  static defaultProps = {
    center: false,
  };

  render() {
    const { children, center, style, ...props } = this.props;

    return (
      <Text
        style={[styles.text, center && styles.centerText, style]}
        accessibilityLabel={'texthelp'}
        {...props}
      >
        {children}
      </Text>
    );
  }
}
