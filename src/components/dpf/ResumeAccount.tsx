const moment = require('moment');
import * as React from 'react';
import {
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  Animated,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import { DepositsItem } from '../../api/backend/response/Execute';
import { Colors } from '../../resources/constants';
import { Font, UI } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Amount } from '../../resources/money';
import { CardView, DetailRow, Touchable } from '../ui';
import RenameAccount from '../savings/RenameAccount';

const styles = StyleSheet.create({
  accountText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  accountTextDescription: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  btnShare: {
    top: '75%',
    position: 'absolute',
    width: 30,
    height: 30,
    right: 20,
  } as ImageStyle,
  moreIcon: {
    height: 6,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey5,
  } as ImageStyle,
  imageShareStyle: {
    width: 22,
    height: 24,
    tintColor: Colors.primary,
  } as ImageStyle,
  cardView: {
    flex: 1,
    paddingHorizontal: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 10,
    paddingTop: 30,
  } as ViewStyle,
  resumeContainer: {
    flexDirection: 'row',
  } as ViewStyle,
  amountLabelText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    color: Colors.primaryLight,
  } as TextStyle,
  containerBannerInfo: {
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 40,
  } as ViewStyle,
  amountValueText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    color: Colors.primaryLight,
    alignItems: 'flex-end',
  } as TextStyle,
  textContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  detailRow: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  detailInfo: {
    marginTop: 10,
    marginBottom: 20,
  } as ViewStyle,
  marginRow: {
    marginBottom: 2,
  } as ViewStyle,
  cardViewAccount: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  } as ViewStyle,
  cancelBtn: {
    marginTop: 10,
  } as ViewStyle,
  toggleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconResumeInfo: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    tintColor: Colors.white,
    marginRight: 6,
  } as ImageStyle,
  titleBannerInfo: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 14,
    lineHeight: 22,
  } as TextStyle,
  textSubtitleResumeInfo: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  toggleContainer: {
    padding: 10,
    paddingTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  textBanner: {
    marginBottom: 5,
    flexDirection: 'row',
  } as ViewStyle,
  subtextBanner: {
    flexDirection: 'row',
  } as ViewStyle,
  toggle: {
    paddingRight: 6,
    fontSize: 13,
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey5,
  } as TextStyle,
  boldText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 16,
    color: Colors.primaryLight,
  } as TextStyle,
  boldTextDetail: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
    color: Colors.grey6,
    lineHeight: 19,
  } as TextStyle,
  labelText: {
    lineHeight: 19,
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  textFree: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 13,
    textAlign: 'left',
    paddingLeft: 5,
  } as TextStyle,
  containerLoan: {
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey1,
    elevation: 4,
    overflow: 'visible',
  } as ViewStyle,
});

const TAG = '[ResumeAccount]';

export interface ResumeAccountProps extends ViewProps {
  account: DepositsItem;
  accessibilityLabel: string;
}

export interface ResumeAccountState {
  expanded: boolean;
  heightPanel: Animated.Value;
}

export default class ResumeAccount extends React.Component<
  ResumeAccountProps,
  ResumeAccountState
> {
  state: ResumeAccountState = {
    expanded: false,
    heightPanel: new Animated.Value(0),
  };
  animation!: Animated.CompositeAnimation;
  toggleExpandButton = () => {
    let { expanded } = this.state;
    const { heightPanel } = this.state;
    expanded = !expanded;
    this.setState({ expanded });
    this.animation && this.animation.stop();
    this.animation = Animated.spring(heightPanel, {
      toValue: expanded ? 120 : 0,
      friction: 10,
      useNativeDriver: false,
    });
    this.animation.start();
  };
  renderMoreIcon = () => {
    const { heightPanel } = this.state;
    const rotate = heightPanel.interpolate({
      inputRange: [0, 120],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Image
          accessibilityLabel={'accountselector_more_icon'}
          style={styles.moreIcon}
          source={require('../../assets/images/see-more-arrow.png')}
        />
      </Animated.View>
    );
  };

  shareAccount = async () => {
    const { account } = this.props;
    const numberAccount = account.extraInfo.split('|')[4];
    const data = {
      account_name: account.label
        ? account.label.replace(numberAccount, '').trim()
        : account.shortLabel.replace(numberAccount, '').trim(),
      account_number: numberAccount,
    };
    const options = UI.shareCCI(data);
    try {
      await Share.open(options);
      Log.info(TAG, 'shareAccount', 'now already shared');
    } catch (e) {
      Log.exception(TAG, 'shareAccount', e);
    }
  };

  render() {
    const { expanded, heightPanel } = this.state;
    const { account, accessibilityLabel, ...props } = this.props;
    if (!account) {
      return;
    }
    const accountNumber = account.description || account.number;
    const balance = Amount.format(account.capital, account.currency);

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'resumeaccount'}
        {...props}
      >
        <View style={styles.containerLoan}>
          <CardView style={[styles.cardView]}>
            <RenameAccount
              style={{ paddingBottom: 10 }}
              account={account}
              accessibilityLabel={'resumeaccount_text_accountname'}
            />
            <DetailRow
              accessibilityLabel={'resumeaccount_amount'}
              style={styles.marginRow}
              labelStyle={styles.amountLabelText}
              textStyle={styles.amountValueText}
              label={L.dpfscreen_resumeaccount_amount_label_text}
              text={balance}
            />
            <DetailRow
              accessibilityLabel={'resumeaccount_rate'}
              style={[styles.detailRow, styles.marginRow]}
              labelStyle={styles.boldText}
              textStyle={styles.boldText}
              label={L.dpfscreen_resumeaccount_rate_text}
              text={Amount.format(account.interest, account.currency)}
            />

            <DetailRow
              accessibilityLabel={'resumeaccount_closing_date'}
              style={styles.detailRow}
              textStyle={styles.boldTextDetail}
              labelStyle={styles.labelText}
              label={L.dpfscreen_resumeaccount_closing_date_text}
              text={moment(account.closingDate).format(
                L.movementitem_date_format
              )}
            />

            <Animated.View style={{ height: heightPanel }}>
              {expanded && (
                <>
                  <DetailRow
                    accessibilityLabel={'resumeaccount_interest'}
                    style={styles.detailRow}
                    textStyle={styles.boldTextDetail}
                    labelStyle={styles.labelText}
                    label={L.dpfscreen_resumeaccount_interest_text}
                    text={`${account.rateOfInterest.toFixed(2)}%`}
                  />
                  <DetailRow
                    accessibilityLabel={'resumeaccount_term_label'}
                    style={styles.detailRow}
                    textStyle={styles.boldTextDetail}
                    labelStyle={styles.labelText}
                    label={L.dpfscreen_resumeaccount_term_text}
                    text={
                      account.term +
                      ' ' +
                      L.dpfscreen_resumeaccount_term_label_text
                    }
                  />
                  <DetailRow
                    accessibilityLabel={'resumeaccount_opening_date'}
                    style={styles.detailRow}
                    textStyle={styles.boldTextDetail}
                    labelStyle={styles.labelText}
                    label={L.dpfscreen_resumeaccount_opening_date_text}
                    text={moment(account.openingDate).format(
                      L.movementitem_date_format
                    )}
                  />
                  <View style={styles.detailInfo}>
                    <Text style={styles.labelText}>
                      {L.dpfscreen_resumeaccount_detail_text}
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
            <View style={styles.toggleContent}>
              <Touchable
                accessibilityLabel={'resumeaccount_buttonlink_toggle_detail'}
                style={styles.toggleContainer}
                onPress={this.toggleExpandButton}
              >
                <Text
                  accessibilityLabel={'resumeaccount_buttonlink_toggle_detail'}
                  style={styles.toggle}
                >
                  {expanded
                    ? L.expandableview_buttonlink_toggle_see_less
                    : L.expandableview_buttonlink_toggle_see_more}
                </Text>
                {this.renderMoreIcon()}
              </Touchable>
            </View>
          </CardView>
          {/**Validacion para tarjeta de usuario
           * Aun no se tiene el servicio para activacion del banner
           * 
            <View
              accessibilityLabel={'banner_info'}
              style={styles.containerBannerInfo}
            >
              <View style={styles.textBanner}>
                <Image
                  accessibilityLabel={'banner_info_checkbox_active'}
                  style={styles.iconResumeInfo}
                  resizeMode={'contain'}
                  source={require('../../assets/images/info-icon.png')}
                />
                <Text style={styles.titleBannerInfo}>
                  {L.accountdetail_banner_title}
                </Text>
              </View>
              <View style={styles.subtextBanner}>
                <Text style={styles.textSubtitleResumeInfo}>
                  {L.accountdetail_banner_subtitle}
                </Text>
              </View>
              <Text style={styles.textSubtitleResumeInfo}>
                {L.accountdetail_banner_subtitle2}
                <Text style={styles.textFree}>
                  {L.accountdetail_banner_free}
                </Text>
              </Text>
            </View>
          */}
        </View>
        <CardView style={styles.cardViewAccount}>
          <Text
            selectable
            accessibilityLabel={'resumeaccount_text_accountnumber_label'}
            style={styles.accountTextDescription}
          >
            {L.resumeaccount_number}
            {':'}
          </Text>
          <Text
            selectable
            accessibilityLabel={'resumeaccount_text_accountnumber'}
            style={styles.accountText}
          >
            {accountNumber}
          </Text>
          <Touchable
            accessibilityLabel={'resumeaccount_button_share'}
            style={styles.btnShare}
            onPress={this.shareAccount}
          >
            <Image
              accessibilityLabel={'accountitem_icon'}
              source={require('../../assets/images/share-icon.png')}
              style={styles.imageShareStyle}
            />
          </Touchable>
        </CardView>
      </View>
    );
  }
}
