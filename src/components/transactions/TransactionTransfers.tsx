const moment = require('moment');
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { PanelItem } from '../../components/ui';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import ExchangeRate from './ExchangeRate';

const styles = StyleSheet.create({
  boxPadding: {
    padding: 20,
    paddingBottom: 10,
  } as ViewStyle,
  blockPadding: {
    marginBottom: 10,
  } as ViewStyle,
  descriptionLabelCurrencyExchange: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    lineHeight: 15,
    color: Colors.accent,
  } as TextStyle,
  accentText: {
    ...Font({ weight: 'Black' }),
    fontSize: 20,
    color: Colors.accent,
  } as TextStyle,
  rightText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  leftText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  amountLabelText: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
  } as TextStyle,
});

export interface TransactionTransfersProps {
  panelItemTitle?: string;
  resume?: any;
  type?: string;
  loan?: any;
  origin?: any;
  frequentContact?: any;
}

export interface TransactionTransfersState {}

export default class TransactionTransfers extends React.Component<
  TransactionTransfersProps,
  TransactionTransfersState
> {
  dateValidation = (dateValid: any) => {
    const dateMovement = moment(
      dateValid,
      L.transfersmyaccountssuccessscreen_date_format_source
    );
    if (dateMovement.get('hour') == 0 && dateMovement.get('minute') == 0) {
      return dateMovement.format(
        L.transfersmyaccountssuccessscreen_date_format
      );
    } else {
      return dateMovement.format(
        L.transfersmyaccountssuccessscreen_date_format_constance
      );
    }
  };

  render() {
    const {
      amount,
      currency,
      originLabel,
      targetLabel,
      transaction,
      isSameCurrency,
      currencyLabel,
      debitAmount,
      exchangeRate,
      creditAccountHolder,
      description,
      date,
    } = this.props.resume;
    const { type, frequentContact, panelItemTitle } = this.props;

    return (
      <View style={styles.boxPadding}>
        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_amount'}
          left={
            <View style={styles.blockPadding}>
              <Text style={[styles.leftText, styles.amountLabelText]}>
                {panelItemTitle}
                {'\n'}
                <Text style={[styles.rightText, styles.accentText]}>
                  {Amount.format(amount, currency)}
                </Text>
              </Text>
              {!isSameCurrency && (
                <ExchangeRate
                  accessibilityLabel={
                    'transactionrecord_panelitem_exchangerate'
                  }
                  style={styles.descriptionLabelCurrencyExchange}
                  currencyLabel={currencyLabel}
                  debitAmount={debitAmount}
                  exchangeRate={exchangeRate}
                />
              )}
            </View>
          }
        />
        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_transaction_type'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactionrecord_panelitem_transaction_type}
                {'\n'}
                <Text style={styles.rightText}>{type}</Text>
              </Text>
            </View>
          }
        />
        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_source_account'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactionrecord_panelitem_source_account}
                {'\n'}
                <Text style={styles.rightText}>{originLabel}</Text>
              </Text>
            </View>
          }
        />
        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_target_account'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {creditAccountHolder
                  ? L.transactionrecord_panelitem_target_account
                  : L.transactionrecord_panelitem_target_account_same_holder}
                {'\n'}
                <Text style={styles.rightText}>{targetLabel}</Text>
              </Text>
            </View>
          }
        />
        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_transaction_number'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactionrecord_panelitem_transaction_number}
                {'\n'}
                <Text style={styles.rightText}>{transaction}</Text>
              </Text>
            </View>
          }
        />
        {!!creditAccountHolder && (
          <PanelItem
            accessibilityLabel={'transactionrecord_panelitem_recipient'}
            left={
              <View style={styles.blockPadding}>
                <Text style={styles.leftText}>
                  {L.transactionrecord_panelitem_recipient}
                  {'\n'}
                  <Text style={styles.rightText}>
                    {Sanitizer.titleCase(creditAccountHolder)}
                  </Text>
                </Text>
              </View>
            }
          />
        )}
        {!!frequentContact && (
          <PanelItem
            accessibilityLabel={'transactionrecord_panelitem_frequentcontact'}
            left={
              <View style={styles.blockPadding}>
                <Text style={styles.leftText}>
                  {L.transactionrecord_panelitem_frequent_contact}
                  {'\n'}
                  <Text style={styles.rightText}>{frequentContact.alias}</Text>
                </Text>
              </View>
            }
          />
        )}

        <PanelItem
          accessibilityLabel={'transactionrecord_panelitem_date'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactionrecord_panelitem_date}
                {'\n'}
                <Text style={styles.rightText}>
                  {this.dateValidation(date)}
                </Text>
              </Text>
            </View>
          }
        />
        {!!description && (
          <PanelItem
            accessibilityLabel={'transactionrecord_panelitem_description'}
            left={L.transactionrecord_panelitem_description}
            right={<Text style={styles.rightText}>{description}</Text>}
          />
        )}
      </View>
    );
  }
}
