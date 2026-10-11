import * as React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  ImageStyle,
  ViewStyle,
  TextStyle,
  ViewProps,
} from 'react-native';
import { CardView } from '../ui';
import Font from '../../resources/functions/Font';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  icon: {
    width: 46,
    marginRight: 25,
    tintColor: Colors.accentDark,
    height: 46,
  } as ImageStyle,
  descriptionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.accentDark,
  } as ViewStyle,
  descriptionText: {
    flex: 1,
    ...Font({ weight: 'Medium' }),
    textAlign: 'left',
    color: Colors.accentDark,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,
});

export interface CallMessageProps extends ViewProps {}
export interface CallMessageState {}

export default class CallMessage extends React.Component<
  CallMessageProps,
  CallMessageState
> {
  render() {
    const { style } = this.props;
    return (
      <CardView padding style={[styles.descriptionContainer, style]}>
        <Image
          accessibilityLabel={'callmessage_icon'}
          style={styles.icon}
          source={require('../../assets/images/icon-headset.png')}
        />
        <Text
          accessibilityLabel={'callmessage_text'}
          style={styles.descriptionText}
        >
          {L.callmessage_text}
        </Text>
      </CardView>
    );
  }
}
