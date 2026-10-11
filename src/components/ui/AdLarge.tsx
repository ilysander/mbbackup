import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  Image,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import ButtonImage from './ButtonImage';
import Touchable, { TouchableProps } from './Touchable';
import ButtonExternal, { ButtonExternalProps } from './ButtonExternal';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  messageText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 15,
  } as TextStyle,
  container: {
    backgroundColor: Colors.accentDark,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 16,
  } as ViewStyle,
  imageIcon: {
    height: 72,
    width: 72,
    opacity: 0.5,
    marginTop: 25,
    tintColor: Colors.white,
    alignSelf: 'center',
  } as ImageStyle,
  content: {
    padding: 20,
    paddingBottom: 15,
    marginTop: 36,
  } as ViewStyle,
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  } as ViewStyle,
  closeButtonImage: {
    width: 17.5,
    height: 10,
    tintColor: Colors.white,
  } as ImageStyle,
  buttonLink: {
    paddingBottom: 20,
  } as ViewStyle,
  buttonLinkTitle: {
    color: Colors.white,
  } as TextStyle,
  buttonLinkImage: {
    tintColor: Colors.white,
  } as ImageStyle,
  largeBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    tintColor: Colors.shine,
    opacity: 0.2,
  } as ImageStyle,
  buttonExternal: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 60,
  } as ViewStyle,
  buttonExternalImage: {
    tintColor: Colors.grey1,
    width: 6,
    height: 12,
  } as ImageStyle,
  buttonExternalText: {
    color: Colors.grey1,
    fontSize: 16,
  } as TextStyle,
});

export interface AdLargeProps extends TouchableProps {
  onClose?: () => void;
  imageSource?: ImageSourcePropType;
  content: string | React.ReactNode | React.ReactNode[];
  buttonExternalProps?: ButtonExternalProps;
  positionText?: string;
  textTitleBanner?: string;
  creditLine?: any;
  touchLarge?: () => void;
}

export interface AdLargeState {}

class AdLarge extends React.Component<AdLargeProps, AdLargeState> {
  state: AdLargeState = {};

  componentDidMount() {
    if (this.props.touchLarge) this.props.touchLarge();
  }

  render() {
    const {
      onClose,
      accessibilityLabel,
      imageSource,
      content,
      buttonExternalProps,
      style,
      ...props
    } = this.props;

    return (
      <Touchable
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.95}
        onPress={buttonExternalProps ? buttonExternalProps.onPress : undefined}
        {...props}
      >
        <Image
          resizeMode={'repeat'}
          style={styles.largeBackground}
          source={require('../../assets/images/bg-confite.png')}
        />

        {typeof onClose === 'function' && (
          <ButtonImage
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel={'adlarge_close'}
            imageSource={require('../../assets/images/icon-collapse-big.png')}
            imageStyle={styles.closeButtonImage}
            hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
          />
        )}
        <View style={styles.content}>
          {typeof content === 'string' ? (
            <Text
              accessibilityLabel={'adlarge_message'}
              style={styles.messageText}
            >
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
        <ButtonExternal
          {...buttonExternalProps}
          accessibilityLabel={'adlarge_buttonexternal_loan'}
          imageSource={require('../../assets/images/arrow-icon.png')}
          imagePosition={'right'}
          style={[styles.buttonExternal]}
          imageStyle={styles.buttonExternalImage}
          titleStyle={styles.buttonExternalText}
          title={L.adlarge_buttonexternal_title}
        />
      </Touchable>
    );
  }
}

export default AdLarge;
