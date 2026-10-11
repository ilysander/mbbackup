import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Features from '../../resources/remote/Features';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'Medium' }),
    color: Colors.accentDark,
    fontSize: 13,
    textAlign: 'center',
  } as TextStyle,
});

export interface AlertMessageChangePhoneProps {
  style?: StyleProp<ViewStyle>;
}

export interface AlertMessageChangePhoneState {}

export default class AlertMessageChangePhone extends React.Component<
  AlertMessageChangePhoneProps,
  AlertMessageChangePhoneState
> {
  render() {
    const { style } = this.props;
    return (
      !Features.isAllowedTo('ChangePhone') && (
        <View
          accessibilityLabel={'alertmessage'}
          style={[styles.container, style]}
        >
          <Text
            style={styles.text}
            accessibilityLabel={'alertmessage_text_message'}
          >
            {L.alertmessagechangephone_text_title}
          </Text>
        </View>
      )
    );
  }
}
