import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { LoansItem } from '../../api/backend/response/Execute';
import {
  CardView,
  Content,
  DetailRow,
  ProgressInfo,
} from '../../components/ui';
import { Colors, LayoutAnimations } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Font, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import PayButton from './PayButton';

const moment = require('moment');

const styles = StyleSheet.create({
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 22,
  } as TextStyle,
  accountText: {
    color: Colors.grey6,
    fontSize: 15,
  } as TextStyle,
  accountTypeText: {
    color: Colors.grey6,
    ...Font({ weight: 'Black' }),
    fontSize: 14,
  } as TextStyle,
  nameText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
  } as TextStyle,
  nameTextAmountToBePayed: {
    ...Font({ weight: 'Black' }),
    color: Colors.primaryLight,
    fontSize: 14,
  } as TextStyle,
  overdueText: {
    ...Font({ weight: 'Black' }),
    color: Colors.danger,
    fontSize: 20,
  } as TextStyle,
  overdueLabel: {
    ...Font({ weight: 'Black' }),
    color: Colors.danger,
    fontSize: 14,
  } as TextStyle,
  nameTextAquaMarine: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accentDark,
    fontSize: 14,
  } as TextStyle,
  containerSection: {
    flexDirection: 'row',
    marginBottom: 10,
  } as ViewStyle,
  containerNextFee: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
  } as ViewStyle,
  headerContent: {
    flex: 1,
    padding: 20,
    borderRadius: 0,
  } as ViewStyle,
  newTitleText: {
    ...Font({ weight: 'Black' }),
    color: Colors.primaryLight,
    fontSize: 20,
  } as TextStyle,
  detailLoan: {
    padding: 20,
  } as ViewStyle,
  content: {
    paddingVertical: 20,
  } as ViewStyle,
  detailRemainingFees: {
    alignItems: 'center',
    marginTop: 4,
  } as ViewStyle,
  descriptionLoan: {
    flexDirection: 'row',
    marginBottom: 15,
  } as ViewStyle,
  headerLoanDescription: {
    flex: 1,
  } as ViewStyle,
  headerAmountDescription: {
    flex: 1,
    alignItems: 'flex-end',
  } as ViewStyle,
  buttonContainer: {
    alignItems: 'flex-end',
    flex: 1,
  } as ViewStyle,
});

export interface ResumeAccountProps extends ViewProps {
  account: LoansItem;
  navigation: NavigationProp<any, any>;
  accessibilityLabel: string;
  isBetweenOfficeHours: boolean;
}

export interface ResumeAccountState {
  expanded: boolean;
  height: number;
  isLoading: boolean;
  accounts: any;
}

export default class ResumeAccount extends React.Component<
  ResumeAccountProps,
  ResumeAccountState
> {
  state: ResumeAccountState = {
    height: 100,
    expanded: true,
    isLoading: false,
    accounts: undefined,
  };

  showMore = () => {
    const { expanded } = this.state;
    LayoutAnimations.default();
    if (!expanded) {
      return this.setState({ expanded: !expanded, height: 100 });
    }
    return this.setState({ expanded: !expanded, height: 0 });
  };

  render() {
    const { account, navigation, isBetweenOfficeHours, ...props } = this.props;

    const isUnexpired = !Validate.isLoanExpired(account);
    return (
      <View {...props} accessibilityLabel={'resumeaccount_container'}>
        <CardView style={styles.headerContent}>
          <View style={styles.descriptionLoan}>
            <View style={styles.headerLoanDescription}>
              <Text
                accessibilityLabel={'resumeaccount_product_name'}
                style={styles.titleText}
              >
                {(account.shortLabel || '')
                  .replace(account.loanNumber, '')
                  .trim()}
              </Text>
              <Text
                selectable
                accessibilityLabel={'resumeaccount_subtitle'}
                style={styles.accountText}
              >
                {L.resumeaccount_symbol_accountsubtitle} {account.loanNumber}
              </Text>
            </View>
            <View style={styles.headerAmountDescription}>
              <Text
                selectable
                accessibilityLabel={'resumeaccount_subtitle'}
                style={styles.accountTypeText}
              >
                {L.resumeaccount_borrowedamount_text}
              </Text>
              <Text
                accessibilityLabel={'resumeaccount_totalamount'}
                style={styles.titleText}
              >
                {Amount.format(account.loanAmount, account.currency)}
              </Text>
            </View>
          </View>
          <ProgressInfo
            accessibilityLabel={'resumeaccount_progressbar'}
            width={Size.getVisibleWidth() - 40}
            progress={account.paidFees / account.totalFees}
            leftValue={`${account.paidFees} ${L.resumeaccount_fees_label}`}
            leftLabel={L.resumeaccount_paid_fees_label}
            rightValue={`${account.totalFees} ${L.resumeaccount_fees_label}`}
            rightLabel={L.resumeaccount_total_fees_label}
          />
          <View style={styles.detailRemainingFees}>
            <Text
              accessibilityLabel={'resumeaccount_pending_fees'}
              style={styles.nameTextAquaMarine}
            >
              {L.resumeaccount_pending_fees}{' '}
              {account.totalFees - account.paidFees}{' '}
              {L.resumeaccount_pending_fees_part2}
            </Text>
          </View>
        </CardView>
        <Content vertical={false} style={styles.content}>
          <CardView style={styles.detailLoan}>
            <View style={styles.containerSection}>
              <View style={styles.containerNextFee}>
                <Text
                  accessibilityLabel={'resumeaccount_next_fee_amount_text'}
                  style={
                    isUnexpired
                      ? styles.nameTextAmountToBePayed
                      : styles.overdueLabel
                  }
                  numberOfLines={1}
                >
                  {isUnexpired
                    ? L.loanscreen_resumeaccount_text_next_amount_fee
                    : L.loanscreen_resumeaccount_text_due_amount_fee}
                </Text>
                <Text
                  accessibilityLabel={'resumeaccount_next_fee_amount'}
                  style={
                    isUnexpired
                      ? [styles.titleText, styles.newTitleText]
                      : styles.overdueText
                  }
                  numberOfLines={1}
                >
                  {Amount.format(account.nextFeeAmount, account.currency)}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <PayButton
                  accessibilityLabel={'loanscreen_resumeaccount_button_pay'}
                  navigation={navigation}
                  loan={account}
                  isBetweenOfficeHours={isBetweenOfficeHours}
                />
              </View>
            </View>
            <DetailRow
              label={L.loanscreen_resumeaccount_text_due_date_fee}
              text={moment(account.nextFeeDueDate).format(
                L.loanscreen_resumeaccount_text_due_date_fee_format
              )}
              labelStyle={styles.nameText}
              textStyle={styles.nameText}
              accessibilityLabel={'resumeaccount_next_fee_date'}
            />
            <DetailRow
              label={L.loanscreen_resumeaccount_text_interest_rate}
              text={`${account.apr}%`}
              accessibilityLabel={'resumeaccount_interest_rate'}
            />
            <DetailRow
              label={L.loanscreen_resumeaccount_text_capital_balance}
              text={Amount.format(
                account.currentCapitalBalance,
                account.currency
              )}
              accessibilityLabel={'resumeaccount_capital_balance'}
            />
          </CardView>
        </Content>
      </View>
    );
  }
}
