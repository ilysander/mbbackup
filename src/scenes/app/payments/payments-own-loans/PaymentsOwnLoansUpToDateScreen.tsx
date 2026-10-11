const moment = require('moment');
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import InfoContact from '../../../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Happy,
  CardView,
} from '../../../../components/ui';
import { Colors, StatementType } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Linking } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Amount } from '../../../../resources/money';
import Config from '../../../../Config';
import Log from '../../../../resources/log/Log';
import Features from '../../../../resources/remote/Features';
import LoanResume from '../../../../components/loans/LoanResume';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  descriptionText: {
    ...Font({ weight: 'Medium' }),
    textAlign: 'left',
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  networkStatus: {
    marginTop: 0,
    marginBottom: 10,
  } as ViewStyle,
  titleStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  subtitleStyle: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  loanStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  happy: {
    width: Size.getWidth(),
  } as ViewStyle,
  descriptionContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
  } as ViewStyle,
  infoContact: { paddingBottom: 10 } as ViewStyle,
  containerGoToWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  } as ViewStyle,
  containerButtonGoToWeb: {
    marginLeft: 10,
  } as ViewStyle,
  containerLabelGoToWeb: { flex: 1 } as ViewStyle,
  button: {
    borderRadius: 15,
  } as ViewStyle,
  contentHappy: {
    paddingTop: 50,
    paddingBottom: 40,
    position: 'relative',
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  loan?: any;
  currency?: any;
  fee?: any;
}

const TAG = '[PaymentsOwnLoansUpToDateScreen]';
class PaymentsOwnLoansUpToDateScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsscreen_title,
  // };
  state: State = {
    loan: undefined,
  };

  componentDidMount() {
    this.load();
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };
  getDescription = () => {
    const { currency, loan } = this.state;

    const date = moment(loan.nextFeeDueDate)
      .subtract(1, 'M')
      .add(1, 'd')
      .format(L.paymentsownloansuptodatescreen_description_date_format);
    return (
      <Text
        accessibilityLabel={'paymentsownloansuptodatescreen_description'}
        style={styles.descriptionText}
      >
        {`${L.paymentsownloansuptodatescreen_description_part1} ${date}, ${L.paymentsownloansuptodatescreen_description_part2
          } ${L.paymentsownloansuptodatescreen_description_part3
          }  ${Amount.format(loan.nextFeeAmount, currency)} ${L.paymentsownloansuptodatescreen_description_part4
          }`}
      </Text>
    );
  };

  nextFee = (fees: any[]) => {
    return (
      fees.find(
        fee => fee.status === StatementType.Pending && fee.showPendingFee === 0
      ) || undefined
    );
  };

  load = async () => {
    const { route } = this.props;

    const loan = route.params && route.params.loan;
    const fees = route.params && route.params.fees;
    const currency = route.params && route.params.currency;

    const fee = this.nextFee(fees);
    this.setState({ loan, fee, currency });
  };

  goToLoanPayments = async () => {
    try {
      await Linking.openURL(Config.settings.loanPaymentsUrl);
    } catch (e) {
      Log.debug(TAG, 'goToLoanPayments', e);
    }
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { loan } = this.state;
    const isAllowedPaymentsOwnLoansWeb = Features.isAllowedTo(
      'PaymentsOwnLoansWeb'
    );

    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical={false}>
              <NetworkStatusAlert style={styles.networkStatus} />
            </Content>
            <Happy
              accessibilityLabel={'paymentsownloanssuccessscreen_happy'}
              title={L.paymentsownloansuptodatescreen_title}
              subtitle={L.paymentsownloansuptodatescreen_subtitle}
              style={styles.happy}
              contentStyle={styles.contentHappy}
            />
            <Content vertical={false}>
              {!!loan && (
                <>
                  <LoanResume
                    style={styles.cardView}
                    navigation={navigation}
                    loan={loan}
                    accessibilityLabel={
                      'paymentsownloanssuccessscreen_loanresume'
                    }
                  />
                  <CardView
                    padding
                    style={[styles.cardView, styles.descriptionContainer]}
                  >
                    {this.getDescription()}
                  </CardView>
                </>
              )}
              <CardView
                padding
                style={[
                  styles.cardView,
                  styles.infoContact,
                  isAllowedPaymentsOwnLoansWeb && { marginBottom: 40 },
                ]}
              >
                <InfoContact
                  navigate={navigation.navigate}
                  accessibilityLabel={
                    'paymentsownloansuptodatescreen_infocontact'
                  }
                  style={{ alignItems: 'flex-start' }}
                  title={L.paymentsownloansuptodatescreen_infocontact_title}
                  subtitle={
                    L.paymentsownloansuptodatescreen_infocontact_subtitle
                  }
                  titleStyle={styles.titleStyle}
                  subtitleStyle={styles.subtitleStyle}
                />
              </CardView>
              {isAllowedPaymentsOwnLoansWeb && (
                <CardView padding style={styles.containerGoToWeb}>
                  <View style={styles.containerLabelGoToWeb}>
                    <Text style={styles.loanStyle}>
                      {L.paymentsownloansuptodatescreen_label_cancelloan}
                    </Text>
                  </View>
                  <View style={styles.containerButtonGoToWeb}>
                    <Button
                      typeColor={'primary'}
                      small
                      accessibilityLabel={
                        'paymentsownloansuptodatescreen_button_pay_all_loan'
                      }
                      title={
                        L.paymentsownloansuptodatescreen_button_pay_all_loan
                      }
                      onPress={this.goToLoanPayments}
                      style={styles.button}
                    />
                  </View>
                </CardView>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsOwnLoansUpToDateScreenType = PaymentsOwnLoansUpToDateScreen;
export default withFocused<PaymentsOwnLoansUpToDateScreen, Props>(
  PaymentsOwnLoansUpToDateScreen
);
