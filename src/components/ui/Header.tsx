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
    overflow: 'visible',
  } as ViewStyle,
  subtitleContainer: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  subtitleHeaderContainer: {
    marginTop: 2,
  } as ViewStyle,
  subtitleCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  titleContainer: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  titleCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 22,
    lineHeight: 25,
    textAlign: 'left',
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey6,
    lineHeight: 15,
    fontSize: 13,
    textAlign: 'left',
  } as TextStyle,
  accentText: {
    color: Colors.accentDark,
  } as TextStyle,
  centerText: {
    textAlign: 'center',
  } as TextStyle,
});

export interface HeaderProps extends ViewProps {
  title?: string | React.ReactNode;
  titleContainer?: React.ReactNode | React.ReactNode[];
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string | React.ReactNode;
  subtitleContainer?: React.ReactNode | React.ReactNode[];
  subtitleStyle?: StyleProp<TextStyle>;
  accent?: boolean;
  center?: boolean;
  accessibilityLabel: string;
}

export interface HeaderState {}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps = {
    center: false,
  };

  render() {
    const {
      style,
      title,
      subtitle,
      accent,
      titleStyle,
      subtitleStyle,
      center,
      children,
      titleContainer,
      subtitleContainer,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'header'}
        style={[styles.container, style]}
        {...props}
      >
        <View
          style={[styles.titleContainer, center && styles.titleCenterContainer]}
        >
          {!!title && (
            <Text
              accessibilityLabel={'header_text_title'}
              style={[
                styles.titleText,
                accent && styles.accentText,
                center && styles.centerText,
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {titleContainer}
        </View>
        <View
          style={[
            styles.subtitleContainer,
            center && styles.subtitleCenterContainer,
            !!subtitle && !!title && styles.subtitleHeaderContainer,
          ]}
        >
          {!!subtitle && (
            <Text
              accessibilityLabel={'header_text_subtitle'}
              style={[
                styles.subtitleText,
                center && styles.centerText,
                subtitleStyle,
              ]}
            >
              {subtitle}
            </Text>
          )}
          {subtitleContainer}
        </View>
        {children}
      </View>
    );
  }
}
