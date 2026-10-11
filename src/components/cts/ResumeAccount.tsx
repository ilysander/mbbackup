import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
  Image,
} from 'react-native';
import Share from 'react-native-share';
import { AccountsCTSItem } from '../../api/backend/response/Execute';
import { DetailRow, Touchable } from '../../components/ui';
import { Colors } from '../../resources/constants';
import { Font, UI } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Amount } from '../../resources/money';
import { CardView } from '../ui';
import RenameAccount from '../savings/RenameAccount';

const styles = StyleSheet.create({
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 18,
  } as TextStyle,
  accountTextDescription: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  accountText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  rateText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  nameText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 18,
  } as TextStyle,
  resumeAccountBalanceText: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  cardViewAccount: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
  } as ViewStyle,
  imageShareStyle: {
    width: 22,
    height: 24,
    tintColor: Colors.primary,
  } as ImageStyle,
  containerSection: {
    flex: 1,
    marginBottom: 10,
  } as ViewStyle,
  cardView: {
    flex: 1,
    paddingHorizontal: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 30,
    paddingTop: 30,
  } as ViewStyle,
  detailRow: {
    alignItems: 'flex-end',
  } as ViewStyle,
  detailRowRate: {
    marginTop: 10,
  } as ViewStyle,
  availableBalanceText: {
    fontSize: 20,
    lineHeight: 22,
  } as TextStyle,
  btnShare: {
    position: 'absolute',
    width: 30,
    height: 30,
    right: 20,
    top: '75%',
  } as ImageStyle,
});
const TAG = '[ResumeAccount]';

export interface ResumeAccountProps extends ViewProps {
  account: AccountsCTSItem;
  accessibilityLabel: string;
}

export interface ResumeAccountState {}

export default class ResumeAccount extends React.Component<
  ResumeAccountProps,
  ResumeAccountState
> {
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
    const { account, accessibilityLabel, ...props } = this.props;
    if (!account) {
      return null;
    }
    const subtitle = account.number;
    const availableBalance = Amount.format(
      account.availableBalance || 0,
      account.currency
    );
    const balance = Amount.format(account.balance || 0, account.currency);

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'resumeaccount'}
        {...props}
      >
        <CardView style={[styles.cardView, { marginBottom: 20 }]}>
          <RenameAccount
            style={styles.containerSection}
            accessibilityLabel={'resumeaccount_renameaccount'}
            account={account}
          />
          <DetailRow
            accessibilityLabel={'resumeaccount_text_available_balance'}
            style={styles.detailRow}
            labelStyle={styles.nameText}
            textStyle={[styles.titleText, styles.availableBalanceText]}
            label={L.resumeaccount_available_balance}
            text={availableBalance}
          />
          <DetailRow
            accessibilityLabel={'resumeaccount_text_account_balance'}
            style={styles.detailRow}
            labelStyle={styles.resumeAccountBalanceText}
            textStyle={styles.resumeAccountBalanceText}
            label={L.resumeaccount_balance_cts}
            text={balance}
          />
          <DetailRow
            accessibilityLabel={'resumeaccount_text_account_balance'}
            style={styles.detailRow}
            labelStyle={styles.resumeAccountBalanceText}
            textStyle={styles.resumeAccountBalanceText}
            label={L.loanscreen_resumeaccount_text_interest_rate}
            text={`${account.rateOfInterest.toFixed(2)}%`}
          />
        </CardView>
        <CardView style={styles.cardViewAccount}>
          <Text
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
            {subtitle}
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
