import * as React from 'react';
import {
  Text,
  ViewProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image,
  View,
  Platform,
} from 'react-native';
import {Banner, Button, CardView, Header, Modal, Touchable} from '../ui';
import Font from '../../resources/functions/Font';
import {Colors, CreditLineOffer} from '../../resources/constants';
import {L} from '../../resources/language';
import {Validate} from '../../resources/functions';
import {
  ContentCreditLine,
  PreferencesUserDataModifyPreResponse,
} from '../../api/backend/response/Execute';
import {Amount} from '../../resources/money';
import {
  A,
  AnalyticsEvent,
  AnalyticsLabelsType,
} from '../../resources/analytics/index';
import Config from '../../Config';
import {Log} from '../../resources/log';
import ModalInfoNoEmail from '../email/ModalInfoNoEmail';
import {NavigationProp} from '@react-navigation/native';
import ClassName from '../../resources/analytics/ScreensClass';

const styles = StyleSheet.create({
  smallContentBoldUnderline: {
    color: Colors.white,
    fontSize: 16,
    ...Font({weight: 'Bold'}),
    textDecorationLine: 'underline',
  } as TextStyle,
  smallContentBold: {
    color: Colors.white,
    fontSize: 16,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  title: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  amount: {
    color: Colors.white,
    fontSize: 30,
    textAlign: 'center',
    ...Font({weight: 'Black'}),
  } as TextStyle,
  dateEnd: {
    top: -5,
    color: Colors.white,
    fontSize: 13,
    textAlign: 'center',
    ...Font({weight: 'Bold', style: 'Italic'}),
  } as TextStyle,
  button: {
    backgroundColor: Colors.grey1,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 5,
  } as ViewStyle,
  buttonTitle: {
    ...Font({weight: 'SemiBold'}),
    color: Colors.primary,
    fontSize: 14,
  } as TextStyle,
  buttonImage: {
    tintColor: Colors.primary,
  } as ImageStyle,
  tooltipText: {
    ...Font({weight: 'SemiBold'}),
    marginBottom: 20,
    color: Colors.accentDark,
  } as TextStyle,
  imageModal: {
    alignSelf: 'center',
    width: 250,
    height: 120,
  } as ImageStyle,
  modalText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  modalTextBold: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
  } as TextStyle,
  modalFeed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  } as ViewStyle,
  imageModalIcon: {
    width: 50,
    height: 50,
    marginRight: 20,
  } as ImageStyle,
  modalIconMore: {
    tintColor: Colors.primary,
    marginLeft: 5,
    marginBottom: 5,
    width: Platform.OS === 'android' ? 6 : 1,
    height: Platform.OS === 'android' ? 12 : 7,
  } as ImageStyle,
  rowView: {
    flex: 1,
  } as ViewStyle,
  buttonBottom: {
    marginBottom: 30,
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  headerTitle: {
    color: Colors.accentDark,
    fontSize: 18,
    textAlign: 'center',
  } as TextStyle,
  headerContainer: {
    alignItems: 'center',
  } as ViewStyle,
  warningIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.accentDark,
  } as ImageStyle,
});

export interface BannerInstantCashProps extends ViewProps {
  navigation: NavigationProp<any, any>;
  accessibilityLabel: AnalyticsLabelsType;
  isFocused?: boolean;
  onLoad?: (value: boolean) => void;
  creditLine?: ContentCreditLine;
  user: PreferencesUserDataModifyPreResponse;
  positionText?: string;
  nameRoute: string;
}

export interface BannerInstantCashState {
  isLoading: boolean;
  isModalVisisble: boolean;
  showModalEmail: boolean;
}
const TAG = '[BannerInstantCash]';
export default class BannerInstantCash extends React.Component<
  BannerInstantCashProps,
  BannerInstantCashState
> {
  state: BannerInstantCashState = {
    isLoading: false,
    isModalVisisble: false,
    showModalEmail: false,
  };

  onPress = () => {
    this.bannerTopTrack('select_promotion');
    Log.info(TAG, 'onPress');
    const {user} = this.props;
    if (!user) {
      return;
    }

    const hasEmail = user ? !!user._mail : false;

    const {navigation} = this.props;
    const {creditLine} = this.props;
    if (!creditLine) {
      return;
    }
    let goNextStep = true;
    const creditOffer = Validate.instantCashType(creditLine);
    if (creditOffer) {
      let seedA: 'eat_flargo_pres' | 'eat_urpi_pres' = 'eat_flargo_pres';
      switch (creditOffer.screenName) {
        case CreditLineOffer.ScreenType.StartDisposition.screenName: //disposicion
          seedA = 'eat_flargo_pres';
          AnalyticsEvent.track(A.eat_flargo);
          break;
        case CreditLineOffer.ScreenType.RequestUrpi.screenName:
          seedA = 'eat_urpi_pres';
          AnalyticsEvent.track(A.eat_urpi);
          if (!hasEmail) {
            goNextStep = false;
          }
          break;
        default:
          break;
      }
      if (!goNextStep) {
        this.setState({showModalEmail: true, isModalVisisble: false});
        return;
      }

      navigation.navigate(creditOffer.screenName, {
        creditLine,
        locked: creditOffer.locked,
        seedA,
        user,
      });
      AnalyticsEvent.track(A[seedA]);
    }
  };

  getBannerValues = (creditLine: ContentCreditLine | undefined) => {
    const creditOffer = Validate.instantCashType(creditLine);
    if (!creditOffer || !creditLine) {
      return null;
    }
    const isSuperRate = Config.settings.instantCashSuperRate;

    let textTitleBanner = <Text />;
    let amount = '';
    const buttonTitle = L.bannerinstantcash_buttonlink_title;
    let resumeTitleBanner = '';

    if (creditOffer.code === CreditLineOffer.ScreenType.StartDisposition.code) {
      amount = Amount.format(
        creditLine.avaiCredLAmountWithoutTax,
        creditLine.currencyKey.toString(),
      );
      if (isSuperRate) {
        textTitleBanner = (
          <Text>
            {L.bannerinstantcash_pre_approved_super_rate_part1}
            <Text style={styles.smallContentBold}>
              {L.bannerinstantcash_pre_approved_super_rate_part2}
            </Text>
            {L.bannerinstantcash_pre_approved_super_rate_part3}
            <Text style={styles.smallContentBoldUnderline}>
              {L.bannerinstantcash_pre_approved_super_rate_part4}
            </Text>
            {L.bannerinstantcash_pre_approved_super_rate_part5}
            <Text style={styles.smallContentBold}>
              {L.bannerinstantcash_pre_approved_super_rate_part6}
            </Text>
            {L.bannerinstantcash_pre_approved_super_rate_part7}
          </Text>
        );
        resumeTitleBanner =
          L.bannerinstantcash_pre_approved_super_rate_part1 +
          L.bannerinstantcash_pre_approved_super_rate_part2;
      } else {
        textTitleBanner = (
          <Text>
            {L.bannerinstantcash_pre_approved_part1}
            <Text style={styles.smallContentBold}>
              {L.bannerinstantcash_pre_approved_part2}
            </Text>
            {L.bannerinstantcash_pre_approved_part3}
            <Text style={styles.smallContentBold}>
              {L.bannerinstantcash_pre_approved_part4}
            </Text>
            {L.bannerinstantcash_pre_approved_part5}
          </Text>
        );
        resumeTitleBanner =
          L.bannerinstantcash_pre_approved_part1 +
          L.bannerinstantcash_pre_approved_part2;
      }
    }

    if (creditOffer.code === CreditLineOffer.ScreenType.RequestUrpi.code) {
      amount = Amount.formatWithZero(
        creditLine.capitalAmount,
        creditLine.currencyKey.toString(),
      );
      textTitleBanner = (
        <Text>
          {L.bannerinstantcash_title_urpi_part1}
          <Text style={styles.smallContentBold}>
            {L.bannerinstantcash_title_urpi_part2}
          </Text>
          {L.bannerinstantcash_title_urpi_part3}
        </Text>
      );
      resumeTitleBanner =
        L.bannerinstantcash_title_urpi_part1 +
        L.bannerinstantcash_title_urpi_part2;
    }

    return {
      textTitleBanner,
      amount,
      buttonTitle,
      isSuperRate,
      resumeTitleBanner,
    };
  };

  showModal = () => {
    this.setState({isModalVisisble: true});
    AnalyticsEvent.track(
      A.bannerinstantcash_open_modal,
      L.bannerinstantcash_modal_open_text,
    );
  };
  closeModal = () => {
    this.setState({isModalVisisble: false});
  };

  goToNewAccount = () => {
    const {user} = this.props;
    if (!user) {
      return;
    }

    const hasEmail = user ? !!user._mail : false;
    if (!hasEmail) {
      this.setState({showModalEmail: true, isModalVisisble: false});
      return;
    }
    const {navigation} = this.props;
    this.setState({isModalVisisble: false});
    navigation.navigate('NewAccount');
  };

  closeEmailModal = () => {
    this.setState({showModalEmail: false});
  };

  bannerTopTrack = (nameEvent: string) => {
    const {creditLine, positionText} = this.props;
    const {nameRoute} = this.props;
    const creditOffer = Validate.instantCashType(creditLine);
    const bannerValues = this.getBannerValues(creditLine);
    let nextLabelName = creditOffer?.screenName;
    if (nextLabelName !== undefined) {
      const param = {
        promotion_id: `${creditOffer?.code}`,
        promotion_name: `${bannerValues?.resumeTitleBanner}`,
        creative_name: `${ClassName[nextLabelName]}`,
        creative_slot: `${positionText}`,
        location_id: `${ClassName[nameRoute]}`,
      };
      AnalyticsEvent.trackEvent(nameEvent, param);
    }
  };

  componentDidMount() {
    this.bannerTopTrack('view_promotion');
  }

  render() {
    const {isModalVisisble, showModalEmail} = this.state;
    const {style, navigation, user, creditLine, positionText, ...props} =
      this.props;
    const bannerValues = this.getBannerValues(creditLine);
    if (!bannerValues) {
      return null;
    }

    return (
      <>
        <Banner
          style={style}
          onPress={this.onPress}
          content={
            <>
              <Text
                accessibilityLabel={'bannerinstantcash_title'}
                style={styles.title}>
                {bannerValues.textTitleBanner}
              </Text>

              <Text
                accessibilityLabel={'bannerinstantcash_amount'}
                style={styles.amount}>
                {bannerValues.amount}
              </Text>
              {bannerValues.isSuperRate && (
                <Text style={styles.dateEnd}>
                  {L.bannerinstantcash_pre_approved_super_rate_date}
                </Text>
              )}
            </>
          }
          buttonLinkProps={{
            accessibilityLabel: 'bannerinstantcash_buttonlink_title',
            title: bannerValues.buttonTitle,
            onPress: this.onPress,
            style: styles.button,
            titleStyle: styles.buttonTitle,
            imageStyle: styles.buttonImage,
          }}
          {...props}
        />
        <Touchable
          accessibilityLabel={'bannerinstantcash_btn_open_modal'}
          analyticsParams={L.bannerinstantcash_modal_open_text}
          onPress={this.showModal}>
          <Text style={styles.tooltipText}>
            {L.bannerinstantcash_modal_open_text}{' '}
            <Image
              style={styles.warningIcon}
              source={require('../../assets/images/help-icon.png')}
            />
          </Text>
        </Touchable>
        {!!user && showModalEmail && (
          <ModalInfoNoEmail
            accessibilityLabel={'newaccount_flashmessage_modalinfo_noemail'}
            navigation={navigation}
            user={user}
            onClose={this.closeEmailModal}
          />
        )}
        {isModalVisisble && (
          <Modal onClose={this.closeModal}>
            <CardView padding>
              <Image
                style={styles.imageModal}
                source={require('../../assets/images/adn-woman-pointing-large.png')}
              />
              <View style={styles.headerContainer}>
                <Header
                  accessibilityLabel={'bannerinstantcash_modal_header'}
                  style={styles.header}
                  titleStyle={styles.headerTitle}
                  title={L.bannerinstantcash_modal_title}
                />
              </View>
              <View style={styles.modalFeed}>
                <View>
                  <Image
                    style={styles.imageModalIcon}
                    source={require('../../assets/images/circle-medal.png')}
                  />
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text1}
                  </Text>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-money-part.png')}
                />
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text2}
                  </Text>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-coins-cellphone.png')}
                />
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text3}
                  </Text>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-check.png')}
                />
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text4}
                  </Text>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-speed.png')}
                />
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text5}
                  </Text>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-give.png')}
                />
                <View style={styles.rowView}>
                  <Touchable
                    accessibilityLabel={
                      'bannerinstantcash_modal_new_account_openhere'
                    }
                    analyticsParams={L.bannerinstantcash_modal_text6_part2}
                    onPress={this.goToNewAccount}>
                    <Text style={styles.modalText}>
                      {L.bannerinstantcash_modal_text6_part1}
                      <Text style={styles.modalTextBold}>
                        {L.bannerinstantcash_modal_text6_part2}
                        <Image
                          style={styles.modalIconMore}
                          source={require('../../assets/images/arrow-icon.png')}
                        />
                      </Text>
                    </Text>
                  </Touchable>
                </View>
              </View>
              <View style={styles.modalFeed}>
                <Image
                  style={styles.imageModalIcon}
                  source={require('../../assets/images/circle-atm.png')}
                />
                <View style={styles.rowView}>
                  <Text style={styles.modalText}>
                    {L.bannerinstantcash_modal_text7}
                  </Text>
                </View>
              </View>

              <Button
                accessibilityLabel={'bannerinstantcash_modal_btn_ok'}
                style={styles.buttonBottom}
                typeColor={'accentDark'}
                title={L.bannerinstantcash_modal_btn_ok}
                onPress={this.closeModal}
              />
            </CardView>
          </Modal>
        )}
      </>
    );
  }
}
