import * as React from 'react';
import { Text, TextStyle, View, ViewProps, StyleSheet } from 'react-native';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  title: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
  } as TextStyle,
  subtitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
    marginTop: -3,
  } as TextStyle,
});

export interface noCommissionLabelProps extends ViewProps {
  title?: string;
  subtitle?: string;
}

export interface noCommissionLabelState {}

export default class noCommissionLabel extends React.PureComponent<
  noCommissionLabelProps,
  noCommissionLabelState
> {
  render() {
    const { title, subtitle } = this.props;
    return (
      <View>
        <Text accessibilityLabel={'titlebox_text_title'} style={styles.title}>
          {title}
        </Text>
        <Text
          accessibilityLabel={'titlebox_text_subtitle'}
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      </View>
    );
  }
}
