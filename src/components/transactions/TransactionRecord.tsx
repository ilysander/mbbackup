import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Header, CardView } from '../../components/ui';
import TransactionType from '../../resources/constants/TransactionType';
import TransactionDPF from './TransactionDPF';
import TransactionPaymentLoan from './TransactionPaymentLoan';
import TransactionPaymentServices from './TransactionPaymentServices';
import TransactionTransfers from './TransactionTransfers';
import TransactionTransfersOtherBanks from './TransactionTransfersOtherBanks';

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 0,
    width: '73%',
    alignSelf: 'center',
  } as ViewStyle,
  flags: {
    width: '80%',
    height: 32,
    alignSelf: 'center',
  } as ImageStyle,
});

export interface TransactionRecordProps {
  resume?: any;
  panelItemTitle?: string;
  type?: string;
  panelTitle?: string;
  transactionType?: string;
  origin?: any;
  loan?: any;
  frequentContact?: any;
  style?: StyleProp<ViewStyle>;
}

export interface TransactionRecordState {}

export default class TransactionRecord extends React.Component<
  TransactionRecordProps,
  TransactionRecordState
> {
  static defaultProps = {
    transactionType: TransactionType.TRANSFER,
  };

  render() {
    const {
      resume,
      panelItemTitle,
      type,
      panelTitle,
      transactionType,
      origin,
      loan,
      style,
    } = this.props;
    return (
      <CardView accessibilityLabel={'transactionrecord_cardview'} style={style}>
        <Image
          resizeMode={'stretch'}
          style={styles.flags}
          source={require('../../assets/images/flags-large.png')}
        />
        <Header
          title={panelTitle}
          center
          accessibilityLabel={'instantcashsuccessscreen_header'}
          style={styles.header}
        />
        {transactionType === TransactionType.TRANSFER && (
          <TransactionTransfers
            resume={resume}
            type={type}
            panelItemTitle={panelItemTitle}
          />
        )}
        {transactionType === TransactionType.PAYMENT && (
          <TransactionPaymentLoan
            resume={resume}
            type={type}
            panelItemTitle={panelItemTitle}
            origin={origin}
            loan={loan}
          />
        )}
        {transactionType === TransactionType.PAYMENTSERVICES && (
          <TransactionPaymentServices resume={resume} origin={origin} />
        )}
        {transactionType === TransactionType.TRANSFEROTHERBANKS && (
          <TransactionTransfersOtherBanks
            resume={resume}
            type={type}
            panelItemTitle={panelItemTitle}
            origin={origin}
            loan={loan}
          />
        )}
        {transactionType === TransactionType.DPF && (
          <TransactionDPF
            resume={resume}
            type={type}
            panelItemTitle={panelItemTitle}
            origin={origin}
            loan={loan}
          />
        )}
      </CardView>
    );
  }
}
