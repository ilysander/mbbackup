import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { A, AnalyticsEvent } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import Touchable from '../ui/Touchable';

const styles = StyleSheet.create({
  back: {
    width: 21,
    height: 21,
    tintColor: Colors.grey4,
    resizeMode: 'contain',
  } as ImageStyle,
  container: {
    height: 50,
    width: 50,
    paddingLeft: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1,
  } as ViewStyle,
});

export interface BackIconProps {
  onPress?: () => void;
  style?: StyleProp<ImageStyle>;
}

export interface BackIconState {}

export default class BackIcon extends React.Component<
  BackIconProps,
  BackIconState
> {
  onPress = () => {
    const { onPress } = this.props;
    AnalyticsEvent.track(A.backicon);

    typeof onPress === 'function' && onPress();
  };

  render() {
    const { style, ...props } = this.props;
    return (
      <Touchable
        accessibilityLabel={'backicon'}
        style={styles.container}
        onPress={this.onPress}
      >
        <Image
          style={[styles.back, style]}
          source={require('../../assets/images/back-icon.png')}
          {...props}
        />
      </Touchable>
    );
  }
}
