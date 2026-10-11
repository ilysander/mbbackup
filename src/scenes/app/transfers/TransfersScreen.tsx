import * as React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Text } from 'react-native';
import API from '../../../api';
import AvailabilityAlert from '../../../components/alert/AvailabilityAlert';
import FrequentList from '../../../components/frequent/FrequentList';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import TransfersTypes from '../../../components/transfers/TransfersTypes';
import {
  CardView,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../components/ui';
import Config from '../../../Config';
import { AccountsType, Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Font, Linking, Validate } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { AlertEvent } from '../../../components/alert/AlertManager';
import Features from '../../../resources/remote/Features';
import NewAccountFlashMessage from '../../../components/ui/NewAccountFlashMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  textBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  label: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  frequentContainer: {
    marginBottom: 20,
  } as ViewStyle,
  colorFlashMessage: {
    color: Colors.secondary,
  } as TextStyle,
});

const TAG = '[TransfersScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isLoadingAccounts: boolean;
  isLoadingFrequents: boolean;
  showAvailabilityAlert: boolean;
  isBetweenOfficeHours: boolean;
  accounts: any[];
  accountsWithCts: any[];
  listFrequentContacts: any[];
  user?: any;
}

class TransfersScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isLoading: false,
    isLoadingAccounts: false,
    isLoadingFrequents: false,
    showAvailabilityAlert: false,
    isBetweenOfficeHours: false,
    accounts: [],
    accountsWithCts: [],
    listFrequentContacts: [],
  };

  transfersTypes!: TransfersTypes | null;

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  load = () => {
    this.loadAccounts();
    this.loadFrequentContacts();
  };

  loadAccounts = async () => {
    const { isLoadingAccounts } = this.state;
    if (isLoadingAccounts) {
      Log.info(TAG, 'loadAccounts', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true, isLoadingAccounts: true });
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      const { accounts } = response.body.data;

      const validTypes = [
        AccountsType.SAVING_ACCOUNTS.family,
        AccountsType.CHECKING_ACCOUNTS.family,
      ];
      const validTypesWithCts = [
        AccountsType.SAVING_ACCOUNTS.family,
        AccountsType.CHECKING_ACCOUNTS.family,
        AccountsType.CTS.family,
      ];
      const accountsList = (accounts || []).filter(account =>
        validTypes.includes(account.family)
      );
      const accountsWithCts = (accounts || []).filter(account =>
        validTypesWithCts.includes(account.family)
      );
      this.setState({
        accounts: accountsList,
        accountsWithCts,
      });
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    this.setState({ isLoadingAccounts: false });
    this.setLoadingOff();
  };

  loadFrequentContacts = async () => {
    const { isLoadingFrequents } = this.state;
    if (isLoadingFrequents) {
      Log.info(TAG, 'loadFrequentContacts', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.transfersFrequentContactsList();
      const { frequentContactList } = response.body.data;
      this.setState({ listFrequentContacts: frequentContactList || [] });
    } catch (e) {
      Log.info(TAG, 'loadFrequentContacts', e);
      /**
       * aqui no es necesario AlertEvent porque si estan desactivadas las transferencias
       * esta petición no cargará
       */
    }
    this.setState({ isLoadingFrequents: false });
    this.setLoadingOff();
    this.loadProfile();
  };

  loadProfile = async () => {
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      const user = response.body.data;
      this.setState({ user });
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e,
      });
    }
  };

  goToHomeBanking = async () => {
    this.hideAvailabilityAlert();
    try {
      await Linking.openURL(Config.settings.frontendUrl);
    } catch (e) {
      Log.debug(TAG, 'goToHomeBanking', e);
    }
  };

  showAvailabilityAlert = async () => {
    const { isLoading } = this.state;
    let serviceAvailable = false;
    let betweenOfficeHour = false;
    let isWorkingDays = false;
    if (isLoading) {
      Log.info(TAG, 'showAvailabilityAlert', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.ServiceAvalability.list();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'showAvailabilityAlert', response);
      }
      const { enable } = response.body.data;
      isWorkingDays = Validate.isWorkingDay(response.headers.Date);
      betweenOfficeHour = Validate.isBetweenHours(
        response.headers.Date,
        Config.settings.startTimeInterbanksOperations,
        Config.settings.endTimeInterbanksOperations
      );
      serviceAvailable = enable;
    } catch (e) {
      serviceAvailable = false;
      Log.info(TAG, 'showAvailabilityAlert', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'showAvailabilityAlert',
        e,
      });
    }
    const isBetweenOfficeHours =
      serviceAvailable && isWorkingDays && betweenOfficeHour;
    this.setState({
      isBetweenOfficeHours,
      showAvailabilityAlert: !isBetweenOfficeHours,
      isLoading: false,
    });
    return isBetweenOfficeHours;
  };

  hideAvailabilityAlert = () => {
    this.setState({ showAvailabilityAlert: false });
  };

  setLoadingOff = () => {
    const { isLoadingAccounts, isLoadingFrequents } = this.state;
    if (!isLoadingAccounts && !isLoadingFrequents) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { navigation, isFocused } = this.props;
    const {
      isLoading,
      listFrequentContacts,
      showAvailabilityAlert,
      isBetweenOfficeHours,
      accounts,
      accountsWithCts,
      user,
    } = this.state;
    const isAllowedNewAccount = Validate.isAllowedNewAccount();
    const hasAcccounts = accounts.length > 0;
    return (
      <Container>
        {showAvailabilityAlert && (
          <AvailabilityAlert
            accessibilityLabel={'transfersscreen_availabilityalert'}
            onAction={this.goToHomeBanking}
            outOfTime={isBetweenOfficeHours}
            onClose={this.hideAvailabilityAlert}
          />
        )}

        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />

              {!hasAcccounts && !!user && (
                <NewAccountFlashMessage
                  user={user}
                  navigation={navigation}
                  title={L.transfersscreen_flashmessage_title}
                  message={
                    <Text>
                      {isAllowedNewAccount
                        ? L.transfersscreen_flashmessage_message_newAccount
                        : L.transfersscreen_flashmessage_message}
                      <Text style={styles.textBold}>
                        {L.transfersscreen_flashmessage_message1}
                      </Text>
                      <Text>{L.transfersscreen_flashmessage_message2}</Text>
                    </Text>
                  }
                  styleColor={styles.colorFlashMessage}
                  typeColor={'secondary'}
                />
              )}
              <TransfersTypes
                serviceAvailability={this.showAvailabilityAlert}
                accessibilityLabel={'transfersscreen_transferstypes'}
                navigation={navigation}
                ref={ref => {
                  this.transfersTypes = ref;
                }}
                frequentContacts={listFrequentContacts}
                accounts={accounts}
                accountsWithCts={accountsWithCts}
              />
              {listFrequentContacts.length > 0 &&
                Features.isAllowedTo('FrequentList') && (
                  <>
                    <View style={styles.label}>
                      <Header
                        accessibilityLabel={
                          'transfersscreen_sectionheader_frequent_contacts'
                        }
                        title={
                          L.transfersscreen_sectionheader_frequent_contacts
                        }
                      />
                    </View>

                    <CardView style={styles.frequentContainer}>
                      <FrequentList
                        accessibilityLabel={'transfersscreen_frequentlist'}
                        navigation={navigation}
                        serviceAvailability={this.showAvailabilityAlert}
                        list={listFrequentContacts}
                        accounts={accounts}
                      />
                    </CardView>
                  </>
                )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <LoadingOverlay isLoading={isLoading} />
      </Container>
    );
  }
}

export type TransfersScreenType = TransfersScreen;
export default withFocused<TransfersScreen, Props>(TransfersScreen);
