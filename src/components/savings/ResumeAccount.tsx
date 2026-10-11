import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';
import DetailRow from '../../components/ui/DetailRow';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import UI from '../../resources/functions/UI';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Amount } from '../../resources/money';
import CardView from '../ui/CardView';
import Touchable from '../ui/Touchable';
import RenameAccount from './RenameAccount';

const styles = StyleSheet.create({
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 18,
  } as TextStyle,
  accountTextDescription: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  accountText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    paddingBottom: 5,
    fontSize: 14,
  } as TextStyle,
  cciTextDescription: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  cciText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
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
  btnShare: {
    position: 'absolute',
    width: 23,
    height: 24,
    right: 20,
    top: '60%',
  } as ImageStyle,
  imageShareStyle: {
    width: 23,
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
    paddingBottom: 30,
    paddingTop: 30,
  } as ViewStyle,
  cardViewAccount: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 30,
  } as ViewStyle,
  detailRow: {
    alignItems: 'flex-end',
    marginTop: 2,
  } as ViewStyle,
  renameAccount: {
    marginBottom: 10,
  } as ViewStyle,
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
  account: AccountItemSavingsAll;
  accessibilityLabel: string;
}

export interface ResumeAccountState { }

export default class ResumeAccount extends React.Component<
  ResumeAccountProps,
  ResumeAccountState
> {
  shareAccount = async () => {
    try {
      const { account } = this.props;
      const numberAccount = account.extraInfo.split('|')[4];
      const data = {
        account_name: account.label
          ? account.label.replace(numberAccount, '').trim()
          : account.shortLabel.replace(numberAccount, '').trim(),
        account_number: numberAccount,
        cci: account.cci,
      };
      const options = UI.shareCCI(data);
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
        <View style={styles.containerLoan}>
          <CardView style={[styles.cardView]}>
            <RenameAccount
              style={styles.renameAccount}
              accessibilityLabel={'resumeaccount_renameaccount'}
              account={account}
            />
            <DetailRow
              accessibilityLabel={'resumeaccount_text_available_balance'}
              style={styles.detailRow}
              labelStyle={styles.nameText}
              textStyle={styles.titleText}
              label={L.resumeaccount_available_balance}
              text={availableBalance}
            />
            <DetailRow
              accessibilityLabel={'resumeaccount_text_account_balance'}
              style={styles.detailRow}
              labelStyle={styles.resumeAccountBalanceText}
              textStyle={styles.resumeAccountBalanceText}
              label={L.resumeaccount_balance}
              text={balance}
            />
          </CardView>
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
            {subtitle}
          </Text>
          {account.cci && (
            <>
              <Text
                accessibilityLabel={'resumeaccount_text_cci_label'}
                style={styles.cciTextDescription}
              >
                {L.resumeaccount_cci}
                {':'}
              </Text>
              <Text
                selectable
                accessibilityLabel={'resumeaccount_text_cci'}
                style={styles.cciText}
              >
                {account.cci}
              </Text>
            </>
          )}
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
