import * as React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { LoansItem } from '../../api/backend/response/Execute';
import { CardView, ButtonLink, Separator } from '../../components/ui';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { Validate } from '../../resources/functions';
import { StatementType } from '../../resources/constants';
import { Sanitizer } from '../../resources/functions';
import ResumeHeader from './ResumeHeader';
import ResumeBox from './ResumeBox';
import PayButton from './PayButton';
import ResumeBoxStatus from './ResumeBoxStatus';
import API from '../../api';
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
  buttonLink: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
  } as ViewStyle,
  loanResume: {
    width: '25%',
  } as ViewStyle,
});

export interface LoanResumeProps extends ViewProps {
  loan: LoansItem;
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  showPayButton?: boolean;
  shouldShowPayLabel?: boolean;
  isBetweenOfficeHours?: boolean;

}
export interface LoanResumeState {
  paidOut: boolean;
  pastDueInstallments: number;
  pastDueAmount: number;
}
export interface LoanResumeState { }

export default class LoanResume extends React.Component<
  LoanResumeProps,
  LoanResumeState
> {
  static defaultProps = {
    showPayButton: false,
  };

  state: LoanResumeState = {
    paidOut: false,
    pastDueInstallments: 0,
    pastDueAmount: 0,
  };
  componentDidMount() {
    this.showPaidOutLabel();
  }

  getItemByStatement = (i: number, statement: any) => {
    if (
      statement.status === StatementType.Due ||
      statement.status === StatementType.Pending
    ) {
      return {
        statement,
        selected: false,
        enabled: i === 0,
      };
    }
    return null;
  };
  buildFees = (data: any) => {
    const fees = [];

    for (const statement of data.statements) {
      if (
        (statement.status === StatementType.Pending &&
          statement.showPendingFee === 0) ||
        statement.status === StatementType.Due
      ) {
        continue;
      }
      const fee = this.getItemByStatement(0, statement);
      if (fee) {
        fees.push(fee);
        break;
      }
    }

    if (fees.length === 1) {
      fees[0].selected = true;
    }
    return fees;
  };

  showPaidOutLabel = async () => {
    const { loan, shouldShowPayLabel } = this.props;
    const fees = !!loan.fees ? loan.fees : [];
    let paidOut = false;
    if (!!fees.length) {
      const response = await API.Execute.loansListStatements(
        loan.idProduct,
        loan.currency
      );
      const buildFees = this.buildFees(response.body.data);
      const isExpired = Validate.isLoanExpired(loan);

      if (!!shouldShowPayLabel && buildFees.length === 0 && !isExpired) {
        paidOut = true;
      }
    }
    this.setState({ paidOut });
  };
  onPress = () => {
    const { navigation, loan, isBetweenOfficeHours } = this.props;
    navigation.navigate('Loan', { item: loan, isBetweenOfficeHours });
  };
  render() {
    const {
      loan,
      style,
      showPayButton,
      navigation,
      shouldShowPayLabel,
      isBetweenOfficeHours,
      ...props
    } = this.props;
    const { paidOut } = this.state;
    const date = moment(loan.nextFeeDueDate).format(L.loanresume_format_date);
    return (
      <CardView style={style} {...props}>
        <ResumeHeader
          style={styles.content}
          accessibilityLabel={'loanresume_header'}
          title={Sanitizer.cleanProductLabel(loan.shortLabel, loan)}
          subtitle={Amount.format(loan.loanAmount, loan.currency)}
          rightContainer={
            showPayButton &&
            !paidOut && (
              <PayButton
                accessibilityLabel={'loanresume_button_pay'}
                loan={loan}
                navigation={navigation}
                isBetweenOfficeHours={isBetweenOfficeHours}
              />
            )
          }
        >
          <View style={styles.containerItems}>
            <ResumeBox
              accessibilityLabel={'loanresume_label_fee'}
              style={{ width: '25%' }}
              title={L.loanresume_label_fee}
              subtitle={loan.paidFees.toString()}
            />
            <Separator vertical />
            <ResumeBox
              accessibilityLabel={'loanresume_label_amount'}
              style={{ flex: 1 }}
              title={L.loanresume_label_amount}
              subtitle={Amount.format(loan.nextFeeAmount, loan.currency)}
            />
            <Separator vertical />
            {this.state.paidOut ? (
              <ResumeBoxStatus
                accessibilityLabel={'loanresumen_resumeboxstatus_message'}
                imageSource={require('../../assets/images/icon-checked.png')}
                text={L.loanresumen_resumeboxstatus_text_message}
              />
            ) : (
              <ResumeBox
                accessibilityLabel={'loanresume_label_expiration'}
                style={styles.loanResume}
                title={L.loanresume_label_expiration}
                subtitle={date}
              />
            )}
          </View>
          <Separator style={{ width: '100%' }} />
        </ResumeHeader>
        <ButtonLink
          accessibilityLabel={'loanresume_buttonlink_loan'}
          title={L.loanresume_buttonlink_loan}
          accent={'secondary'}
          imageSource={require('../../assets/images/arrow-icon.png')}
          imagePosition={'right'}
          onPress={this.onPress}
          style={styles.buttonLink}
        />
      </CardView>
    );
  }
}
