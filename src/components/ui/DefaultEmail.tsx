import * as React from 'react';
import {
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  bodyItem: {
    color: Colors.grey6,
    textAlign: 'left',
    ...Font(),
  } as ViewStyle,
  emailComponent: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as TextStyle,
  bodyItemBold: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    justifyContent: 'center',
    alignItems: 'center',
  } as TextStyle,
});

export interface DefaultEmailProps extends ViewProps {
  email?: string;
  message: string;
}

export interface DefaultEmailState {}

export default class DefaultEmail extends React.PureComponent<
  DefaultEmailProps,
  DefaultEmailState
> {
  render() {
    const { email, message } = this.props;
    return (
      <View style={styles.emailComponent}>
        <Text accessibilityLabel={`channel_label`} style={styles.bodyItem}>
          {message}
        </Text>
        {email && (
          <Text
            accessibilityLabel={`channel_label`}
            style={styles.bodyItemBold}
          >
            {email}
          </Text>
        )}
      </View>
    );
  }
}
