import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
  Header,
  ButtonLink,
} from '../../../components/ui';
import {Size} from '../../../resources/dimensions';
import {L} from '../../../resources/language';
import Config from '../../../Config';
import {Validate, Linking, Font} from '../../../resources/functions';
import Log from '../../../resources/log/Log';
import {Emitter} from '../../../resources/listeners';
import {AlertEvent} from '../../../components/alert/AlertManager';
import API from '../../../api';
import {
  LoansItem,
  ContentCreditLine,
  DigitalProductOptions,
  PreferencesUserDataModifyPreResponse,
} from '../../../api/backend/response/Execute';
import LoanResume from '../../../components/loans/LoanResume';
import BannerInstantCash from '../../../components/loans/BannerInstantCash';
import AdReschedule from '../../../components/loans/AdReschedule';
import {Colors, ErrorRequest} from '../../../resources/constants/index';
import BannerGenericLoan from '../../../components/loans/BannerGenericLoan';
import ModalLoanInfoResume from '../../../components/loans/ModalLoanInfoResume';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreensLabels as Label} from '../../../resources/analytics';

const moment = require('moment');

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  loanResume: {
    marginBottom: 20,
  } as ViewStyle,
  loansContainer: {
    marginTop: 10,
  } as ViewStyle,
  banner: {
    marginBottom: 20,
  } as ViewStyle,
  genericBanner: {
    marginBottom: 15,
    borderColor: Colors.transparent,
    paddingVertical: 0,
  } as ViewStyle,
  header: {
    marginTop: 10,
  } as ViewStyle,
  dashedContainer: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 50,
    marginVertical: 20,
  } as ViewStyle,
  textDescription: {
    ...Font(),
    color: Colors.grey4,
  } as TextStyle,
  adReschedule: {
    paddingVertical: 10,
  } as ViewStyle,
  titleLoanInfo: {
    color: Colors.brown,
    ...Font({weight: 'SemiBold'}),
    fontSize: 14,
    textAlign: 'left',
  } as TextStyle,
  loanInfo: {
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingLeft: 0,
  } as ViewStyle,
  buttonHelp: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: Colors.brown,
    marginLeft: 5,
  } as ImageStyle,
  buttonLink: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, any>;
  isLoanPostponement?: boolean;
}

export interface State {
  isLoading: boolean;
  isLoadingCreditline: boolean;
  isBetweenOfficeHours: boolean;
  loans: LoansItem[];
  hasCreditLine: boolean;
  bannerLoaded: boolean;
  loansLoaded: boolean;
  creditLine?: ContentCreditLine;
  hasManyAmountOption: boolean;
  profileCreditline?: PreferencesUserDataModifyPreResponse;
}

const TAG = '[LoansScreen]';
class LoansScreen extends React.Component<Props & FocusedProps, State> {
  static defaultProps = {
    isLoanPostponement: false,
  };

  state: State = {
    isLoading: false,
    isLoadingCreditline: false,
    isBetweenOfficeHours: false,
    loans: [],
    hasCreditLine: false,
    bannerLoaded: false,
    loansLoaded: false,
    hasManyAmountOption: false,
  };

  banner!: BannerInstantCash | null;
  genericBanner!: BannerGenericLoan | null;
  private modalLoanInfoResume!: ModalLoanInfoResume | null;

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  isBetweenOfficeHours = (date: string) => {
    const parsedDate = moment(date).utcOffset(Config.settings.countryTimezone);
    return (
      parsedDate.isoWeekday() !== 7 &&
      Validate.isBetweenHours(
        date,
        Config.settings.startTimePayments,
        Config.settings.endTimePayments,
      )
    );
  };

  load = async () => {
    const {isLoading} = this.state;
    const {navigation} = this.props;

    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    this.setState({
      isLoading: true,
      creditLine: undefined,
      profileCreditline: undefined,
    });
    navigation.setParams({isLoanPostponement: false});
    try {
      const response = await API.Execute.widgetsProducts();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const isBetweenOfficeHours = this.isBetweenOfficeHours(
        response.headers.date || response.headers.Date,
      );
      const {loans: loansMap} = response.body.data.productMap;
      const loans = loansMap.products;

      const isLoanPostponement = !!loans.length
        ? Validate.validateLoansPostponement(loans)
        : false;

      navigation.setParams({isLoanPostponement});

      this.setState({loans, isBetweenOfficeHours, loansLoaded: true}, () => {
        this.validateCreditLine();
      });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }

    this.setState({isLoading: false});
  };

  goToLocation = () => {
    this.props.navigation.navigate('Location', {
      shouldGoBack: true,
    });
  };

  goToKindOfLoans = async () => {
    try {
      await Linking.openURL(Config.settings.loanInfoUrl);
    } catch (e) {
      Log.debug(TAG, 'goToKindOfLoans', e);
    }
  };
  validateCreditLine = async () => {
    const {loans} = this.state;

    const creditObj = await this.getCreditLine();
    const {creditLine} = creditObj;
    if (!creditLine && loans.length === 0) {
      const {navigation} = this.props;
      navigation.replace('EmptyLoans');
      return;
    }
  };

  getCreditLine = async () => {
    try {
      const response = await API.Execute.creditlineDisplay();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.data) {
        const list = response.body.data.contentList || [];
        const creditLine = list.length > 0 ? list[0] : undefined;
        if (!creditLine) {
          Log.info(TAG, 'load', 'no creditLine');
        }
        if (creditLine) {
          let user;
          try {
            const response = await API.Execute.preferencesUserDataModifyPre();
            if (!Validate.validateStatusCode(response.status)) {
              Log.withStatusCode(TAG, 'load', response);
            }
            user = response.body.data;
          } catch (e) {
            Emitter.emit<AlertEvent>('onAlert', {
              tag: TAG,
              method: 'load',
              e,
            });
          }

          this.setState({
            creditLine,
            isLoadingCreditline: true,
            profileCreditline: user,
          });
          this.hasNewProduct(creditLine);
          return {
            creditLine,
            isLoadingCreditline: true,
          };
        }
      }
    } catch (e) {
      Log.info(TAG, 'load', e);
      this.setState({isLoadingCreditline: true});
    }
    return {
      creditLine: undefined,
      isLoadingCreditline: false,
    };
  };

  hasNewProduct = async (creditLine: ContentCreditLine) => {
    const instacashType = Validate.instantCashType(creditLine);
    const hasNewProduct = instacashType ? instacashType.code === 3 : false;
    if (!hasNewProduct) {
      return;
    }

    try {
      const response = await API.Execute.loanrequestListChips();

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadListOptions', response);
      }
      const body = response.body;
      const data = body.data as DigitalProductOptions;
      const hasManyAmountOption = data.amountOptions.length > 1 ? true : false;
      if (body.code === API.ResponseCode.OK) {
        this.setState({hasManyAmountOption});
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'loadListOptions',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'loadListChips', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadListChips',
        e,
      });
    }
  };

  onInfoPress = () => {
    this.modalLoanInfoResume?.showPanel();
  };

  closeModalLoanInfo = async () => {
    this.modalLoanInfoResume?.dismissPanel();
  };

  goOpenAccount = async () => {
    this.closeModalLoanInfo();
    this.props.navigation.navigate('NewAccountLoan', {});
  };

  render() {
    const {isFocused, navigation, route} = this.props;
    const {name} = route;
    const {
      isLoading,
      loans,
      creditLine,
      hasManyAmountOption,
      profileCreditline,
      isBetweenOfficeHours,
    } = this.state;
    const hasLoans = loans.length > 0;
    const hasCreditLine = !!creditLine;
    const hasLoanPostponement = !!loans.length
      ? Validate.validateLoansPostponement(loans)
      : false;
    const genericLoan = Validate.instantCashType(creditLine)?.code === 3;
    return (
      <Container>
        {hasLoanPostponement && !isLoading && (
          <AdReschedule navigation={navigation} style={styles.adReschedule} />
        )}
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}>
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              {!!creditLine && !!profileCreditline && (
                <>
                  {genericLoan ? (
                    <BannerGenericLoan
                      isFocused={isFocused}
                      accessibilityLabel={'loanscreen_bannergenericloan'}
                      style={styles.genericBanner}
                      hasManyAmountOption={hasManyAmountOption}
                      navigation={navigation}
                      ref={ref => {
                        this.genericBanner = ref;
                      }}
                      creditLine={creditLine}
                      user={profileCreditline}
                    />
                  ) : (
                    <BannerInstantCash
                      nameRoute={name}
                      positionText={Label.BannerTop}
                      isFocused={isFocused}
                      accessibilityLabel={'loanscreen_bannerinstantcash'}
                      style={styles.banner}
                      navigation={navigation}
                      ref={ref => {
                        this.banner = ref;
                      }}
                      creditLine={creditLine}
                      user={profileCreditline}
                    />
                  )}
                </>
              )}
              {hasLoans && (
                <>
                  {genericLoan && (
                    <View style={styles.buttonLink}>
                      <ButtonLink
                        accessibilityLabel={'loanresume_buttonlink_loan'}
                        accent={'secondary'}
                        imageSource={require('../../../assets/images/help-icon.png')}
                        imagePosition={'right'}
                        titleStyle={styles.titleLoanInfo}
                        style={styles.loanInfo}
                        imageStyle={styles.buttonHelp}
                        onPress={this.onInfoPress}
                        title={L.loanscreen_info_title}
                      />
                    </View>
                  )}
                  <Header
                    style={styles.header}
                    accessibilityLabel={'loanscreen_header'}
                    title={L.loanscreen_header_title}
                    subtitle={L.loanscreen_header_subtitle}
                  />
                  <View style={styles.loansContainer}>
                    {loans.map((loan, index) => {
                      return (
                        <LoanResume
                          accessibilityLabel={'loanscreen_loanresume'}
                          style={styles.loanResume}
                          navigation={navigation}
                          key={index.toString()}
                          loan={loan}
                          shouldShowPayLabel={true}
                          showPayButton
                          isBetweenOfficeHours={isBetweenOfficeHours}
                        />
                      );
                    })}
                  </View>
                </>
              )}
              {!hasLoans && hasCreditLine && (
                <>
                  <Header
                    style={styles.header}
                    accessibilityLabel={'loanscreen_header'}
                    title={L.loanscreen_header_title}
                    subtitle={L.loanscreen_header_subtitle}
                  />
                  <View style={styles.dashedContainer}>
                    <Text style={styles.textDescription}>
                      {L.loanscreen_header_description}
                    </Text>
                  </View>
                </>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <LoadingOverlay isLoading={isLoading} />
        <ModalLoanInfoResume
          accessibilityLabel={'loanscreen_modalloaninforesume_showdescription'}
          ref={ref => {
            this.modalLoanInfoResume = ref;
          }}
          onClose={this.closeModalLoanInfo}
          goOpenAccount={this.goOpenAccount}
        />
      </Container>
    );
  }
}

export type LoansScreenType = LoansScreen;
export default withFocused<LoansScreen, Props>(LoansScreen);
