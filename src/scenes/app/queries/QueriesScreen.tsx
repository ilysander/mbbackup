import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
  SafeAreaView,
  Platform,
} from 'react-native';
import API from '../../../api';
import {
  PreferencesUserDataModifyPreResponse,
  LoansItem,
  ContentCreditLine,
  DigitalProductOptions,
} from '../../../api/backend/response/Execute';
import AccountList from '../../../components/account/AccountList';
import ExchangeRate from '../../../components/exchange/ExchangeRate';
import QueriesHeader from '../../../components/queries/QueriesHeader';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';

import Container from '../../../components/ui/Container';
import Content from '../../../components/ui/Content';
import Loading from '../../../components/ui/Loading';
import EmailStatusModal from '../../../components/ui/EmailStatusModal';
import AcceptEmailModal from '../../../components/ui/AcceptEmailModal';
import PopUpCelConfirmModal from '../../../components/ui/PopUpCelConfirmModal';

import {Colors, TypeInitialStart} from '../../../resources/constants';
import {Validate, Sanitizer} from '../../../resources/functions';
import {Emitter} from '../../../resources/listeners';
import {Log} from '../../../resources/log';
import Session from '../../../api/Session';
import Ad from '../../../components/loans/Ad';
import AdReschedule from '../../../components/loans/AdReschedule';
import ModalInfoNoEmail from '../../../components/email/ModalInfoNoEmail';
import Config from '../../../Config';
import {L} from '../../../resources/language';
import {Font} from '../../../resources/functions';
import {InitialAppScreen} from '../../../resources/initialAppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Size} from '../../../resources/dimensions';
import KeyboardAvoidingView from '../../../components/ui/KeyboardAvoidingView';
import {NetworkStatusAlert} from '../../../components/ui';
import {AlertEvent} from '../../../components/alert/AlertManager';

const TAG = '[QueriesScreen]';
const UPDATEMAIL = 'UPDATEMAIL';
const ADDMAIL = 'ADDMAIL';

const paddingTop = Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0;
const height = Size.getActionBarHeight() + paddingTop;

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 5,
    marginTop: 3,
  } as ViewStyle,
  accountList: {
    marginBottom: 20,
    marginTop: 20,
  } as ViewStyle,
  queriesHeader: {
    marginTop: 5,
    marginBottom: 10,
  } as ViewStyle,
  queriesHeaderWithoutBanner: {
    marginTop: -10,
    marginBottom: 10,
  } as ViewStyle,
  adReschedule: {
    paddingTop: 10,
    paddingBottom: 5,
  } as ViewStyle,
  withOutadReschedule: {
    paddingTop: 25,
    paddingBottom: 5,
  } as ViewStyle,
  messageTextAccent: {
    ...Font({weight: 'SemiBold'}),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  } as TextStyle,
  messageText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
  } as TextStyle,
  headerMainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.transparent,
  } as ViewStyle,
  container: {
    paddingTop: height,
  } as ViewStyle,
  content: {
    marginTop: 50,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationProp<any>;
}

export interface State {
  isLoading: boolean;
  user?: PreferencesUserDataModifyPreResponse;
  loans: LoansItem[];
  showModalEmail: boolean;
  activateEmailPopup: boolean;
  wordingType: string;
  activateAcceptModal: boolean;
  activateCelPhoneMod: boolean;
  onTour: boolean;
  creditLine?: ContentCreditLine;
}

class QueriesScreen extends React.Component<Props & FocusedProps, State> {
  state: State = {
    isLoading: true,
    loans: [],
    showModalEmail: false,
    activateEmailPopup: false,
    wordingType: ADDMAIL,
    activateAcceptModal: false,
    activateCelPhoneMod: false,
    onTour: false,
  };

  accountList!: AccountList | null;
  ad!: Ad | null;

  setTimeVerifyEmail!: NodeJS.Timeout;

  componentDidMount() {
      this.load();
      this.accountList && this.accountList.load();

    setTimeout(() => {
      Emitter.emit('onTourManagerStart', false);
    }, 100);

    Emitter.on('onTourManagerEvent', this.tourManagerEvent);
  }

  componentWillUnmount() {
    Emitter.off('onTourManagerEvent', this.tourManagerEvent);
  }

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.accountList && this.accountList.load();
      this.load();
    }
  }

  tourManagerEvent = (event: boolean) => {
    if (event) {
      this.setState({onTour: true});
    } else {
      this.setState({onTour: false});
      this.verifyModals();
    }
  };

  load = async () => {
    this.setState({isLoading: true});
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const user = response.body.data;
      this.setState({user});
      Session.setProfile(user);
      this.loadCreditLine();
      this.verifyModals();
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({isLoading: false});
  };

  loadCreditLine = async () => {
    try {
      const response = await API.Execute.creditlineDisplay();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.data) {
        const list = response.body.data.contentList || [];
        const creditLine = list.length > 0 ? list[0] : undefined;
        if (creditLine) {
          const instantCashType = Validate.instantCashType(creditLine);
          const isNewLoanFast = instantCashType
            ? instantCashType.code === 3
            : false;
          if (isNewLoanFast) {
            const response = await API.Execute.loanrequestListChips();
            if (!Validate.validateStatusCode(response.status)) {
              Log.withStatusCode(TAG, 'loadListOptions', response);
            }
            const body = response.body;
            const data = body.data as DigitalProductOptions;
            const oneChoice = data.amountOptions.length > 1 ? false : true;
            if (body.code === API.ResponseCode.OK) {
              this.ad && this.ad.oneChoice(oneChoice);
            }
          }

          this.setState({creditLine});
          return creditLine;
        }
      }
      return;
    } catch (e) {
      Log.info(TAG, 'loadError', e);
      return;
    }
  };

  onLoansLoaded = (loansLoaded: LoansItem[]) => {
    this.setState({
      loans: [...loansLoaded],
    });
    Emitter.emit('onTourManagerVerifyLoans', loansLoaded);
  };

  closeEmailModal = () => {
    this.setState({showModalEmail: false});
  };

  onNeedEmail = () => {
    this.setState({showModalEmail: true});
  };
  calcDate(lastDay: Date, today: Date) {
    const diff = Math.floor(today.getTime() - lastDay.getTime());
    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    return days;
  }

  verifyModals = async () => {
    this.setTimeVerifyEmail && clearTimeout(this.setTimeVerifyEmail);

    this.setTimeVerifyEmail = setTimeout(async () => {
      const {user, onTour} = this.state;
      if (!user || onTour) {
        return;
      }
      const showCelphoModal: boolean = this.activateCelPhoneBioEnrollPopUp();
      if (!showCelphoModal) {
        const showEmailModal: boolean = await this.verifyEmail(user);
        if (!showEmailModal) {
          this.verifyCreditLine();
        }
      } else {
        this.verifyCreditLine();
      }
    }, 1500);
  };

  verifyCreditLine = async () => {
    setTimeout(async () => {
      let {creditLine, onTour} = this.state;
      if (onTour) {
        return;
      }
      if (!creditLine) {
        creditLine = await this.loadCreditLine();
      }
      if (creditLine) {
        this.ad && this.ad.show(creditLine);
      }
    }, 300);
  };

  verifyEmail = async (user: PreferencesUserDataModifyPreResponse) => {
    const email = user._mail;
    const today = new Date();
    if (!email) {
      this.setState({wordingType: ADDMAIL});
    } else {
      this.setState({wordingType: UPDATEMAIL});
    }

    try {
      const emailStatusDate = await Session.emailStatusGet(
        'emailStatusDate',
        '',
      );
      if (!!emailStatusDate) {
        const lastDate = new Date(emailStatusDate.value.toString());
        const diff = this.calcDate(lastDate, today);
        if (!!email) {
          const limitDiffDate = Config.settings.numberDaysEmailPopupUpdate;

          if (diff >= limitDiffDate) {
            this.setActivateEmailPopup();
            await Session.emailStatusUpdate(
              'emailStatusDate',
              today.toString(),
            );
            return true;
          }
        } else {
          const limitDiffDate = Config.settings.numberDaysEmailPopupAdd;
          if (diff >= limitDiffDate) {
            this.setActivateEmailPopup();
            await Session.emailStatusUpdate(
              'emailStatusDate',
              today.toString(),
            );
            return true;
          }
        }
      } else {
        this.setActivateEmailPopup();
        await Session.emailStatusSave('emailStatusDate', today.toString());
        return true;
      }
    } catch (e) {
      this.setActivateEmailPopup();
      await Session.emailStatusSave('emailStatusDate', today.toString());
      return true;
    }
    return false;
  };

  setActivateEmailPopup = () => {
    this.setState({activateEmailPopup: true});
  };

  closeModalEmail = () => {
    const {wordingType} = this.state;
    this.setState({activateEmailPopup: false});
    if (wordingType === UPDATEMAIL) {
      this.setState({activateAcceptModal: true});
    } else {
      this.verifyCreditLine();
    }
  };

  goToChangeEmail = () => {
    const {wordingType, user} = this.state;
    const {navigation} = this.props;
    this.setState({activateEmailPopup: false});
    if (wordingType === ADDMAIL) {
      navigation.navigate('ChangeEmailStart', {user});
    } else {
      navigation.navigate('UpdateEmailStart', {user});
    }
  };

  getPanelWording = () => {
    const {user} = this.state;
    if (!user) {
      return;
    }
    let title = '';
    let body = <Text />;
    let actionButtonTitle = '';
    let cancelButtonTitle = '';
    const name = user && Sanitizer.titleCase(user._clientName.toLowerCase());

    const emailmask = user && user._mail;

    if (!!emailmask) {
      title = L.queriescreen_updatemodal_title + name;
      body = (
        <>
          <Text style={[styles.messageText]}>
            {L.queriescreen_updatemodal_text_part1}
          </Text>
          <Text style={[styles.messageTextAccent]}>
            {Sanitizer.maskEmail(emailmask)}
          </Text>
        </>
      );
      actionButtonTitle = L.queriescreen_updatemodal_addbutton;
      cancelButtonTitle = L.queriescreen_updatemodal_afterbutton;
    } else {
      title = L.queriescreen_modal_title;
      body = (
        <>
          <Text style={[styles.messageText]}>
            {L.queriescreen_modal_text_part1}
            <Text style={[styles.messageTextAccent]}>
              {L.queriescreen_modal_text_part2}
            </Text>
            {L.queriescreen_modal_text_part3}
          </Text>
        </>
      );
      actionButtonTitle = L.queriescreen_modal_addbutton;
      cancelButtonTitle = L.queriescreen_modal_afterbutton;
    }
    return {
      title,
      body,
      actionButtonTitle,
      cancelButtonTitle,
    };
  };

  closeAcceptPopupModal = () => {
    this.setState({activateAcceptModal: false});
    this.verifyCreditLine();
  };

  closeAcceptCelPhoneMod = () => {
    this.setState({activateCelPhoneMod: false});
    InitialAppScreen.IdentityCheckLoginScreen = TypeInitialStart.EndBioEnroll;
  };

  activateCelPhoneBioEnrollPopUp = () => {
    const activateCelPhoneMod =
      InitialAppScreen.IdentityCheckLoginScreen == TypeInitialStart.BioEnroll
        ? true
        : InitialAppScreen.IdentityCheckLoginScreen ==
          TypeInitialStart.EndBioEnroll
        ? true
        : false;
    InitialAppScreen.IdentityCheckLoginScreen == TypeInitialStart.EndBioEnroll
      ? this.setState({activateCelPhoneMod: !activateCelPhoneMod})
      : this.setState({activateCelPhoneMod});
    return activateCelPhoneMod;
  };

  render() {
    const {isFocused, navigation, route} = this.props;
    const {name} = route;

    const {
      user,
      isLoading,
      loans,
      showModalEmail,
      activateEmailPopup,
      wordingType,
      activateAcceptModal,
      activateCelPhoneMod,
    } = this.state;
    const hasLoanPostponement = !!loans.length
      ? Validate.validateLoansPostponement(loans)
      : false;
    const panelWording = this.getPanelWording();

    return (
      <Container style={styles.container}>
        {hasLoanPostponement && (
          <AdReschedule
            navigation={navigation}
            styleContent={
              Validate.isDemo()
                ? styles.adReschedule
                : styles.withOutadReschedule
            }
          />
        )}
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}>
          {/* <ScrollView> */}
          <SafeAreaView>
            <Content style={styles.content}>
              <NetworkStatusAlert style={styles.networkStatus} />
              {isLoading && !user && (
                <Loading
                  margin={'large'}
                  size={'large'}
                  color={Colors.primary}
                />
              )}
              {user && (
                <QueriesHeader
                  accessibilityLabel={'queriesscreen_queriesheader'}
                  name={user._clientName}
                  securitySealImage={user.securitySealImage}
                  style={
                    hasLoanPostponement
                      ? styles.queriesHeader
                      : styles.queriesHeaderWithoutBanner
                  }
                />
              )}
              <ExchangeRate accessibilityLabel={'queriesscreen_exchangerate'} />
              {!!user && (
                <AccountList
                  accessibilityLabel={'queriesscreen_accountlist'}
                  navigation={navigation}
                  ref={ref => {
                    this.accountList = ref;
                  }}
                  style={styles.accountList}
                  onLoansLoaded={this.onLoansLoaded}
                  user={user}
                  isLoadingProfile={isLoading}
                />
              )}
            </Content>
          </SafeAreaView>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
        {!!user && (
          <Ad
            navigation={navigation}
            onNeedEmail={this.onNeedEmail}
            user={user}
            ref={ref => {
              this.ad = ref;
            }}
            nameRoute={name}
            isLoading={isLoading}
          />
        )}
        {!!panelWording && (
          <EmailStatusModal
            goToChangeEmail={
              wordingType === UPDATEMAIL
                ? this.closeModalEmail
                : this.goToChangeEmail
            }
            closeModal={
              wordingType === UPDATEMAIL
                ? this.goToChangeEmail
                : this.closeModalEmail
            }
            closeAllModal={this.closeModalEmail}
            isVisible={activateEmailPopup}
            title={panelWording.title}
            body={panelWording.body}
            actionButtonTitle={panelWording.actionButtonTitle}
            cancelButtonTitle={panelWording.cancelButtonTitle}
          />
        )}
        {showModalEmail && !!user && (
          <ModalInfoNoEmail
            user={user}
            accessibilityLabel={'newaccount_flashmessage_modalinfo_noemail'}
            navigation={navigation}
            onClose={this.closeEmailModal}
          />
        )}
        <AcceptEmailModal
          isVisible={activateAcceptModal}
          closeModal={this.closeAcceptPopupModal}
        />
        <PopUpCelConfirmModal
          isVisible={activateCelPhoneMod}
          name={user && user._clientName}
          mobilePhone={user && user.mobilePhone}
          closeModal={this.closeAcceptCelPhoneMod}
        />
      </Container>
    );
  }
}

export type QueriesScreenType = QueriesScreen;
export default withFocused<QueriesScreen, Props>(QueriesScreen);
// export default QueriesScreen;
