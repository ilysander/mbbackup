import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
  Image,
  View,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable from './Touchable';
import { AnalyticsLabelsType } from '../../resources/analytics';

const styles = StyleSheet.create({
  arrow: {
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  iconDocument: {
    resizeMode: 'stretch',
    width: 24,
    height: 18,
    tintColor: Colors.grey4,
  } as ImageStyle,
  titleDocument: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
    marginLeft: 8,
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  registerModeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  } as ViewStyle,
  registerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  registerText: {
    flex: 5,
    justifyContent: 'center',
  } as ViewStyle,
  registerArrow: {
    flex: 0.5,
    justifyContent: 'center',
  } as ViewStyle,
});

export interface RegisterModeButtonProps {
  title: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel: AnalyticsLabelsType;
}

export interface RegisterModeButtonState { }

export default class RegisterModeButton extends React.Component<
  RegisterModeButtonProps,
  RegisterModeButtonState
> {
  render() {
    const {
      title,
      imageSource,
      style,
      onPress,
      accessibilityLabel,
    } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={style}
        analyticsParams={title ? title : undefined}
      >
        <View style={styles.registerImage}>
          <Image
            accessibilityLabel={'registermodebutton_image'}
            style={[styles.iconDocument]}
            source={imageSource}
          />
        </View>
        <View style={styles.registerText}>
          <Text
            style={styles.titleDocument}
            accessibilityLabel={'registermodebutton_image_text'}
          >
            {title}
          </Text>
        </View>
        <View style={styles.registerArrow}>
          <Image
            accessibilityLabel={'registermodebutton_image_arrow'}
            style={[styles.arrow]}
            source={require('../../assets/images/arrow-icon.png')}
          />
        </View>
      </Touchable>
    );
  }
}
