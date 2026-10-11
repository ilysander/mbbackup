const moment = require('moment');
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { PanelItem } from '../../components/ui';
import { Colors, Currencies } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import DetailList from './DetailList';
import ExchangeRate from './ExchangeRate';
import PanelItemLeft from './PanelItemLeft';

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
  panelItem: {
    paddingBottom: 5,
  } as TextStyle,
});

export interface TransactionTransfersOtherBanksProps {
  panelItemTitle?: string;
  resume?: any;
  type?: string;
  loan?: any;
  origin?: any;
}

export interface TransactionTransfersOtherBanksState {}

export default class TransactionTransfersOtherBanks extends React.Component<
  TransactionTransfersOtherBanksProps,
  TransactionTransfersOtherBanksState
> {
  render() {
    const {
      currency,
      targetLabel,
      transaction,
      isSameCurrency,
      currencyLabel,
      debitAmount,
      exchangeRate,
      creditAccountHolder,
      description,
      date,
      beneficiary,
      bankName,
      loanCurrency,
      itf,
      mibancoComission,
      interbankComission,
      requestedAmount,
      totalAmount,
      frequentContact,
    } = this.props.resume;
    const { type, panelItemTitle, origin } = this.props;

    const elements = [
      {
        element: requestedAmount,
        currency: loanCurrency,
        label: L.transactiontransfersotherbanks_requestedamount_label,
      },
      {
        element: interbankComission,
        currency: loanCurrency,
        label: L.transactiontransfersotherbanks_interbankcomission_label,
        alwaysVisible: true,
      },
      {
        element: mibancoComission,
        currency: loanCurrency,
        label: L.transactiontransfersotherbanks_mibancocomission_label,
        alwaysVisible: true,
      },
      {
        element: itf,
        currency: loanCurrency,
        label: L.transactiontransfersotherbanks_itf_label,
      },
    ];
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    return (
      <View style={styles.boxPadding}>
        <PanelItem
          accessibilityLabel={'transactiontransfersotherbanks_panelitem_amount'}
          left={
            <View style={styles.blockPadding}>
              <Text style={[styles.leftText, styles.amountLabelText]}>
                {panelItemTitle}
                {'\n'}
                <Text style={[styles.rightText, styles.accentText]}>
                  {Amount.format(totalAmount, currency)}
                </Text>
              </Text>
              {!isSameCurrency && (
                <ExchangeRate
                  accessibilityLabel={
                    'transactiontransfersotherbanks_panelitem_exchangerate'
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
          accessibilityLabel={'transactiontransfersotherbanks_panelitem_detail'}
          left={
            <PanelItemLeft
              blockStyle={styles.panelItem}
              text={<DetailList elements={elements} />}
            />
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactiontransfersotherbanks_panelitem_transaction_type'
          }
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactiontransfersotherbanks_panelitem_transaction_type}
                {'\n'}
                <Text style={styles.rightText}>{type}</Text>
              </Text>
            </View>
          }
        />
        <PanelItem
          accessibilityLabel={
            'transactiontransfersotherbanks_panelitem_source_account'
          }
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactiontransfersotherbanks_panelitem_source_account}
                {'\n'}
                <Text style={styles.rightText}>{originLabel}</Text>
              </Text>
            </View>
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactiontransfersotherbanks_panelitem_interbank_account'
          }
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {currency === Currencies.PEN.label
                  ? L.transactiontransfersotherbanks_panelitem_interbank_account_pen
                  : L.transactiontransfersotherbanks_panelitem_interbank_account_usd}
                {'\n'}
                <Text style={styles.rightText}>
                  {bankName}
                  {'\n'}
                  {Sanitizer.formatTextCCI(targetLabel)}
                </Text>
              </Text>
            </View>
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactiontransfersotherbanks_panelitem_beneficiary'
          }
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactiontransfersotherbanks_panelitem_beneficiary}
                {'\n'}
                <Text style={styles.rightText}>
                  {Sanitizer.titleCase(beneficiary)}
                </Text>
              </Text>
            </View>
          }
        />
        {!!frequentContact && (
          <PanelItem
            accessibilityLabel={
              'transactiontransfersotherbanks_panelitem_frequent_contact'
            }
            left={
              <View style={styles.blockPadding}>
                <Text style={styles.leftText}>
                  {L.transactiontransfersotherbanks_panelitem_frequent_contact}
                  {'\n'}
                  <Text style={styles.rightText}>{frequentContact}</Text>
                </Text>
              </View>
            }
          />
        )}
        <PanelItem
          accessibilityLabel={
            'transactiontransfersotherbanks_panelitem_transaction_number'
          }
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactiontransfersotherbanks_panelitem_transaction_number}
                {'\n'}
                <Text style={styles.rightText}>{transaction}</Text>
              </Text>
            </View>
          }
        />
        {!!creditAccountHolder && (
          <PanelItem
            accessibilityLabel={
              'transactiontransfersotherbanks_panelitem_recipient'
            }
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

        <PanelItem
          accessibilityLabel={'transactiontransfersotherbanks_panelitem_date'}
          left={
            <View style={styles.blockPadding}>
              <Text style={styles.leftText}>
                {L.transactiontransfersotherbanks_panelitem_date}
                {'\n'}
                <Text style={styles.rightText}>
                  {moment(
                    date,
                    L.transactiontransfersotherbanks_date_format_source
                  ).format(L.transactiontransfersotherbanks_date_format)}
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
