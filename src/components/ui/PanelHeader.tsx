import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
  } as ViewStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 20,
    lineHeight: 25,
  } as TextStyle,
  subtitle: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
});

export interface PanelHeaderProps extends ViewProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  subtitleStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
}

export interface PanelHeaderState {}

export default class PanelHeader extends React.Component<
  PanelHeaderProps,
  PanelHeaderState
> {
  render() {
    const {
      title,
      subtitle,
      style,
      subtitleStyle,
      titleStyle,
      children,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'panelheader'}
        style={[styles.container, style]}
        {...props}
      >
        {typeof title === 'string' ? (
          <Text
            accessibilityLabel={'panelheader_title'}
            style={[styles.title, titleStyle]}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {typeof subtitle === 'string' ? (
          <Text
            accessibilityLabel={'panelheader_subtitle'}
            style={[styles.subtitle, subtitleStyle]}
          >
            {subtitle}
          </Text>
        ) : (
          subtitle
        )}
        {children}
      </View>
    );
  }
}
