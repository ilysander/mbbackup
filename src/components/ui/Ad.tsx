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

const styles = StyleSheet.create({
  messageText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 13,
  } as TextStyle,
  container: {
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'visible',
    alignItems: 'center',
    backgroundColor: Colors.accentDark,
    paddingVertical: 4,
    borderTopRightRadius: 16,
  } as ViewStyle,
  imageIcon: {
    height: 30,
    width: 30,
    opacity: 0.5,
    marginLeft: 18,
    tintColor: Colors.white,
  } as ImageStyle,
  content: {
    marginVertical: 4,
    marginLeft: 15,
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
  arrowButton: {
    marginRight: 15,
  } as ViewStyle,
  closeButton: {
    position: 'absolute',
    left: 0,
    top: -20,
    width: 34,
    height: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.accentDark,
    zIndex: 1,
  } as ViewStyle,
  closeButtonImage: {
    alignSelf: 'center',
    width: 10,
    height: 10,
    tintColor: Colors.white,
    top: 10,
  } as ImageStyle,
  arrowButtonImage: {
    width: 6,
    height: 12,
    tintColor: Colors.white,
  } as ImageStyle,
});

export interface AdProps extends TouchableProps {
  onClose?: () => void;
  imageSource?: ImageSourcePropType;
  content: string | React.ReactNode | React.ReactNode[];
  positionText?: string;
  textTitleBanner?: string;
  creditLine?: any;
  touchSmall?: () => void;
}
export interface AdState {}
class Ad extends React.Component<AdProps, AdState> {
  state: AdState = {};

  componentDidMount() {
    setTimeout(() => {
      if (this.props.touchSmall) this.props.touchSmall();
    }, 2000);
  }

  render() {
    const {
      onClose,
      accessibilityLabel,
      imageSource,
      content,
      style,
      ...props
    } = this.props;

    return [
      typeof onClose === 'function' && (
        <ButtonImage
          key={'close'}
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel={'ad_close'}
          imageSource={require('../../assets/images/icon-close.png')}
          imageStyle={styles.closeButtonImage}
          hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
        />
      ),
      <Touchable
        key={'ad'}
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.95}
        {...props}
      >
        {!!imageSource && (
          <Image
            resizeMode={'contain'}
            style={styles.imageIcon}
            accessibilityLabel={'ad_image_icon'}
            source={imageSource}
          />
        )}
        <View style={styles.content}>
          {typeof content === 'string' ? (
            <Text accessibilityLabel={'ad_message'} style={styles.messageText}>
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
        <ButtonImage
          style={styles.arrowButton}
          accessibilityLabel={'ad_arrow'}
          imageSource={require('../../assets/images/arrow-icon.png')}
          imageStyle={styles.arrowButtonImage}
          hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
        />
      </Touchable>,
    ];
  }
}

export default Ad;
