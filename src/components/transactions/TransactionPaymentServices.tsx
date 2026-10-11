const moment = require('moment');
import * as React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import PanelItem from '../ui/PanelItem';
import PanelItemLeft from './PanelItemLeft';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';

const styles = StyleSheet.create({
  boxPadding: {
    padding: 20,
  } as ViewStyle,
  panelItem: {
    marginBottom: 10,
  } as TextStyle,
});

export interface TransactionPaymentServicesProps {
  resume?: any;
  origin: AccountItemSavingsAll;
}

export interface TransactionPaymentServicesState {}

export default class TransactionPaymentServices extends React.Component<
  TransactionPaymentServicesProps,
  TransactionPaymentServicesState
> {
  checkBillAmount = (loanAmount: string) => {
    return !!loanAmount;
  };

  render() {
    const {
      amount,
      clientName,
      supplyLabel,
      companyName,
      clientCode,
      ticketNumber,
      date,
      operationNumberPayment,
      operationNumberTopaz,
    } = this.props.resume;
    const { origin } = this.props;

    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );

    return (
      <View style={styles.boxPadding}>
        <PanelItem
          accessibilityLabel={'transactionpaymentservices_panelitem_amount'}
          style={styles.panelItem}
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_amount}
              text={amount}
            />
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactionpaymentservices_panelitem_origin_account'
          }
          style={styles.panelItem}
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_origin_account}
              text={originLabel}
            />
          }
        />

        <PanelItem
          accessibilityLabel={'transactionpaymentservices_panelitem_bill_owner'}
          style={styles.panelItem}
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_bill_owner}
              text={clientName}
            />
          }
        />

        <PanelItem
          accessibilityLabel={'transactionpaymentservices_panelitem_company'}
          style={styles.panelItem}
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_company}
              text={companyName}
            />
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactionpaymentservices_panelitem_client_code'
          }
          left={
            <PanelItemLeft
              title={
                L.transactionpaymentservices_panelitem_client_code +
                ' ' +
                supplyLabel
              }
              text={clientCode}
            />
          }
          style={styles.panelItem}
        />

        <PanelItem
          accessibilityLabel={
            'transactionpaymentservices_panelitem_ticket_number'
          }
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_ticket_number}
              text={ticketNumber}
            />
          }
          style={styles.panelItem}
        />

        <PanelItem
          accessibilityLabel={'transactionpaymentservices_panelitem_date'}
          style={styles.panelItem}
          left={
            <PanelItemLeft
              title={L.transactionpaymentservices_panelitem_date}
              text={moment(
                date,
                L.transactionpaymentservices_panelitem_date_input_format
              ).format(
                L.transactionpaymentservices_panelitem_date_output_format
              )}
            />
          }
        />

        <PanelItem
          accessibilityLabel={
            'transactionpaymentservices_panelitem_transaction_number_company'
          }
          left={
            <PanelItemLeft
              title={
                L.transactionpaymentservices_panelitem_transaction_number_company +
                ' ' +
                Sanitizer.titleCase(companyName)
              }
              text={operationNumberPayment}
            />
          }
          style={styles.panelItem}
        />

        <PanelItem
          accessibilityLabel={
            'transactionpaymentservices_panelitem_transaction_number_bank'
          }
          left={
            <PanelItemLeft
              title={
                L.transactionpaymentservices_panelitem_transaction_number_bank
              }
              text={operationNumberTopaz}
            />
          }
        />
      </View>
    );
  }
}
