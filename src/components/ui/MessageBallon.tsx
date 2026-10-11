import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageStyle,
  StyleProp,
  ViewProps,
  ImageSourcePropType,
} from 'react-native';

import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import Svg, { Polygon } from 'react-native-svg';

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 3 },
    shadowColor: Colors.shadow,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  message: {
    ...Font({ weight: 'Medium' }),
    color: Colors.secondary,
    fontSize: 13,
  } as TextStyle,
  cloud: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    marginBottom: -2.2,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  icon: {
    width: 40,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  } as ImageStyle,
  contImage: {
    flex: 3.5,
  } as ViewStyle,
  contText: {
    flex: 10,
  } as ViewStyle,
});

export interface MessageBallonProps extends ViewProps {
  message: string | React.ReactNode;
  imageStyle?: StyleProp<ImageStyle>;
  imageSource?: ImageSourcePropType;
}

export interface MessageBallonState {}
export default class MessageBallon extends React.Component<
  MessageBallonProps,
  MessageBallonState
> {
  render() {
    const { message, imageStyle, imageSource } = this.props;

    return (
      <View>
        <View style={[styles.cloud, styles.shadow]}>
          {imageSource && (
            <View style={styles.contImage}>
              <Image source={imageSource} style={imageStyle} />
            </View>
          )}
          <View style={styles.contText}>
            <Text style={[styles.message]}>{message}</Text>
          </View>
        </View>
        <View style={[styles.shadow]}>
          <Svg height="16" width="100%">
            <Polygon
              points="15,1 41,1 27.5,16"
              fill={Colors.secondary}
              strokeWidth="0"
            />
            <Polygon
              points="16,0 40,0 27.5,14"
              fill={Colors.white}
              strokeWidth="0"
            />
          </Svg>
        </View>
      </View>
    );
  }
}
