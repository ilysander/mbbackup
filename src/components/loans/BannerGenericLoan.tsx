import * as React from 'react';
import {
  Text,
  ViewProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  View,
  Image,
} from 'react-native';
import { Banner } from '../ui';
import Font from '../../resources/functions/Font';
import { Colors, CreditLineOffer } from '../../resources/constants';
import { L } from '../../resources/language';
import { Validate } from '../../resources/functions';
import {
  ContentCreditLine,
  PreferencesUserDataModifyPreResponse,
} from '../../api/backend/response/Execute';
import { Amount } from '../../resources/money';
import { AnalyticsLabelsType } from '../../resources/analytics/index';
import ModalInfoNoEmail from '../email/ModalInfoNoEmail';
import { Log } from '../../resources/log';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  smallContentBoldUnderline: {
    color: Colors.white,
    fontSize: 16,
    ...Font({ weight: 'Bold' }),
    textDecorationLine: 'underline',
  } as TextStyle,
  smallContentBold: {
    color: Colors.white,
    fontSize: 16,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  title: {
    color: Colors.grey6,
    fontSize: 20,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  subtitle: {
    color: Colors.grey5,
    fontSize: 14,
    textAlign: 'center',
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  amount: {
    color: Colors.accentDark,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    lineHeight: 41,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  dateEnd: {
    top: -5,
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
    ...Font({ weight: 'Bold', style: 'Italic' }),
  } as TextStyle,
  button: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  } as ViewStyle,
  buttonTitle: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 13,
  } as TextStyle,
  buttonTitleHere: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 13,
  } as TextStyle,
  buttonImage: {
    tintColor: Colors.white,
  } as ImageStyle,
  topImage: {
    height: 20,
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  } as ImageStyle,
  bannerContainer: {
    paddingBottom: 0,
    paddingTop: 0,
  } as ViewStyle,
  bannerButtonTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  } as ViewStyle,
  arrowImage: {
    width: 6,
    height: 12,
    tintColor: Colors.white,
    marginLeft: 6,
  } as ImageStyle,
  textBannerCont: {
    paddingHorizontal: 0,
  } as ViewStyle,
});

export interface BannerGenericLoanProps extends ViewProps {
  navigation: NavigationProp<any, any>;
  accessibilityLabel: AnalyticsLabelsType;
  isFocused?: boolean;
  onLoad?: (value: boolean) => void;
  creditLine?: ContentCreditLine;
  hasManyAmountOption: boolean;
  user: PreferencesUserDataModifyPreResponse;
}

export interface BannerGenericLoanState {
  isLoading: boolean;
  showModalEmail: boolean;
}
const TAG = '[BannerGenericLoan]';
export default class BannerGenericLoan extends React.Component<
  BannerGenericLoanProps,
  BannerGenericLoanState
> {
  state: BannerGenericLoanState = {
    isLoading: false,
    showModalEmail: false,
  };

  onPress = () => {
    Log.info(TAG, 'onPress');
    const { user } = this.props;
    if (!user) {
      return;
    }

    const hasEmail = user ? !!user._mail : false;

    const { navigation, creditLine } = this.props;
    if (!creditLine) {
      return;
    }
    const creditOffer = Validate.instantCashType(creditLine);
    if (creditOffer) {
      navigation.navigate(creditOffer.screenName, {
        creditLine,
        locked: creditOffer.locked,
        hasEmail,
        user,
      });
    }
  };
  closeEmailModal = () => {
    this.setState({ showModalEmail: false });
  };

  getBannerValues = (creditLine: ContentCreditLine | undefined) => {
    const { hasManyAmountOption } = this.props;
    const genericLoanTitle = L.bannergenericloan_banner_title;
    const genericLoanSubtitle = hasManyAmountOption
      ? L.bannergenericloan_banner_subtitle
      : L.bannergenericloan_banner_subtitle_one_option;
    const creditOffer = Validate.instantCashType(creditLine);
    if (!creditOffer || !creditLine) {
      return null;
    }

    let amount = '';
    const buttonTitle = (
      <View style={styles.bannerButtonTitle}>
        <Text style={styles.buttonTitle}>
          {L.bannergenericloan_btn_subtitle_part1}
          <Text style={styles.buttonTitleHere}>
            {L.bannergenericloan_btn_subtitle_part2}
          </Text>
        </Text>
        <Image
          accessibilityLabel={'buttonexternal_image'}
          style={styles.arrowImage}
          source={require('../../assets/images/arrow-icon.png')}
          resizeMode={'contain'}
        />
      </View>
    );

    if (creditOffer.code === CreditLineOffer.ScreenType.StartNewLoan.code) {
      amount = Amount.formatWithZero(
        creditLine.capitalAmount,
        creditLine.currencyKey.toString()
      );
    }

    return {
      amount,
      buttonTitle,
      genericLoanTitle,
      genericLoanSubtitle,
    };
  };

  render() {
    const { style, navigation, creditLine, user, ...props } = this.props;
    const { showModalEmail } = this.state;
    const bannerValues = this.getBannerValues(creditLine);
    if (!bannerValues) {
      return null;
    }
    return (
      <Banner
        style={style}
        banner={styles.bannerContainer}
        noButtonLinkSource={true}
        textContainer={styles.textBannerCont}
        onPress={this.onPress}
        content={
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              width: '100%',
            }}
          >
            {showModalEmail && !!user && (
              <ModalInfoNoEmail
                accessibilityLabel={'bannergenericloan_modalinfo_noemail'}
                navigation={navigation}
                onClose={this.closeEmailModal}
                user={user}
              />
            )}
            <Image
              resizeMode={'cover'}
              style={styles.topImage}
              source={require('../../assets/images/banderolas-prestamo-digital.png')}
            />
            <Text
              accessibilityLabel={'bannergenericloan_title'}
              style={styles.title}
            >
              {bannerValues.genericLoanTitle}
            </Text>

            <Text
              accessibilityLabel={'bannergenericloan_subtitle'}
              style={styles.subtitle}
            >
              {bannerValues.genericLoanSubtitle}
            </Text>

            <Text
              accessibilityLabel={'bannergenericloan_amount'}
              style={styles.amount}
            >
              {bannerValues.amount}
            </Text>
          </View>
        }
        buttonLinkProps={{
          accessibilityLabel: 'bannergenericloan_buttonlink_title',
          titleComponent: bannerValues.buttonTitle,
          onPress: this.onPress,
          style: styles.button,
          titleStyle: styles.buttonTitle,
          imageStyle: styles.buttonImage,
        }}
        {...props}
      />
    );
  }
}
