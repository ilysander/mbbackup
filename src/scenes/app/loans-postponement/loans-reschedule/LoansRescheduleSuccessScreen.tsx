const moment = require('moment');
import * as React from 'react';
import {
  withFocused,
  FocusedProps,
} from '../../../../components/screen/ScreenContainer';
import {
  View,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  BackHandler,
  TextStyle,
  Text,
} from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Header,
  Button,
  CardView,
  DetailItem,
  FormSteps,
} from '../../../../components/ui';
import Size from '../../../../resources/dimensions/Size';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import { L } from '../../../../resources/language';
import { Font, Sanitizer } from '../../../../resources/functions';
import { Amount } from '../../../../resources/money';
import { Colors, Loan } from '../../../../resources/constants';
import CallMessage from '../../../../components/loans/CallMessage';
import { LoansItem } from '../../../../api/backend/response/Execute';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
  cardView: {
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  flags: {
    width: '80%',
    height: 32,
  } as ImageStyle,
  detailContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  marginButton: {
    marginBottom: 20,
  } as ViewStyle,
  imageMan: {
    alignSelf: 'center',
    width: 149,
    height: 142,
    marginTop: 30,
  } as ImageStyle,
  title: {
    textAlign: 'center',
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 22,
    lineHeight: 35,
    marginTop: 8,
  } as TextStyle,
  subtitle: {
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 16,
    color: Colors.accentDark,
  } as TextStyle,
  headeMain: {
    fontSize: 16,
  } as TextStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  callCenter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  } as ViewStyle,
});
export interface NavigationParams {
  loan: LoansItem;
  amountLoan: string;
  fee: number;
  tcea: number;
  periodGrace: number;
  term: number;
  datePay: string;
  currency: number;
  operationNumber: number;
  operationDate: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }
class LoansRescheduleSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.loansreschedulesuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  //   header: (props: HeaderProps) => {
  //     return <HeaderMain styleTitle={styles.headeMain} {...props} />;
  //   },
  // };

  shareView!: ShareReceipt | null;

  componentDidMount() {
    this.generateDataReceipt();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => {
    this.goToLoansHome();
    return true;
  };
  goToLoansHome = () => {
    const { navigation } = this.props;
    navigation.push('LoansHome');
  };

  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.loansreschedulesuccessscreen_share_header_title
      );
  };

  generateDataReceipt = () => {
    const { route } = this.props;
    const loan = route.params && route.params.loan;
    const amountLoan = route.params && route.params.amountLoan;
    const fee = route.params && route.params.fee;
    const tcea = route.params && route.params.tcea;
    const periodGrace = route.params && route.params.periodGrace;
    const term = route.params && route.params.term;
    const datePay = route.params && route.params.datePay;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;

    const date = moment(
      datePay,
      L.loansrescheduleverifyscreen_input_format_date
    ).format(L.loansrescheduleverifyscreen_output_format_date);

    const operation = moment(
      operationDate,
      L.loansreschedulesuccessscreen_resume_date_input_format
    ).format(L.loansreschedulesuccessscreen_resume_date_output_format);

    const content: ShareReceiptItem[] = [
      {
        title: L.loansreschedulesuccessscreen_resume_title1,
        details: [Sanitizer.cleanProductLabel(loan.shortLabel, loan)],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title2,
        details: [Amount.format(amountLoan, currency.toString())],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title3,
        details: [Amount.format(fee, currency.toString())],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title4,
        details: [`${tcea}%`],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title5,
        details: [Loan.PeriodsGrace[periodGrace].title],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title6,
        details: [Loan.Terms[term].title],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title7,
        details: [date],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title8,
        details: [operationNumber],
      },
      {
        title: L.loansreschedulesuccessscreen_resume_title9,
        details: [operation],
      },
    ];

    return content;
  };

  render() {
    const { isFocused, route } = this.props;


    const loan = route.params && route.params.loan;
    const amountLoan = route.params && route.params.amountLoan;
    const fee = route.params && route.params.fee;
    const tcea = route.params && route.params.tcea;
    const periodGrace = route.params && route.params.periodGrace;
    const term = route.params && route.params.term;
    const datePay = route.params && route.params.datePay;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;



    const content = this.generateDataReceipt();

    const date = moment(
      datePay,
      L.loansrescheduleverifyscreen_input_format_date
    )
      .format(L.loansrescheduleverifyscreen_output_format_date)
      .toLowerCase();

    const operation = moment(
      operationDate,
      L.loansreschedulesuccessscreen_resume_date_input_format
    ).format(L.loansreschedulesuccessscreen_resume_date_output_format);

    return (
      <Container>
        <FormSteps total={4} current={4} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Image
                source={require('../../../../assets/images/adn-man-pointing.png')}
                resizeMode={'contain'}
                style={styles.imageMan}
              />
              <Header
                center
                accessibilityLabel={'loansreschedulemessagescreen_header'}
                title={L.loansreschedulesuccessscreen_header_title}
                titleStyle={styles.title}
                subtitleContainer={
                  <View>
                    <Text style={styles.subtitle}>
                      {L.loansreschedulesuccessscreen_header_subtitle1}
                      <Text>
                        {L.loansreschedulesuccessscreen_header_subtitle2}
                      </Text>
                    </Text>
                  </View>
                }
              />
              <CardView style={styles.cardView}>
                <Image
                  resizeMode={'stretch'}
                  style={styles.flags}
                  source={require('../../../../assets/images/flags-large.png')}
                />
                <Header
                  center
                  title={L.loansreschedulesuccessscreen_card_title}
                  accessibilityLabel={'loansreschedulesuccessscreen_header'}
                  style={styles.header}
                />
                <View style={styles.detailContainer}>
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title1}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_nameloan'
                    }
                    text={Sanitizer.cleanProductLabel(loan.shortLabel, loan)}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title2}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_amountloan'
                    }
                    text={Amount.format(amountLoan, currency.toString())}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title3}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_fee'
                    }
                    text={Amount.format(fee, currency.toString())}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title4}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_tcea'
                    }
                    text={`${tcea}%`}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title5}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_periodgrace'
                    }
                    text={Loan.PeriodsGrace[periodGrace].title}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title6}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_term'
                    }
                    text={Loan.Terms[term].title}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title7}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_datetime'
                    }
                    text={date}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title8}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_operation'
                    }
                    text={operationNumber.toString()}
                    style={styles.marginDetail}
                  />
                  <DetailItem
                    label={L.loansreschedulesuccessscreen_resume_title9}
                    accessibilityLabel={
                      'loansreschedulesuccessscreen_label_datetimeoperation'
                    }
                    text={operation}
                    style={styles.marginDetail}
                  />
                </View>
              </CardView>
              <CallMessage style={styles.callCenter} />
              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={
                    'loansreschedulesuccessscreen_button_share'
                  }
                  light
                  onPress={this.share}
                  title={L.loansreschedulesuccessscreen_button_share_title}
                  style={styles.marginButton}
                  textStyle={styles.textButton}
                />
                <Button
                  accessibilityLabel={'loansreschedulesuccessscreen_button_end'}
                  onPress={this.goToLoansHome}
                  title={L.loansreschedulesuccessscreen_button_end_title}
                  style={styles.marginButton}
                  textStyle={styles.textButton}
                />
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.loansreschedulesuccessscreen_shareconstance_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansRescheduleSuccessScreenType = LoansRescheduleSuccessScreen;
export default withFocused<LoansRescheduleSuccessScreen, Props>(
  LoansRescheduleSuccessScreen
);
