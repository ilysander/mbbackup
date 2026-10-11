import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { LoansItem } from '../../api/backend/response/Execute';
import { CardView, Separator, ButtonImage } from '../ui';
import { L } from '../../resources/language';
import { Colors, Loan } from '../../resources/constants';
import { Amount } from '../../resources/money';
import ResumeHeader from './ResumeHeader';
import ResumeBox from './ResumeBox';
import { Sanitizer, Font } from '../../resources/functions';
import { NavigationProp } from '@react-navigation/native';
const moment = require('moment');

const styles = StyleSheet.create({
  containerItems: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  } as ViewStyle,
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  } as ViewStyle,
  arrowButtonImage: {
    width: 6,
    height: 12,
    tintColor: Colors.grey4,
  } as ImageStyle,
  arrowHitSlop: {
    top: 20,
    bottom: 20,
    right: 20,
    left: 20,
  },
  resumeBox: {
    flex: 1,
    alignItems: 'baseline',
  } as ViewStyle,
  resumeTitle: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
    lineHeight: 18,
  } as TextStyle,
  subtitleStyle: {
    ...Font({ weight: 'Regular' }),
    fontSize: 13,
    color: Colors.grey5,
    lineHeight: 15,
  } as TextStyle,
});

const NRO_FEES = '<<NRO_CUOTAS>>';
export interface LoanResumePostponementProps extends ViewProps {
  loan: LoansItem;
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
}

export interface LoanResumePostponementState { }

export default class LoanResumePostponement extends React.Component<
  LoanResumePostponementProps,
  LoanResumePostponementState
> {
  state: LoanResumePostponementState = {};

  goToConfirm = () => {
    const { loan, navigation } = this.props;

    if (!loan) {
      return;
    }

    const { reschedule } = loan;

    if (!reschedule) {
      return;
    }

    const { enabled, status, code } = reschedule;

    if (enabled === Loan.RulesCodePostponement.PostponementEnabled) {
      navigation.navigate('LoansPostponementOption', { loan });
    }

    if (
      enabled === Loan.RulesCodePostponement.PosponementDisabled &&
      status === Loan.RulesCodePostponement.PosponementStatus
    ) {
      if (code === Loan.RulesCodePostponement.codePhoneBanking) {
        navigation.navigate('LoansPostponementMessageNotAllowed', {
          loan,
        });
      }
    }
  };

  render() {
    const {
      loan,
      style,
      navigation,
      accessibilityLabel,
      ...props
    } = this.props;
    const { fees } = loan;
    const leftFees = loan.totalFees - loan.paidFees;
    const date = moment(loan.nextFeeDueDate)
      .format(L.loanresumepostponement_format_date)
      .toLowerCase();
    const fee = !!fees?.length ? fees[0].amount : 0;

    let leftFeesText = L.loanresumepostponement_label_fee.replace(
      NRO_FEES,
      leftFees + ''
    );

    leftFees > 1 && (leftFeesText += 's');

    return (
      <CardView
        accessibilityLabel={accessibilityLabel || 'loanresumepostponement'}
        style={style}
        {...props}
      >
        <TouchableOpacity onPress={this.goToConfirm}>
          <ResumeHeader
            style={styles.content}
            accessibilityLabel={'loanresumepostponement_header'}
            title={Sanitizer.cleanProductLabel(loan.shortLabel, loan)}
            subtitle={Amount.format(loan.loanAmount, loan.currency)}
            rightContainer={
              <ButtonImage
                accessibilityLabel={'ad_arrow'}
                imageSource={require('../../assets/images/arrow-icon.png')}
                imageStyle={styles.arrowButtonImage}
                hitSlop={styles.arrowHitSlop}
                onPress={this.goToConfirm}
              />
            }
          >
            <View style={styles.containerItems}>
              <ResumeBox
                accessibilityLabel={'loanresumepostponement_label_amount'}
                style={styles.resumeBox}
                titleStyle={styles.resumeTitle}
                subtitleStyle={styles.subtitleStyle}
                title={leftFeesText}
                subtitle={
                  L.loanresumepostponement_label_amount +
                  Amount.format(fee, loan.currency)
                }
              />
              <Separator vertical />
              <ResumeBox
                accessibilityLabel={'loanresumepostponement_label_expiration'}
                style={{ width: '25%' }}
                title={L.loanresumepostponement_label_expiration}
                subtitle={date}
              />
            </View>
          </ResumeHeader>
        </TouchableOpacity>
      </CardView>
    );
  }
}
