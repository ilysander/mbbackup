const moment = require('moment');
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import { Font, Linking, Sanitizer, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Amount } from '../../resources/money';
import { Separator, Touchable } from '../ui';
import { Log } from '../../resources/log';

const styles = StyleSheet.create({
  containerbox: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  dueDate: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 16,
    lineHeight: 19,
  } as TextStyle,
  dueDateOverdue: {
    ...Font(),
    color: Colors.danger,
    fontSize: 16,
    lineHeight: 19,
  } as TextStyle,
  options: {
    flex: 3,
    alignItems: 'flex-end',
  } as ViewStyle,
  feeDescriptionText: {
    ...Font(),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey5,
  } as TextStyle,
  feeText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 26,
  } as ViewStyle,
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  dueDateDescription: {
    ...Font(),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey5,
  } as TextStyle,
  dueDateDescriptionOverdue: {
    ...Font(),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.danger,
  } as TextStyle,
  contentItem: {
    flex: 1,
    paddingHorizontal: 20,
  } as TextStyle,
  contentText: {
    flex: 5,
    alignItems: 'flex-start',
  } as TextStyle,
});

const TAG = '[LoanResumeItem]';

export interface LoanResumeItemProps {
  loan: any;
  isLast?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface LoanResumeItemState {}

export default class LoanResumeItem extends React.Component<
  LoanResumeItemProps,
  LoanResumeItemState
> {
  goToLoans = async () => {
    try {
      await Linking.openURL(Config.settings.loanListUrl);
    } catch (e) {
      Log.debug(TAG, 'goToLoans', e);
    }
  };

  onPress = (isUnexpired: boolean) => {
    const { onPress } = this.props;
    if (!isUnexpired) {
      Emitter.emit('onToast', {
        id: 'loan_due',
        message: L.paymentstypes_toast_loan_due_error,
        action: {
          onPress: this.goToLoans,
          title: L.paymentstypes_toast_go_to_web,
        },
      });
      return;
    }
    onPress();
  };

  render() {
    const { loan, isLast } = this.props;

    const isUnexpired = !Validate.isLoanExpired(loan);
    const dueDate = moment(loan.nextFeeDueDate)
      .format('DD MMM')
      .toUpperCase();

    return (
      <View key={'panel'} style={styles.containerbox}>
        <Touchable
          accessibilityLabel={'loanresumeitem'}
          onPress={() => this.onPress(isUnexpired)}
          style={styles.button}
        >
          <View style={styles.contentItem}>
            <View style={styles.nameContainer}>
              <View style={styles.contentText}>
                <Text
                  accessibilityLabel={'loanresumeitem_text_balance'}
                  style={styles.feeText}
                >
                  {Amount.format(loan.loanAmount, loan.currency)}
                </Text>
                <Text
                  accessibilityLabel={'loanresumeitem_text_fee_description'}
                  style={styles.feeDescriptionText}
                >
                  {Sanitizer.cleanProductLabel(loan.shortLabel, loan)}
                </Text>
              </View>
              <View style={styles.options}>
                <Text
                  accessibilityLabel={'loanresumeitem_text_duedate'}
                  style={isUnexpired ? styles.dueDate : styles.dueDateOverdue}
                >
                  {dueDate}
                </Text>

                <Text
                  accessibilityLabel={'loanresumeitem_text_duedate_description'}
                  style={
                    isUnexpired
                      ? styles.dueDateDescription
                      : styles.dueDateDescriptionOverdue
                  }
                >
                  {isUnexpired
                    ? L.loanresumeitem_text_duedate_description
                    : L.loanresumeitem_text_duedate_expired}
                </Text>
              </View>
            </View>
            {!isLast && <Separator />}
          </View>
        </Touchable>
      </View>
    );
  }
}
