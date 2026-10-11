import * as React from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Animated,
  LayoutRectangle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import CreditLineOffer from '../../resources/constants/CreditLineOffer';
import AdLarge from '../ui/AdLarge';
import AdView from '../ui/Ad';
import Touchable from '../ui/Touchable';
import AdService from '../../resources/persistence/AdService';
import Validate from '../../resources/functions/Validate';
import Font from '../../resources/functions/Font';
import Log from '../../resources/log/Log';
import {AdObj} from '../../resources/persistence/models';
import {Amount} from '../../resources/money';
import {L} from '../../resources/language';
import {
  ContentCreditLine,
  PreferencesUserDataModifyPreResponse,
} from '../../api/backend/response/Execute';
import Size from '../../resources/dimensions/Size';
import Config from '../../Config';
import {CommonActions, NavigationProp} from '@react-navigation/native';
import {
  A,
  AnalyticsEvent,
  ScreensLabels as Label,
} from '../../resources/analytics';
import ClassName from '../../resources/analytics/ScreensClass';

const styles = StyleSheet.create({
  largeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  } as ViewStyle,
  overlay: {
    flex: 1,
    backgroundColor: Colors.grey1,
    opacity: 0.7,
  } as ViewStyle,
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Size.getHeight(),
  } as ViewStyle,
  smallContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  } as ViewStyle,
  adLarge: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  } as ViewStyle,
  adSmall: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  } as ViewStyle,
  adLargeContent: {
    alignItems: 'center',
  } as ViewStyle,
  largeTypeUnderLine: {
    fontSize: 22,
    lineHeight: 25,
    color: Colors.white,
    ...Font({weight: 'Bold'}),
    textDecorationLine: 'underline',
  } as TextStyle,
  largeTypeLigth: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 26,
    color: Colors.white,
    ...Font(),
  } as TextStyle,
  largeTypeLigthHeight: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 30,
    color: Colors.white,
    ...Font(),
  } as TextStyle,
  largeType: {
    fontSize: 22,
    lineHeight: 26,
    color: Colors.white,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  largeTypeFoot: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 35,
    color: Colors.white,
    marginBottom: 5,
    ...Font(),
  } as TextStyle,
  largeTypeParr: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 30,
    color: Colors.white,
    ...Font(),
  } as TextStyle,
  largeTypeCenter: {
    fontSize: 22,
    lineHeight: 26,
    color: Colors.white,
    marginTop: 29,
    marginBottom: 5,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  largeTypeAmount: {
    fontSize: 28,
    color: Colors.white,
    lineHeight: 45,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  largeAmount: {
    fontSize: 32,
    color: Colors.white,
    ...Font({weight: 'Black'}),
  } as TextStyle,
  smallContent: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.white,
    ...Font({weight: 'Medium'}),
  } as TextStyle,
  smallContentBold: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.white,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  smallContentLight: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.white,
  } as TextStyle,
  smallContentBoldUnderline: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.white,
    ...Font({weight: 'Bold'}),
    textDecorationLine: 'underline',
  } as TextStyle,
  textAmount: {
    fontSize: 17,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  largeAmountContainer: {
    marginTop: 10,
    alignItems: 'center',
  } as ViewStyle,
  dateEnd: {
    top: -10,
    color: Colors.white,
    fontSize: 15,
    textAlign: 'center',
    ...Font({weight: 'Bold', style: 'Italic'}),
  } as TextStyle,
  adContentText: {
    textAlign: 'center',
  } as TextStyle,
});

export interface AdProps extends ViewProps {
  navigation: NavigationProp<any, any>;
  onNeedEmail?: () => void;
  isLoading?: boolean;
  user: PreferencesUserDataModifyPreResponse;
  nameRoute: string;
}
export interface AdState {
  showLargeAnim: Animated.Value;
  showSmallAnim: Animated.Value;
  creditLine?: ContentCreditLine;

  /**
   * este estado sirve para evitar que se vuelva a mostrar el anuncio cuando el usuario lo cierra
   * hasta la proxima vez que inicie sesión
   */
  canShow: boolean;
  isResized: boolean;
  targetLayout?: LayoutRectangle;
  oneChoice: boolean;
}
const TAG = '[Ad]';
class Ad extends React.Component<AdProps, AdState> {
  state: AdState = {
    showLargeAnim: new Animated.Value(0),
    showSmallAnim: new Animated.Value(0),
    canShow: true,
    isResized: false,
    oneChoice: false,
  };

  animationLarge?: Animated.CompositeAnimation;
  animationSmall?: Animated.CompositeAnimation;
  timeoutResize!: NodeJS.Timeout;

  close = async () => {
    const {creditLine} = this.state;
    if (!creditLine) {
      return;
    }
    try {
      const id = AdObj.getIdByCreditLine(creditLine);
      const ad = await AdService.findOneAd(id);
      if (ad) {
        AdService.adCount(ad);
        // AppStorage.write(() => {
        //   ad.count();
        // });
      }
    } catch (e) {
      Log.warn(TAG, 'close', e);
    }
    this.hide();
    this.setState({canShow: false});
  };

  hide = () => {
    this.animationLarge && this.animationLarge.stop();
    this.animationLarge = Animated.parallel([
      Animated.spring(this.state.showSmallAnim, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.showLargeAnim, {
        toValue: 0,
        useNativeDriver: false,
      }),
    ]);
    this.animationLarge.start(() => {
      this.setState({creditLine: undefined});
    });
  };

  resize = () => {
    this.animationSmall && this.animationSmall.stop();
    this.animationSmall = Animated.parallel([
      Animated.spring(this.state.showLargeAnim, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.showSmallAnim, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]);
    this.animationSmall.start(() => {
      this.setState({isResized: true});
    });
  };

  startTimeoutResize = () => {
    this.timeoutResize && clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.resize();
    }, 4 * 1000);
  };

  oneChoice = async (oneChoice: boolean) => {
    this.setState({oneChoice});
  };

  show = async (creditLine: ContentCreditLine) => {
    const {isResized} = this.state;
    let show = false;
    try {
      const initialAd = AdObj.initByCreditLine(creditLine);
      let ad = await AdService.createOrUpdate(initialAd);

      const listAd = await AdService.findAll();

      for (const adItem of listAd) {
        console.log(
          ` Item encontrado id:${adItem.id}  counter:${adItem.counter}`,
        );
      }
      if (ad.shouldReset()) {
        const newAd = await AdService.adReset(ad);
        if (newAd) {
          ad = newAd;
        }
        show = true;
      } else if (ad.allowShow()) {
        show = true;
      }
      if (show) {
        this.setState({creditLine}, () => {
          this.animationLarge && this.animationLarge.stop();

          this.animationLarge = Animated.parallel([
            Animated.spring(this.state.showSmallAnim, {
              toValue: isResized ? 1 : 0,
              friction: 10,
              useNativeDriver: false,
            }),
            Animated.spring(this.state.showLargeAnim, {
              toValue: isResized ? 0 : 1,
              friction: 10,
              useNativeDriver: false,
            }),
          ]);

          this.animationLarge.start(() => {
            !isResized && this.startTimeoutResize();
          });
        });
      }
    } catch (e) {
      Log.warn(TAG, 'show', e);
    }
    return show;
  };

  open = () => {
    const {navigation, onNeedEmail, user, isLoading} = this.props;
    const hasEmail = !!user._mail;
    const {creditLine} = this.state;
    if (!creditLine || isLoading) {
      return;
    }
    let goNextStep = true;
    const creditOffer = Validate.instantCashType(creditLine);
    if (creditOffer) {
      let seedA: 'eat_flargo_ini' | 'eat_urpi_ini' | 'eat_fast_ini' =
        'eat_flargo_ini';
      switch (creditOffer.screenName) {
        case CreditLineOffer.ScreenType.StartDisposition.screenName: // disposicion
          seedA = 'eat_flargo_ini';
          AnalyticsEvent.track(A.eat_flargo);
          break;
        case CreditLineOffer.ScreenType.RequestUrpi.screenName:
          seedA = 'eat_urpi_ini';
          AnalyticsEvent.track(A.eat_urpi);
          if (!hasEmail) {
            goNextStep = false;
          }
          break;
        case CreditLineOffer.ScreenType.StartNewLoan.screenName:
          seedA = 'eat_fast_ini';
          AnalyticsEvent.track(A.eat_fast);
          break;
        default:
          break;
      }

      if (typeof onNeedEmail === 'function' && !goNextStep) {
        onNeedEmail();
        return;
      }

      const paramsNav = {
        creditLine,
        locked: creditOffer.locked,
        code: Date.now(),
        seedA,
        user,
      };
      navigation.navigate('Loans');
      setTimeout(() => {
        navigation.navigate(creditOffer.screenName, paramsNav);
      }, 300);
      // navigation.navigate(creditOffer.screenName, paramsNav);

      //       const navigateClearAction = CommonActions.navigate({name:route.name, params:{}})
      // navigation && navigation.dispatch(navigateClearAction);

      // const resetAction = CommonActions.reset({ index: 0, routes: [{ name: 'Loans' },{name:creditOffer.screenName, params:paramsNav}] })
      // navigation && navigation.dispatch(resetAction);

      AnalyticsEvent.track(A[seedA]);
    }
    this.hide();
  };

  touchSmall = (name: string) => {
    const {creditLine} = this.state;
    const {nameRoute} = this.props;
    const creditOffer = Validate.instantCashType(creditLine);
    const bannerValuesAdSmall = this.getBannerValuesAdSmall(creditLine);
    let nextLabelName = creditOffer?.screenName;
    let param;
    if (nextLabelName !== undefined) {
      param = {
        promotion_id: `${creditOffer?.code}`,
        promotion_name: `${bannerValuesAdSmall?.resumeTitleBanner}`,
        creative_name: `${ClassName[nextLabelName]}`,
        creative_slot: `${Label.BannerContracted}`,
        location_id: `${ClassName[nameRoute]}`,
      };
      AnalyticsEvent.trackEvent(name, param);
    }
  };

  touchLarge = (name: string) => {
    const {creditLine} = this.state;
    const {nameRoute} = this.props;
    const creditOffer = Validate.instantCashType(creditLine);
    const bannerValuesAdLarge = this.getBannerValuesAdLarge(creditLine);
    let nextLabelName = creditOffer?.screenName;
    let param;
    if (nextLabelName !== undefined) {
      param = {
        promotion_id: `${creditOffer?.code}`,
        promotion_name: `${bannerValuesAdLarge?.resumeTitleBanner}`,
        creative_name: `${ClassName[nextLabelName]}`,
        creative_slot: `${Label.BannerExpanded}`,
        location_id: `${ClassName[nameRoute]}`,
      };
      AnalyticsEvent.trackEvent(name, param);
    }
  };

  getBannerValuesAdLarge = (creditLine: ContentCreditLine | undefined) => {
    const {oneChoice} = this.state;
    const creditOffer = Validate.instantCashType(creditLine);
    const isSuperRate = Config.settings.instantCashSuperRate;
    let buttonTitle = L.ad_text_large_approved_buttonlink_title;
    let textTitleBanner = <Text />;
    let resumeTitleBanner = '';
    let amount = '';

    if (!creditOffer || !creditLine) {
      return null;
    }

    const {code} = creditOffer;

    switch (code) {
      case CreditLineOffer.ScreenType.StartDisposition.code:
        amount = Amount.format(
          creditLine.avaiCredLAmountWithoutTax,
          creditLine.currencyKey.toString(),
        );
        if (isSuperRate) {
          textTitleBanner = (
            <>
              <Text>
                <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part1}
                </Text>
                <Text style={styles.largeType} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part2}
                </Text>
              </Text>
              <Text>
                <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part3}
                </Text>
                <Text
                  style={styles.largeTypeUnderLine}
                  allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part4}
                </Text>
              </Text>
              <Text>
                <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part5}
                </Text>
                <Text style={styles.largeType} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part6}
                </Text>
                <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_super_rate_part7}
                </Text>
              </Text>
            </>
          );
          resumeTitleBanner =
            L.ad_text_large_pre_approved_super_rate_part1 +
            L.ad_text_large_pre_approved_super_rate_part2;
        } else {
          textTitleBanner = (
            <>
              <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                {L.ad_text_large_pre_approved_part1}
              </Text>
              <Text>
                <Text style={styles.largeType} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_part2}
                </Text>
                <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_part3}
                </Text>
                <Text style={styles.largeType} allowFontScaling={false}>
                  {L.ad_text_large_pre_approved_part4}
                </Text>
              </Text>
              <Text
                style={styles.largeTypeLigthHeight}
                allowFontScaling={false}>
                {L.ad_text_large_pre_approved_part5}
              </Text>
            </>
          );
          resumeTitleBanner =
            L.ad_text_large_pre_approved_part1 +
            L.ad_text_large_pre_approved_part2;
        }
        break;
      case CreditLineOffer.ScreenType.RequestUrpi.code:
        amount = Amount.formatWithZero(
          creditLine.capitalAmount,
          creditLine.currencyKey.toString(),
        );
        textTitleBanner = (
          <>
            <Text style={styles.largeTypeLigth} allowFontScaling={false}>
              {L.ad_text_large_approved_part1}
            </Text>
            <Text>
              <Text style={styles.largeTypeLigth} allowFontScaling={false}>
                {L.ad_text_large_approved_part2}
              </Text>
              <Text style={styles.largeType} allowFontScaling={false}>
                {L.ad_text_large_approved_part3}
              </Text>
              <Text style={styles.largeType} allowFontScaling={false}>
                {L.ad_text_large_approved_part4}
              </Text>
            </Text>
            <Text style={styles.largeTypeLigthHeight} allowFontScaling={false}>
              {L.ad_text_large_approved_part5}
            </Text>
          </>
        );
        resumeTitleBanner =
          L.ad_text_large_approved_part1 +
          L.ad_text_large_approved_part2 +
          L.ad_text_large_approved_part3;
        buttonTitle = L.ad_text_large_pre_approved_buttonlink_title_continue;
        break;
      case CreditLineOffer.ScreenType.StartNewLoan.code:
        amount = Amount.formatWithZero(
          creditLine.capitalAmount,
          creditLine.currencyKey.toString(),
        );
        textTitleBanner = (
          <>
            <Text style={styles.largeTypeCenter} allowFontScaling={false}>
              {L.ad_text_large_instacashfast_approved_part1}
            </Text>
            <Text style={styles.largeTypeParr} allowFontScaling={false}>
              {oneChoice
                ? '\nDesembolsa\n'
                : L.ad_text_large_instacashfast_approved_part2}
            </Text>
            <Text style={styles.largeTypeAmount} allowFontScaling={false}>
              {amount}
            </Text>

            <Text style={styles.largeTypeFoot} allowFontScaling={false}>
              {'\nen tu cuenta '}
              <Text style={styles.largeType} allowFontScaling={false}>
                {'al instante'}
              </Text>
            </Text>
          </>
        );
        resumeTitleBanner = `${L.ad_text_large_instacashfast_approved_part1} Desembolsa ${amount}`;
        buttonTitle = L.ad_text_large_pre_approved_buttonlink_title_continue;
        break;
    }
    return {
      textTitleBanner,
      amount,
      buttonTitle,
      isSuperRate,
      resumeTitleBanner,
    };
  };

  getBannerValuesAdSmall = (creditLine: ContentCreditLine | undefined) => {
    const {oneChoice} = this.state;
    const creditOffer = Validate.instantCashType(creditLine);
    const isSuperRate = Config.settings.instantCashSuperRate;
    let buttonTitle = L.ad_text_small_approved_buttonlink_title;
    let textTitleBanner = <Text />;
    let resumeTitleBanner = '';
    let amount = '';

    if (!creditOffer || !creditLine) {
      return null;
    }

    const {code} = creditOffer;
    let showAmountAux = false;

    switch (code) {
      case CreditLineOffer.ScreenType.StartDisposition.code:
        showAmountAux = true;
        amount = Amount.format(
          creditLine.avaiCredLAmountWithoutTax,
          creditLine.currencyKey.toString(),
        );
        if (isSuperRate) {
          textTitleBanner = (
            <>
              <Text style={styles.smallContentLight} allowFontScaling={false}>
                {L.ad_text_small_pre_approved_super_rate_part1}
                <Text style={styles.smallContentBold} allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_super_rate_part2}
                </Text>
                {L.ad_text_small_pre_approved_super_rate_part3}
                <Text
                  style={styles.smallContentBoldUnderline}
                  allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_super_rate_part4}
                </Text>
                {L.ad_text_small_pre_approved_super_rate_part5}
                <Text style={styles.smallContentBold} allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_super_rate_part6}
                </Text>
                {L.ad_text_small_pre_approved_super_rate_part7}
              </Text>
            </>
          );
          resumeTitleBanner =
            L.ad_text_small_pre_approved_super_rate_part1 +
            L.ad_text_small_pre_approved_super_rate_part2;
        } else {
          textTitleBanner = (
            <>
              <Text style={styles.smallContentLight} allowFontScaling={false}>
                {L.ad_text_small_pre_approved_part1}
              </Text>
              <Text>
                <Text style={styles.smallContentBold} allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_part2}
                </Text>
                <Text style={styles.smallContentLight} allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_part3}
                </Text>
                <Text style={styles.smallContentBold} allowFontScaling={false}>
                  {L.ad_text_small_pre_approved_part4}
                </Text>
              </Text>
              <Text style={styles.smallContentLight} allowFontScaling={false}>
                {L.ad_text_small_pre_approved_part5}
              </Text>
            </>
          );
          resumeTitleBanner =
            L.ad_text_small_pre_approved_part1 +
            L.ad_text_small_pre_approved_part2;
        }
        break;
      case CreditLineOffer.ScreenType.RequestUrpi.code:
        showAmountAux = true;
        amount = Amount.formatWithZero(
          creditLine.capitalAmount,
          creditLine.currencyKey.toString(),
        );
        textTitleBanner = (
          <>
            <Text style={styles.smallContentLight} allowFontScaling={false}>
              {L.ad_text_small_approved_part1}
            </Text>
            <Text>
              <Text style={styles.smallContentLight} allowFontScaling={false}>
                {L.ad_text_small_approved_part2}
              </Text>
              <Text style={styles.smallContentBold} allowFontScaling={false}>
                {L.ad_text_small_approved_part3}
              </Text>
            </Text>
            <Text style={styles.smallContentLight} allowFontScaling={false}>
              {L.ad_text_small_approved_aux}
              {L.ad_text_small_approved_part5}
            </Text>
          </>
        );
        buttonTitle = L.ad_text_small_pre_approved_buttonlink_title_continue;
        resumeTitleBanner =
          L.ad_text_small_approved_part1 +
          L.ad_text_small_approved_part2 +
          L.ad_text_small_approved_part3;
        break;
      case CreditLineOffer.ScreenType.StartNewLoan.code:
        showAmountAux = false;
        amount = Amount.formatWithZero(
          creditLine.capitalAmount,
          creditLine.currencyKey.toString(),
        );
        textTitleBanner = (
          <>
            <Text style={styles.smallContentBold} allowFontScaling={false}>
              {L.ad_text_small_instacashfast_approved_part1}
            </Text>
            <Text style={styles.smallContentLight} allowFontScaling={false}>
              {oneChoice
                ? L.ad_text_small_instacashfast_approved_part2_a
                : L.ad_text_small_instacashfast_approved_part2}
            </Text>
            <Text style={styles.smallContentLight} allowFontScaling={false}>
              {L.ad_text_small_instacashfast_approved_part3}
              <Text style={styles.smallContentBold} allowFontScaling={false}>
                {amount}
              </Text>
              {L.ad_text_small_instacashfast_approved_part4}
              <Text style={styles.smallContentBold} allowFontScaling={false}>
                {L.ad_text_small_instacashfast_approved_part5}
              </Text>
            </Text>
          </>
        );
        buttonTitle = L.ad_text_small_pre_approved_buttonlink_title_continue;
        resumeTitleBanner =
          L.ad_text_small_instacashfast_approved_part1 +
          L.ad_text_small_instacashfast_approved_part2;
        break;
    }
    return {
      textTitleBanner,
      amount,
      buttonTitle,
      isSuperRate,
      showAmountAux,
      resumeTitleBanner,
    };
  };

  render() {
    const {creditLine, showLargeAnim, isResized, showSmallAnim} = this.state;
    if (!creditLine) {
      return null;
    }
    const height = Size.getHeight();
    const slideLargeAnim = showLargeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [height * -1, 0],
    });
    const slideSmallAnim = showSmallAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    const bannerValuesAdLarge = this.getBannerValuesAdLarge(creditLine);
    if (!bannerValuesAdLarge) {
      return null;
    }
    const bannerValuesAdSmall = this.getBannerValuesAdSmall(creditLine);
    if (!bannerValuesAdSmall) {
      return null;
    }

    return [
      !isResized && (
        <Animated.View
          key={'overlay'}
          style={[styles.overlayContainer, {opacity: showLargeAnim}]}>
          <Touchable
            accessibilityLabel={'ad_overlay_hide'}
            activeOpacity={0.9}
            style={styles.overlay}
            onPress={this.resize}
          />
        </Animated.View>
      ),
      <Animated.View
        key={'large'}
        style={[
          styles.largeContainer,
          {
            opacity: showLargeAnim,
            bottom: slideLargeAnim,
          },
        ]}>
        <AdLarge
          touchLarge={() => {
            this.touchLarge('view_promotion');
          }}
          positionText={Label.BannerExpanded}
          textTitleBanner={bannerValuesAdLarge.resumeTitleBanner}
          creditLine={creditLine}
          onClose={this.resize}
          accessibilityLabel={'ad_adlarge_open'}
          style={styles.adLarge}
          imageSource={require('../../assets/images/icon-hand-money.png')}
          content={
            <View style={styles.adLargeContent}>
              <Text style={styles.adContentText}>
                {bannerValuesAdLarge.textTitleBanner}
              </Text>
              <View style={styles.largeAmountContainer}>
                {bannerValuesAdSmall.showAmountAux && (
                  <Text
                    accessibilityLabel={'ad_amount'}
                    textBreakStrategy={'highQuality'}
                    style={styles.largeAmount}
                    allowFontScaling={false}>
                    {bannerValuesAdLarge.amount}
                  </Text>
                )}
                {bannerValuesAdLarge.isSuperRate && (
                  <Text style={styles.dateEnd}>
                    {L.ad_text_large_pre_approved_super_rate_date}
                  </Text>
                )}
              </View>
            </View>
          }
          buttonExternalProps={{
            accessibilityLabel: 'ad_buttonexternal_title',
            title: L.ad_buttonexternal_large_open,
            onPress: () => {
              this.open();
              this.touchLarge('select_promotion');
            },
          }}
        />
      </Animated.View>,
      <Animated.View
        key={'small'}
        style={[
          styles.smallContainer,
          {opacity: showSmallAnim, bottom: slideSmallAnim},
        ]}>
        <AdView
          touchSmall={() => {
            this.touchSmall('view_promotion');
          }}
          positionText={Label.BannerContracted}
          textTitleBanner={bannerValuesAdSmall.resumeTitleBanner}
          creditLine={creditLine}
          accessibilityLabel={'ad_open'}
          onPress={() => {
            this.open();
            this.touchSmall('select_promotion');
          }}
          onClose={this.close}
          style={styles.adSmall}
          content={
            <Text style={styles.smallContent} allowFontScaling={false}>
              {bannerValuesAdSmall.textTitleBanner}
              {bannerValuesAdSmall.showAmountAux && (
                <Text
                  textBreakStrategy={'highQuality'}
                  style={styles.textAmount}>
                  {bannerValuesAdSmall.amount}
                </Text>
              )}
            </Text>
          }
        />
      </Animated.View>,
    ];
  }
}

export default Ad;
