import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
    marginTop: 3,
  } as TextStyle,
  image: {
    alignSelf: 'center',
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: Colors.primaryLight,
  } as ImageStyle,
});

export interface ResumeBoxStatusProps extends ViewProps {
  text: string;
  accessibilityLabel: string;
  imageSource: ImageSourcePropType;
}

export interface ResumeBoxStatusState {}

export default class ResumeBoxStatus extends React.Component<
  ResumeBoxStatusProps,
  ResumeBoxStatusState
> {
  state: ResumeBoxStatusState = {};

  render() {
    const { text, imageSource, accessibilityLabel } = this.props;

    return (
      <View accessibilityLabel={accessibilityLabel} style={[styles.item]}>
        <Image style={styles.image} source={imageSource} />
        <Text
          accessibilityLabel={'resumeboxstatus_text_messagestatus'}
          style={[styles.text]}
        >
          {text}
        </Text>
      </View>
    );
  }
}
