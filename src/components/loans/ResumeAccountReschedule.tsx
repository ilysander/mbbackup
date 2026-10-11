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
import { CardView, Separator } from '../ui';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { NavigationProp } from '@react-navigation/native';

const moment = require('moment');

const styles = StyleSheet.create({
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 18,
  } as TextStyle,
  nameTextFees: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  amountTextMissing: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  nameTextExpiry: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  amountTextDateExpiry: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
  headerContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 50,
    paddingBottom: 32,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  } as ViewStyle,
  detailRemainingFees: {
    marginTop: 16,
    flexDirection: 'row',
  } as ViewStyle,
  descriptionLoan: {
    flex: 1,
  } as ViewStyle,
  detailRemainingCountFeesAmount: {
    flex: 1,
  } as ViewStyle,
  detailRemainingExpityFees: {
    width: '25%',
    alignItems: 'center',
  } as ViewStyle,
  separator: {
    backgroundColor: Colors.grey2,
  } as ViewStyle,
});

export interface ResumeAccountRescheduleProps extends ViewProps {
  account: LoansItem;
  navigation: NavigationProp<any, any>;
  accessibilityLabel: string;
}

export interface ResumeAccountRescheduleState {
  accounts: any;
}

export default class ResumeAccountReschedule extends React.Component<
  ResumeAccountRescheduleProps,
  ResumeAccountRescheduleState
> {
  state: ResumeAccountRescheduleState = {
    accounts: undefined,
  };

  render() {
    const { account, navigation, ...props } = this.props;
    const date = moment(account.nextFeeDueDate)
      .format(L.loanresumepostponement_format_date)
      .toLowerCase();
    const { fees } = account;
    const fee = !!fees?.length ? fees[0].amount : 0;

    return (
      <View {...props} accessibilityLabel={'resumeaccountreschedule_container'}>
        <CardView style={styles.headerContent}>
          <View style={styles.descriptionLoan}>
            <Text
              accessibilityLabel={'resumeaccountreschedule_product_name'}
              style={styles.titleText}
            >
              {(account.shortLabel || '')
                .replace(account.loanNumber, '')
                .trim()}
            </Text>
            <Text style={styles.amountText}>
              {Amount.format(account.loanAmount, account.currency)}
            </Text>
          </View>
          <View style={styles.detailRemainingFees}>
            <View style={styles.detailRemainingCountFeesAmount}>
              <Text style={styles.nameTextFees}>
                {L.resumeaccountreschedule_pending_fees}{' '}
                {account.totalFees - account.paidFees}{' '}
                {L.resumeaccountreschedule_fees_label}
              </Text>
              <Text style={styles.amountTextMissing}>
                <Text>{L.resumeaccountreschedule_amount_missing}</Text>
                {Amount.format(fee, account.currency)}
              </Text>
            </View>
            <Separator vertical style={styles.separator} />
            <View style={styles.detailRemainingExpityFees}>
              <Text style={styles.nameTextExpiry}>
                {L.resumeaccountreschedule_total_expity_label}
              </Text>
              <Text style={styles.amountTextDateExpiry}>{date}</Text>
            </View>
          </View>
        </CardView>
      </View>
    );
  }
}
