import * as React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import API from '../../../api';
import {PreferencesUserDataModifyPreResponse} from '../../../api/backend/response/Execute';
import InfoContact from '../../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  SafeAreaView,
  Version,
  TextInput,
} from '../../../components/ui';
import {
  PersonalInfo,
  PersonalDescription,
  EnrollmentDevices,
  UnrollmentModal,
} from '../../../components/profile/Index';
import {Colors} from '../../../resources/constants';
import {Size} from '../../../resources/dimensions';
import {Sanitizer, Validate} from '../../../resources/functions';
import {L} from '../../../resources/language';
import {Emitter} from '../../../resources/listeners';
import {Log} from '../../../resources/log';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {ReturnOptions} from '../../../components/alert/ConfirmPhoneAlert';
import Features from '../../../resources/remote/Features';
import {
  ListDevicesResponse,
  EnrolledDevice,
} from '../../../api/backend/response/Enrollment';
import {UserService} from '../../../resources/persistence';
import Session from '../../../api/Session';
import DeviceInfo from '../../../resources/deviceset/DeviceInfo';
import TransactionSessionId from '../../../resources/idTransaction/idTransaction';
import Config from '../../../Config';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const TAG = '[ProfileScreen]';
const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 5,
  } as ViewStyle,
  version: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
  } as ViewStyle,
  versionLabelStyle: {
    color: Colors.grey5,
  } as TextStyle,
  contactMessage: {
    marginBottom: 0,
  } as TextStyle,
  headerTrace: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
});

export interface NavigationParams {
  returnOptions?: ReturnOptions;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, NavigationParams>;
}

export interface State {
  isLoading: boolean;
  isUnrolling: boolean;
  user?: PreferencesUserDataModifyPreResponse;
  devicesList?: ListDevicesResponse;
  openTakeOutModal: boolean;
  thisPhone: boolean;
  selectedPhoneName: string;
  selDeviceId: string;
  selEnrollmentStatus: number;
  selEnrollmentId: string;
  device?: EnrolledDevice;
  header?: string;
}

class ProfileScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.profilescreen_title,
  // };

  state: State = {
    isLoading: false,
    isUnrolling: false,
    user: undefined,
    devicesList: [],
    openTakeOutModal: false,
    thisPhone: true,
    selectedPhoneName: '',
    selDeviceId: '',
    selEnrollmentStatus: 0,
    selEnrollmentId: '',
    device: undefined,
    header: '',
  };

  componentDidMount() {
    if (!Features.isAllowedTo('Profile')) {
      this.props.navigation.goBack();
      return;
    }
  }
  loadDevices = async (retry: number = 10) => {
    try {
      const documentNumber = !!Session.profile
        ? Session.profile.client._documentNumber
        : '';
      const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
      const deviceId = await deviceInfoRaw.deviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
        deviceId,
      };
      const userInfo = DeviceInfo.userInfoLoad(documentNumber);
      const deviceDate = DeviceInfo.deviceDate();
      const response = await API.Enrollment.listDevices(
        deviceInfo,
        userInfo,
        deviceDate,
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.info(TAG, 'load', 'no devices');
        this.loadDevices(retry - 1);
      }
      const devicesList = response.body.data;
      this.setState({devicesList});
    } catch (e) {
      Log.exception(TAG, 'loadDevices', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadDevices',
        e,
      });
    }
  };

  obtainDeviceInfoUnroll = (device: EnrolledDevice) => {
    const deviceInfo = {
      physicalDeviceId: device.physicalDeviceId,
      deviceVersion: device.deviceVersion,
      deviceModel: device.deviceModel,
      deviceBrand: device.deviceBrand,
      osVersion: device.osVersion,
      appVersion: device.appVersion,
      enrollmentId: device.enrollmentId,
    };
    return deviceInfo;
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  load = async () => {
    const {isLoading} = this.state;
    if (isLoading) {
      return;
    }
    this.setState({isLoading: true});
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const user = response.body.data;
      this.setState({user});
      if (
        Features.isAllowedTo('EnrollmentProcess') &&
        Features.isAllowedTo('LoginWithDniBiometric')
      ) {
        this.loadDevices();
      }
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

  goToChangeEmail = () => {
    const {navigation, route} = this.props;
    const {user} = this.state;

    const returnOptions = route.params && route.params.returnOptions;
    // const returnOptions = navigation.getParam('returnOptions');
    if (!user) {
      return;
    }
    const {_mail: current} = user;
    if (!user._mail) {
      this.props.navigation.navigate('ChangeEmailStart', {
        current,
        returnOptions,
        user,
      });
    } else {
      this.props.navigation.navigate('UpdateEmailStart', {
        current,
        returnOptions,
        user,
      });
    }
  };
  goToChangePhone = () => {
    const {route} = this.props;
    const {user} = this.state;
    const returnOptions = route.params && route.params.returnOptions;
    // const returnOptions = navigation.getParam('returnOptions');
    if (!user) {
      return;
    }
    const {mobilePhone: current} = user;
    this.props.navigation.navigate('ChangePhone', {current, returnOptions});
  };
  openModal = (
    selected: boolean,
    selectedPhoneName: string,
    deviceId: string,
    enrollmentStatus: number,
    enrollmentId: string,
    enrolledDevice: EnrolledDevice,
  ) => {
    this.setState({
      thisPhone: selected,
      selectedPhoneName,
      openTakeOutModal: true,
      selDeviceId: deviceId,
      selEnrollmentStatus: enrollmentStatus,
      selEnrollmentId: enrollmentId,
      device: enrolledDevice,
    });
  };

  unrollDevice = async (retry: number = 10) => {
    const {device} = this.state;
    const {navigation} = this.props;
    try {
      this.setState({isUnrolling: true});
      const user =
        !!Session.user && (await UserService.findOne(Session.user.id));
      const documentNumber = !!Session.profile
        ? Session.profile.client._documentNumber
        : '';
      const deviceDate = !!user ? user.dateCreated.toISOString() : '';
      const userInfo = DeviceInfo.userInfoLoad(documentNumber);
      const idTransaction = TransactionSessionId.idTransaction;
      if (!!device) {
        const deviceInfo = this.obtainDeviceInfoUnroll(device);
        const response = await API.Enrollment.unrollDevice(
          idTransaction,
          deviceInfo,
          userInfo,
          deviceDate,
        );
        const header = JSON.stringify(response.headers);
        this.setState({header});
        if (!Validate.validateStatusCode(response.status)) {
          Log.withStatusCode(TAG, 'loadDevices', response);
          this.unrollDevice(retry - 1);
        } else {
          if (DeviceInfo.currentDevice(device.currentDevice)) {
            this.setState({isUnrolling: false});
            Session.clear();
            navigation.navigate('SignIn');
          }
        }
      }
    } catch (e) {
      Log.exception(TAG, 'loadDevices', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadDevices',
        e,
      });
    } finally {
      this.setState({openTakeOutModal: false});
    }
  };

  closeModal = () => {
    this.setState({openTakeOutModal: false});
  };

  obtainDeviceDate = () => {
    const deviceDate = new Date();
    return deviceDate.toISOString();
  };

  render() {
    const {isFocused, navigation} = this.props;
    const {
      user,
      isLoading,
      isUnrolling,
      openTakeOutModal,
      selectedPhoneName,
      thisPhone,
      devicesList,
      header,
    } = this.state;
    const enrollmentProcess =
      Features.isAllowedTo('EnrollmentProcess') &&
      Features.isAllowedTo('LoginWithDniBiometric');
    if (!Features.isAllowedTo('Profile')) {
      return null;
    }

    if (isLoading && !user) {
      return (
        <View style={styles.loadingContainer}>
          <Loading size={'large'} color={Colors.primary} />
        </View>
      );
    }
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}>
          <NetworkStatusAlert style={styles.networkStatus} />
          {user && (
            <PersonalDescription
              title={Sanitizer.titleCase(user._clientName)}
              subtitle={`${Sanitizer.titleCase(
                user._clientLastName,
              )}${' '}${Sanitizer.titleCase(user._clientSecondLastName)}`}
              accessibilityLabel={'profilescreen_personaldescription_header'}
            />
          )}
          <SafeAreaView>
            <Content>
              {user && (
                <View>
                  <PersonalInfo
                    isLoading={isLoading}
                    goToChangeEmail={this.goToChangeEmail}
                    goToChangePhone={this.goToChangePhone}
                    changeEmail={true}
                    changePhone={Features.isAllowedTo('ChangePhone')}
                    mail={Sanitizer.maskEmail(user._mail)}
                    mobilePhone={Sanitizer.maskEmail(user.mobilePhone)}
                    iconEmail={require('../../../assets/images/email-icon.png')}
                    iconPhone={require('../../../assets/images/mobile-icon.png')}
                    accessibilityLabel={
                      'profilescreen_personalinfo_contactinfo'
                    }
                    title={L.profilescreen_panel_title}
                  />
                  {enrollmentProcess && !!devicesList && (
                    <EnrollmentDevices
                      devicesList={devicesList}
                      isLoading={isLoading}
                      openModal={(
                        selected: boolean,
                        deviceModel: string,
                        deviceId: string,
                        enrollmentStatus: number,
                        enrollmentId: string,
                        enrolledDevice: EnrolledDevice,
                      ) =>
                        this.openModal(
                          selected,
                          deviceModel,
                          deviceId,
                          enrollmentStatus,
                          enrollmentId,
                          enrolledDevice,
                        )
                      }
                    />
                  )}
                  <UnrollmentModal
                    unrollDevice={this.unrollDevice}
                    closeModal={this.closeModal}
                    visible={openTakeOutModal}
                    selectedPhoneName={selectedPhoneName}
                    thisPhone={thisPhone}
                    isUnrolling={isUnrolling}
                  />
                </View>
              )}
              {Config.features.HeaderTraceEnabled && (
                <TextInput
                  label={L.header_trace}
                  value={header}
                  accessibilityLabel={'signinscreen_textinput_header_trace'}
                  containerStyle={styles.headerTrace}
                />
              )}
            </Content>

            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'profilescreen_infocontact'}
                style={styles.contactMessage}
              />
              <Version
                style={styles.version}
                labelStyle={styles.versionLabelStyle}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ProfileScreenType = ProfileScreen;
export default withFocused<ProfileScreen, Props>(ProfileScreen);
