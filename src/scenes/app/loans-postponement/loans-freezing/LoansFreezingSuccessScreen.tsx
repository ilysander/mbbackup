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
  InfoMessage,
} from '../../../../components/ui';
import Size from '../../../../resources/dimensions/Size';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import { L } from '../../../../resources/language';
import {
  LoansItem,
  LoansItemFeeComplete,
} from '../../../../api/backend/response/Execute';
import { Font, Sanitizer } from '../../../../resources/functions';
import { Amount } from '../../../../resources/money';
import { Colors } from '../../../../resources/constants';
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
  infoMessageMessage: {
    marginBottom: 20,
    backgroundColor: Colors.white,
  } as ViewStyle,
  infoMessagePhone: {
    marginBottom: 10,
    backgroundColor: Colors.white,
  } as ViewStyle,
  textInfoPhone: {
    color: Colors.secondary,
    textAlign: 'center',
    padding: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,
  textInfoMessage: {
    color: Colors.accentDark,
    lineHeight: 15,
  } as TextStyle,
  textInfo: {
    fontSize: 13,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  textInfoBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  amountLoan: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  detailLoan: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
});
export interface NavigationParams {
  loan: LoansItem;
  feesFreezing: LoansItemFeeComplete[];
  numberCredit: number;
  tcea: number;
  currency: number;
  operationNumber: number;
  operationDate: string;
  phone: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }
class LoansFreezingSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.loansfreezingsuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
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
        L.loansfreezingsuccessscreen_share_header_title
      );
  };

  generateDataReceipt = () => {
    const { route } = this.props;
    const loan = route.params && route.params.loan;
    const feesFreezing = route.params && route.params.feesFreezing;
    const numberCredit = route.params && route.params.numberCredit;
    const tcea = route.params && route.params.tcea;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;

    const nroFeeFreezing = feesFreezing.length;
    const monthsFreezing = feesFreezing
      .map((feeFreezing: any) => {
        return feeFreezing.nameMonth;
      })
      .join(', ');

    const content: ShareReceiptItem[] = [
      {
        title: L.loansfreezingsuccessscreen_resume_title1,
        details: [
          `${Sanitizer.cleanProductLabel(
            loan.shortLabel,
            loan
          )} - ${Amount.format(loan.loanAmount, currency.toString())}`,
        ],
      },
      {
        title: L.loansfreezingsuccessscreen_resume_title2,
        details: [numberCredit],
      },
      {
        title:
          nroFeeFreezing > 1
            ? L.loansfreezingsuccessscreen_resume_plural_title3
            : L.loansfreezingsuccessscreen_resume_singular_title3,
        details: [monthsFreezing],
      },
      {
        title: L.loansfreezingsuccessscreen_resume_title4,
        details: [`${tcea}%`],
      },
      {
        title: L.loansfreezingsuccessscreen_resume_title5,
        details: [operationNumber],
      },
      {
        title: L.loansfreezingsuccessscreen_resume_title6,
        details: [
          moment(
            operationDate,
            L.loansfreezingsuccessscreen_resume_date_input_format
          ).format(L.loansfreezingsuccessscreen_resume_date_output_format),
        ],
      },
    ];

    return content;
  };

  render() {
    const { isFocused, route } = this.props;
    const content = this.generateDataReceipt();

    const loan = route.params && route.params.loan;
    const phone = route.params && route.params.phone;
    const feesFreezing = route.params && route.params.feesFreezing;
    const numberCredit = route.params && route.params.numberCredit;
    const tcea = route.params && route.params.tcea;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;


    if (!feesFreezing.length) {
      return;
    }
    const nroFeeFreezing = feesFreezing.length;
    const monthsFreezing = feesFreezing
      .map((feeFreezing: any) => {
        return feeFreezing.nameMonth;
      })
      .join(', ');

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
                title={L.loansfreezingsuccessscreen_header_title}
                titleStyle={styles.title}
                subtitleContainer={
                  <View>
                    <Text style={styles.subtitle}>
                      {L.loansfreezingsuccessscreen_header_subtitle1}
                      <Text>
                        {L.loansfreezingsuccessscreen_header_subtitle2}
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
                  title={L.loansfreezingsuccessscreen_card_title}
                  accessibilityLabel={'loansfreezingsuccessscreen_header'}
                  style={styles.header}
                />
                {!!loan && (
                  <View style={styles.detailContainer}>
                    <DetailItem
                      label={L.loansfreezingsuccessscreen_resume_title1}
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_nameloan'
                      }
                      style={styles.marginDetail}
                    >
                      <View style={styles.amountLoan}>
                        <Text style={styles.detailLoan}>
                          {`${Sanitizer.cleanProductLabel(
                            loan.shortLabel,
                            loan
                          )} - `}
                        </Text>
                        <Text style={styles.detailLoan}>
                          {!!loan &&
                            Amount.format(loan.loanAmount, currency.toString())}
                        </Text>
                      </View>
                    </DetailItem>
                    <DetailItem
                      label={L.loansfreezingsuccessscreen_resume_title2}
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_operation'
                      }
                      text={numberCredit.toString()}
                      style={styles.marginDetail}
                    />

                    <DetailItem
                      label={
                        nroFeeFreezing > 1
                          ? L.loansfreezingsuccessscreen_resume_plural_title3
                          : L.loansfreezingsuccessscreen_resume_singular_title3
                      }
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_feefreezing'
                      }
                      text={monthsFreezing}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansfreezingsuccessscreen_resume_title4}
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_tcea'
                      }
                      text={`${tcea}%`}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansfreezingsuccessscreen_resume_title5}
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_operation'
                      }
                      text={operationNumber.toString()}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansfreezingsuccessscreen_resume_title6}
                      accessibilityLabel={
                        'loansfreezingsuccessscreen_label_datetimeoperation'
                      }
                      text={moment(
                        operationDate,
                        L.loansfreezingsuccessscreen_resume_date_input_format
                      ).format(
                        L.loansfreezingsuccessscreen_resume_date_output_format
                      )}
                      style={styles.marginDetail}
                    />
                  </View>
                )}
              </CardView>
              <InfoMessage
                accessibilityLabel={'loansrescheduleconfirmscreen_infomessage'}
                style={styles.infoMessageMessage}
                typeColor={'secondary'}
                isMessage={false}
                showImage={true}
                isCustomMessage
                customMessage={
                  <View>
                    <Text style={[styles.textInfo, styles.textInfoPhone]}>
                      {L.loansfreezingsuccessscreen_first_infoMessage_text1}
                      <Text style={styles.textInfoBold}>{phone}</Text>
                      {nroFeeFreezing > 1
                        ? L.loansfreezingsuccessscreen_first_plural_infoMessage_text1
                        : L.loansfreezingsuccessscreen_first_singular_infoMessage_text1}
                    </Text>
                  </View>
                }
              />
              <InfoMessage
                accessibilityLabel={'loansrescheduleconfirmscreen_infomessage'}
                style={styles.infoMessagePhone}
                typeColor={'accentDark'}
                isMessage={false}
                isCustomMessage
                customMessage={
                  <View>
                    <Text style={[styles.textInfo, styles.textInfoMessage]}>
                      {L.loansfreezingsuccessscreen_second_infoMessage_text1}
                      <Text style={styles.textInfoBold}>
                        {L.loansfreezingsuccessscreen_second_infoMessage_text2}
                      </Text>
                      {L.loansfreezingsuccessscreen_second_infoMessage_text3}
                    </Text>
                  </View>
                }
              />
              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'loansfreezingsuccessscreen_button_share'}
                  light
                  onPress={this.share}
                  title={L.loansfreezingsuccessscreen_button_share_title}
                  style={styles.marginButton}
                  textStyle={styles.textButton}
                />
                <Button
                  accessibilityLabel={'loansfreezingsuccessscreen_button_end'}
                  onPress={this.goToLoansHome}
                  title={L.loansfreezingsuccessscreen_button_end_title}
                  style={styles.marginButton}
                  textStyle={styles.textButton}
                />
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.loansfreezingsuccessscreen_shareconstance_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansFreezingSuccessScreenType = LoansFreezingSuccessScreen;
export default withFocused<LoansFreezingSuccessScreen, Props>(
  LoansFreezingSuccessScreen
);
