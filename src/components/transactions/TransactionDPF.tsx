const moment = require('moment');
import * as React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import DetailList from '../../components/transactions/DetailList';
import { DetailItem, PanelItem } from '../../components/ui';
import { Colors, FrequencyDeposit } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';

const styles = StyleSheet.create({
  boxPadding: {
    padding: 20,
    paddingBottom: 10,
  } as ViewStyle,
  blockPadding: {
    marginBottom: 10,
  } as ViewStyle,
  accentText: {
    ...Font({ weight: 'Black' }),
    fontSize: 20,
    color: Colors.accent,
  } as TextStyle,
  accentLabelText: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 14,
  } as ViewStyle,
  valueText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  titleText: {
    ...Font(),
    fontSize: 13,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
});

export interface TransactionDPFProps {
  panelItemTitle?: string;
  resume?: any;
  type?: string;
  loan?: any;
  origin?: any;
}

export interface TransactionDPFState {}

export default class TransactionDPF extends React.Component<
  TransactionDPFProps,
  TransactionDPFState
> {
  render() {
    const {
      currency,
      transaction,
      date,
      totalAmount,
      creditAccountLabel,
      debitAccountLabel,
      term,
      trea,
      returnDate,
      frequency,
      totalPaymentInterest,
    } = this.props.resume;
    const { panelItemTitle } = this.props;
    const elements = [
      {
        element: trea,
        currency: false,
        label: L.transactiondpf_trea_label.toUpperCase(),
      },
    ];
    const termFormatted = `${term} ${L.transactiondpf_panelitem_period_label.toLowerCase()}`;
    const returnDateFormatted = `${moment(
      returnDate,
      L.transactiondpf_date_of_deposit_format_source
    ).format(L.transactiondpf_date_of_deposit_format)}`;
    const detailItemList = [
      {
        label: panelItemTitle,
        accessibilityLabel: 'transactiondpf_title',
        text: Amount.format(totalAmount, currency),
        styleLabel: [styles.titleText, styles.accentLabelText],
        styleText: [styles.valueText, styles.accentText],
      },
      {
        accessibilityLabel: 'transactiondpf_list_detail',
        style: [styles.blockPadding],
        styleLabel: styles.titleText,
        styleText: [styles.valueText, styles.accentText],
        optional: true,
      },
      {
        label: L.transactiondpf_panelitem_term_of_deposit_label,
        accessibilityLabel: 'transactiondpf_panelitem_term_of_deposit_label',
        text: termFormatted,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        label: L.transactiondpf_panelitem_date_of_deposit_label,
        accessibilityLabel: 'transactiondpf_panelitem_date_of_deposit_label',
        text: returnDateFormatted,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        label:
          L.transactiondpf_panelitem_frequency_of_deposit_of_interest_label,
        accessibilityLabel:
          'transactiondpf_panelitem_frequency_of_deposit_of_interest_label',
        text:
          FrequencyDeposit.AtTheEnd === frequency
            ? L.transactiondpf_text_frequency_of_deposit_of_interest_label
            : L.transactiondpf_text_frequency_deposit_every_month,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        label: L.transactiondpf_panelitem_interest_label,
        accessibilityLabel: 'transactiondpf_panelitem_interest_label',
        text: Amount.format(totalPaymentInterest, currency),
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        accessibilityLabel: 'transactiondpf_panelitem_origin_account_label',
        label: L.transactiondpf_panelitem_origin_account_label,
        text: creditAccountLabel,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        accessibilityLabel:
          'transactiondpf_panelitem_destination_account_label',
        label: L.transactiondpf_panelitem_destination_account_label,
        text: debitAccountLabel,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        accessibilityLabel: 'transactiondpf_panelitem_transaction_number',
        label: L.transactiondpf_panelitem_transaction_number,
        text: transaction,
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
      {
        accessibilityLabel: 'transactiondpf_panelitem_date',
        label: L.transactiondpf_panelitem_date,
        text: moment(
          date,
          L.transactiondpf_transaction_date_format_source
        ).format(L.transactiondpf_transaction_date_format),
        style: styles.blockPadding,
        styleLabel: styles.titleText,
        styleText: styles.valueText,
      },
    ];

    return (
      <View style={styles.boxPadding} collapsable={false}>
        {detailItemList.map((item, index) => {
          return (
            <PanelItem
              accessibilityLabel={item.accessibilityLabel}
              style={{ alignItems: 'flex-start' }}
              key={index.toString()}
            >
              {item.optional ? (
                <DetailItem key={index} {...item} style={{ marginBottom: 10 }}>
                  <DetailList elements={elements} />
                </DetailItem>
              ) : (
                <DetailItem key={index} {...item} />
              )}
            </PanelItem>
          );
        })}
      </View>
    );
  }
}
