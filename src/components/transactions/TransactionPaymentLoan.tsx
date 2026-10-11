const moment = require('moment');
import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import DetailItem from '../ui/DetailItem';
import ExpandableView from '../ui/ExpandableView';

const styles = StyleSheet.create({
  boxPadding: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  } as ViewStyle,
  detailContainer: {
    width: '100%',
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
});
export interface TransactionPaymentLoanProps {
  panelItemTitle?: string;
  resume?: any;
  type?: string;
  loan?: any;
  origin?: any;
  frequentContact?: any;
}

export interface TransactionPaymentLoanState {
  requestMoreInfo: boolean;
}

export default class TransactionPaymentLoan extends React.Component<
  TransactionPaymentLoanProps,
  TransactionPaymentLoanState
> {
  state: TransactionPaymentLoanState = {
    requestMoreInfo: false,
  };
  checkLoanAmount = (loanAmount: any) => {
    return !!(loanAmount && loanAmount.quantity && loanAmount.currency);
  };

  onToggle = () => {
    const { requestMoreInfo } = this.state;
    requestMoreInfo
      ? this.setState({ requestMoreInfo: false })
      : this.setState({ requestMoreInfo: true });
  };

  render() {
    const {
      operationNumber,
      creditAccountHolder,
      date,
      overdue,
      eeccAmount,
      otherAmountWithoutEECC,
      interest,
      loanAmount,
    } = this.props.resume;

    const { requestMoreInfo } = this.state;
    const { capital, itf, loanLabel } = this.props.resume;
    const { type, frequentContact, panelItemTitle, origin, loan } = this.props;
    let amountFormatted = '';
    if (this.checkLoanAmount(loanAmount)) {
      amountFormatted = Amount.format(loanAmount.quantity, loanAmount.currency);
    }
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    const targetLoanLabel = Sanitizer.getAccountFormattedFromLabel(
      loanLabel,
      loan.loanNumber
    );

    return (
      <View style={styles.boxPadding}>
        <View style={styles.detailContainer}>
          <DetailItem
            label={L.transactionpaymentservices_panelitem_amount}
            accessibilityLabel={'transactionpaymentservices_panelitem_amount'}
            text={amountFormatted}
            style={styles.marginDetail}
          />
          <DetailItem
            label={L.transactionpaymentservices_panelitem_origin_account}
            accessibilityLabel={
              'transactionpaymentservices_panelitem_origin_account'
            }
            text={originLabel}
            style={styles.marginDetail}
          />
          {!!frequentContact && (
            <DetailItem
              label={L.transactionpaymentloan_panelitem_frequent_contact}
              accessibilityLabel={
                'transactionpaymentloan_panelitem_frequent_contact'
              }
              text={frequentContact.alias}
              style={styles.marginDetail}
            />
          )}
          {!!creditAccountHolder && (
            <DetailItem
              label={panelItemTitle}
              accessibilityLabel={'transactionpaymentloan_panelitem_title'}
              text={Sanitizer.titleCase(creditAccountHolder)}
              style={styles.marginDetail}
            />
          )}
          <DetailItem
            label={L.transactionpaymentservices_panelitem_lending}
            accessibilityLabel={'transactionpaymentservices_panelitem_lending'}
            text={targetLoanLabel}
            style={styles.marginDetail}
          />
          {!requestMoreInfo && (
            <DetailItem
              label={L.transactionpaymentservices_panelitem_operation_number}
              accessibilityLabel={
                'transactionpaymentservices_panelitem_operation_number'
              }
              text={operationNumber}
              style={styles.marginDetail}
            />
          )}
          {!requestMoreInfo && (
            <DetailItem
              label={L.transactionpaymentloan_panelitem_date_hour}
              accessibilityLabel={'transactionpaymentloan_panelitem_date_hour'}
              text={moment(
                date,
                L.transactionpaymentloan_date_format_source
              ).format(
                L.paymentsownloansuccessscreen_detailitem_date_output_format
              )}
              style={styles.marginDetail}
            />
          )}
          <ExpandableView
            accessibilityLabel={
              'transactionpaymentloan_panelitem_expandableview'
            }
            onToggle={this.onToggle}
          >
            <DetailItem
              label={L.transactionpaymentloan_capital_label}
              accessibilityLabel={'transactionpaymentloan_capital_label'}
              text={capital}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_interest_label}
              accessibilityLabel={'transactionpaymentloan_interest_label'}
              text={interest}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_overdue_label}
              accessibilityLabel={'transactionpaymentloan_overdue_label'}
              text={overdue}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_bankingstatus}
              accessibilityLabel={'transactionpaymentloan_bankingstatus'}
              text={eeccAmount}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_itf_label}
              accessibilityLabel={'transactionpaymentloan_itf_label'}
              text={itf}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_other_label}
              accessibilityLabel={'transactionpaymentloan_other_label'}
              text={otherAmountWithoutEECC}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_panelitem_transaction_type}
              accessibilityLabel={
                'transactionpaymentloan_panelitem_transaction_type'
              }
              text={type}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_panelitem_transaction_number}
              accessibilityLabel={
                'transactionpaymentloan_panelitem_transaction_number'
              }
              text={operationNumber}
              style={styles.marginDetail}
            />
            <DetailItem
              label={L.transactionpaymentloan_panelitem_date_hour}
              accessibilityLabel={'transactionpaymentloan_panelitem_date_hour'}
              text={moment(
                date,
                L.transactionpaymentloan_date_format_source
              ).format(
                L.paymentsownloansuccessscreen_detailitem_date_output_format
              )}
              style={styles.marginDetail}
            />
          </ExpandableView>
        </View>
      </View>
    );
  }
}
