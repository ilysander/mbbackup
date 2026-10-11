import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  Image,
  ViewProps,
  ViewStyle,
  ImageStyle,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import ButtonLink, { ButtonLinkProps } from './ButtonLink';
import Touchable from './Touchable';
import { AnalyticsLabelsType } from '../../resources/analytics';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    backgroundColor: Colors.accentDark,
    borderColor: Colors.accentDark,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
  } as ViewStyle,
  shadow: {
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 3, width: 0 },
    borderRadius: 12,
    elevation: 4,
    overflow: 'visible',
  } as ViewStyle,
  messageText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    textAlign: 'left',
    color: Colors.white,
  } as TextStyle,
  icon: {
    width: 60,
    height: 60,
    tintColor: Colors.white,
    opacity: 0.5,
  } as ImageStyle,
  content: {
    flex: 1,
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonLink: {
    paddingVertical: 15,
    paddingLeft: 0,
    width: '100%',
    justifyContent: 'flex-start',
  } as ViewStyle,
  buttonLinkTitle: {
    color: Colors.white,
  } as TextStyle,
  buttonLinkImage: {
    tintColor: Colors.white,
  } as ImageStyle,
  imageBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    tintColor: Colors.white,
    opacity: 0.09,
  } as ImageStyle,
  bannerContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
});

export interface BannerProps extends ViewProps {
  accessibilityLabel: AnalyticsLabelsType;
  content: string | React.ReactNode | React.ReactNode[];
  buttonLinkProps?: ButtonLinkProps;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  banner?: ViewStyle;
  noButtonLinkSource?: boolean;
  textContainer?: ViewStyle;
}

export interface BannerState { }

export default class Banner extends React.Component<BannerProps, BannerState> {
  state: BannerState = {};

  render() {
    const {
      buttonLinkProps,
      imageSource,
      style,
      content,
      onPress,
      accessibilityLabel,
      banner,
      noButtonLinkSource,
      textContainer,
      ...props
    } = this.props;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={[styles.container, styles.shadow, style]}
        {...props}
      >
        <Image
          resizeMode={'cover'}
          style={styles.imageBackground}
          source={require('../../assets/images/bg-confite-large.png')}
        />

        <View style={[styles.bannerContainer, banner]}>
          {!!imageSource && <Image style={styles.icon} source={imageSource} />}
          <View style={[styles.content, textContainer]}>
            {typeof content === 'string' ? (
              <Text
                accessibilityLabel={'banner_message'}
                style={styles.messageText}
              >
                {content}
              </Text>
            ) : (
              content
            )}
            <ButtonLink
              accessibilityLabel={'loanresume_buttonlink_loan'}
              accent={'secondary'}
              imageSource={
                !noButtonLinkSource &&
                require('../../assets/images/arrow-icon.png')
              }
              imagePosition={'right'}
              titleStyle={styles.buttonLinkTitle}
              style={styles.buttonLink}
              imageStyle={styles.buttonLinkImage}
              {...buttonLinkProps}
            />
          </View>
        </View>
      </Touchable>
    );
  }
}
