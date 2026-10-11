import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  text: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey5,
    textAlign: 'left',
    fontSize: 13,
  } as TextStyle,
  centerText: {
    textAlign: 'center',
  } as TextStyle,
});

export interface SectionHeaderProps extends ViewProps {
  title?: string | React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  center?: boolean;
  subtitle?: string;
  subtitleTextStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
}

export interface SectionHeaderState {}

export default class SectionHeader extends React.Component<
  SectionHeaderProps,
  SectionHeaderState
> {
  render() {
    const {
      title,
      subtitle,
      style,
      textStyle,
      subtitleTextStyle,
      center,
      children,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'sectionheader'}
        style={style}
        {...props}
      >
        <Text
          accessibilityLabel={'sectionheader_text'}
          style={[styles.text, center && styles.centerText, textStyle]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            accessibilityLabel={'sectionheader_text_subtitle'}
            style={[
              styles.subtitleText,
              center && styles.centerText,
              subtitleTextStyle,
            ]}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </View>
    );
  }
}
