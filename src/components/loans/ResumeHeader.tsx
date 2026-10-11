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
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  nameText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  loanText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 18,
  } as TextStyle,
  leftContainer: {
    flex: 1,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
});

export interface ResumeHeaderProps extends ViewProps {
  title: string;
  subtitle: string;
  accessibilityLabel: string;
  rightContainer?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export interface ResumeHeaderState {}

export default class ResumeHeader extends React.Component<
  ResumeHeaderProps,
  ResumeHeaderState
> {
  state: ResumeHeaderState = {};

  render() {
    const {
      style,
      title,
      subtitle,
      rightContainer,
      children,
      subtitleStyle,
      titleStyle,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'resumeheader'}
        style={style}
        {...props}
      >
        <View style={styles.content}>
          <View style={styles.leftContainer}>
            <Text
              accessibilityLabel={'resumeheader_text_name'}
              style={[styles.nameText, titleStyle]}
              textBreakStrategy={'simple'}
            >
              {title}
            </Text>
            <Text
              accessibilityLabel={'resumeheader_text_amount'}
              style={[styles.loanText, subtitleStyle]}
            >
              {subtitle}
            </Text>
          </View>
          {rightContainer}
        </View>
        {children}
      </View>
    );
  }
}
