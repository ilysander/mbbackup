import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Platform,
  Image,
} from 'react-native';
import { L } from '../../resources/language/index';
import { Colors } from '../../resources/constants/index';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  textBannerTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey1,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  textBannerHigh: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey1,
    fontSize: 26,
  } as TextStyle,
  textBanner: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey1,
    textAlign: 'center',
    fontSize: 14,
  } as TextStyle,
  textBannerPlus: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey1,
    fontSize: 14,
  } as TextStyle,
  bannerBorder: {
    marginTop: 25,
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 3, width: 0 },
    borderRadius: 12,
    elevation: 4,
    overflow: 'visible',
  } as ViewStyle,
  bannerContent: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  } as ViewStyle,
  bannerAskWidth: {
    maxWidth: 200,
  } as ViewStyle,
  bannerContentRow: {
    flexDirection: 'row',
  } as ViewStyle,
  bannerImageContainerLeft: {
    width: 22,
    alignItems: 'flex-end',
    justifyContent: 'center',
  } as ViewStyle,
  bannerImageContainerRight: {
    width: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
  } as ViewStyle,
  bannerImage: {
    width: 20,
    height: 28,
    tintColor: Colors.shine,
  } as ImageStyle,
  bannerDescriptionPadding: {
    paddingHorizontal: 10,
  } as ViewStyle,
});
export default class Banner extends React.Component {
  render() {
    return (
      <View accessibilityLabel={'banner'} style={styles.bannerBorder}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerAskWidth}>
            <Text
              accessibilityLabel={'banner_message'}
              style={styles.textBannerTitle}
            >
              {L.dpfopencalculatorscreen_banner_title_ask}
            </Text>
          </View>
          <View style={styles.bannerContentRow}>
            <View style={styles.bannerImageContainerLeft}>
              <Image
                accessibilityLabel={'banner_image_left'}
                style={styles.bannerImage}
                source={require('../../assets/images/highlight-linear-left.png')}
              />
            </View>
            <Text style={[styles.textBannerHigh]}>
              {L.dpfopencalculatorscreen_banner_title}
            </Text>
            <View style={styles.bannerImageContainerRight}>
              <Image
                accessibilityLabel={'banner_image_right'}
                style={styles.bannerImage}
                source={require('../../assets/images/highlight-linear-right.png')}
              />
            </View>
          </View>
          <View style={styles.bannerDescriptionPadding}>
            <Text style={styles.textBanner}>
              {L.dpfopencalculatorscreen_banner_description}
            </Text>
          </View>
          <Text style={styles.textBannerPlus}>
            {L.dpfopencalculatorscreen_banner_plus}
          </Text>
        </View>
      </View>
    );
  }
}
