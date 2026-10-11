import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
  MessageBallon,
  Separator,
  TextInput,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import {L} from '../../../resources/language';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import {Validate, Font, Sanitizer} from '../../../resources/functions';
import {Colors} from '../../../resources/constants';
import {Emitter} from '../../../resources/listeners';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  InteractionManager,
  ImageStyle,
} from 'react-native';
import NetworkManager from '../../../components/network/NetworkManager';
import {PreferencesUserDataModifyPreResponse} from '../../../api/backend/response/Execute';
import Session from '../../../api/Session';
import {KeyboardUtil} from '../../../resources/util';
import DeviceInfo from '../../../resources/deviceset/DeviceInfo';
import {ErrorRequest} from '../../../resources/constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font({weight: 'SemiBold'}),
    fontSize: 14,
  } as TextStyle,
  labelPreview: {
    color: Colors.grey6,
    ...Font(),
    fontSize: 14,
  } as TextStyle,
  labelPreviewMask: {
    color: Colors.grey6,
    ...Font({weight: 'SemiBold'}),
    fontSize: 14,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 19,
    height: 40,
  } as TextStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 30,
  } as ViewStyle,
  actionButton: {
    minHeight: 50,
    alignItems: 'center',
  } as ViewStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  marginTop: {
    marginTop: 30,
  } as ViewStyle,
  headerContainer: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  card: {
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 5,
  } as ViewStyle,
  header: {
    marginVertical: 6,
  } as ViewStyle,
  imageBalon: {
    width: 64.55,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  } as ImageStyle,
  headerTitle: {
    fontSize: 22,
  } as TextStyle,
  emailContainer: {
    marginTop: 0,
  } as TextStyle,
  separator: {
    width: '100%',
    height: 1,
    marginVertical: 15,
  } as ViewStyle,
});

export interface Params {
  user: PreferencesUserDataModifyPreResponse;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, Params>;
}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  wordingType: string;
}
const TAG = '[UpdateEmailStartScreen]';

class UpdateEmailStartScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.updateemailstartscreen_title,
  };

  state: State = {
    isLoading: false,
    isValid: false,
    wordingType: '',
  };

  interaction!: any;
  emailInput!: TextInput | null;
  secondaryEmailInput!: TextInput | null;

  getEmail = () => {
    return this.emailInput ? this.emailInput.getValue() : '';
  };

  getSecondaryEmail = () => {
    return this.secondaryEmailInput ? this.secondaryEmailInput.getValue() : '';
  };

  onSubmitEditingEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
    this.secondaryEmailInput && this.secondaryEmailInput.focus();
  };

  onBlurEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  onEmptyStateEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  onSubmitSecondaryEditingEmail = () => {
    this.emailInput && this.emailInput.setError('');
    this.isValidSecondayEmail(true);
    this.isValid(false);
  };

  onEmptySecondaryStateEmail = () => {
    this.isValidSecondayEmail(true);
    this.isValid(false);
  };

  isValidRepeatEmail = (showError = true) => {
    if (!this.emailInput || !this.secondaryEmailInput) {
      return false;
    }
    const emailInput = this.emailInput.getValue();
    const secondaryEmailInput = this.secondaryEmailInput.getValue();
    if (
      secondaryEmailInput.length > 0 &&
      this.secondaryEmailInput.isValid(showError) &&
      secondaryEmailInput !== emailInput
    ) {
      this.secondaryEmailInput.setError(
        L.changeemailstartscreen_textinput_differentemail_error,
      );
      this.emailInput.markError();
      return false;
    }
    this.secondaryEmailInput.setError('');
    return true;
  };

  isValid = (showError = true) => {
    const isValidEmail = this.isValidEmail(showError);
    const isValidSecondayEmail = this.isValidSecondayEmail(showError);
    if (isValidEmail && isValidSecondayEmail) {
      const repeatEmailIsValid = this.isValidRepeatEmail(showError);
      const isValid = [
        isValidEmail,
        isValidSecondayEmail,
        repeatEmailIsValid,
      ].every(item => !!item);
      this.setState({isValid});
      return isValid && NetworkManager.isConnected;
    } else {
      const isValid = false;
      this.setState({isValid});
      return isValid && NetworkManager.isConnected;
    }
  };

  isValidEmail = (showError = true) => {
    const value = this.getEmail();
    if (!value) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.updateemailstartscreen_textinput_email_error_empty,
        );
      return false;
    }

    const isValid = Validate.email(value);
    if (!isValid) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.updatemailstartscreen_textinput_email_error_format,
        );
      return false;
    }
    return true;
  };

  isValidSecondayEmail = (showError = true) => {
    const value = this.getSecondaryEmail();
    if (!value) {
      showError &&
        this.secondaryEmailInput &&
        this.secondaryEmailInput.setError(
          L.updateemailstartscreen_textinput_secondaryemail_error_empty,
        );
      return false;
    }

    const isValid = Validate.email(value);
    if (!isValid) {
      showError &&
        this.secondaryEmailInput &&
        this.secondaryEmailInput.setError(
          L.updateemailstartscreen_textinput_secondaryemail_error_format,
        );
      return false;
    }
    return true;
  };

  tryToSubmit = async () => {
    this.blur();
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'tryToSubmit',
        e: '',
      });
      return;
    }
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid(true);
      if (!isValid) {
        return;
      }
      this.setState({isLoading: true});
      await this.submit();
      this.setState({isLoading: false});
    });
  };

  submit = async () => {
    const {navigation, route} = this.props;
    const email = this.getEmail();
    const user = route.params && route.params.user;
    try {
      const userInfo = DeviceInfo.userInfoLoad(user.client._documentNumber);

      const deviceDate = DeviceInfo.deviceDate();

      const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
      const deviceId = await deviceInfoRaw.deviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
        deviceId,
      };

      const requestEmail = {
        key: 'email',
        value: email,
      };
      const response = await API.Session.updateEmailSendOTP(
        deviceInfo,
        userInfo,
        deviceDate,
        requestEmail,
      );

      if (Validate.validateStatusCode(response.status)) {
        navigation.navigate('UpdateEmailConfirm', {user, email});
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  render() {
    const {isValid, isLoading} = this.state;
    const {route} = this.props;
    const user = route.params && route.params.user;
    return (
      <Container>
        <FormSteps current={1} total={3} />
        <SafeAreaView>
          <KeyboardAvoidingView
            enabled={true}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{
              minHeight: Size.getVisibleTabScreenHeight(),
            }}>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={'updateemailstartscreen_header_title'}
                style={styles.headerContainer}
                titleStyle={styles.headerTitle}
                title={L.updateemailstartscreen_changeheader_title}
                center
              />
              <MessageBallon
                imageStyle={styles.imageBalon}
                message={
                  <Text>{L.updateemailstartscreen_changemessage_balloon}</Text>
                }
                imageSource={require('../../../assets/images/adn-mujer-senalando.png')}
              />
              <CardView padding style={styles.card}>
                <View>
                  <Text
                    style={styles.labelPreview}
                    accessibilityLabel={
                      'updateemailstartscreen_text_addmail_title'
                    }>
                    {L.updateemailstartscreen_preview_title}
                  </Text>
                  {!!user && (
                    <Text
                      style={styles.labelPreviewMask}
                      accessibilityLabel={
                        'updatemailstartscreen_text_addmail_title'
                      }>
                      {Sanitizer.maskEmail(user._mail)}
                    </Text>
                  )}
                  <Separator style={styles.separator} />
                </View>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'updateemailstartscreen_text_addmail_title'
                  }>
                  {L.updateemailstartscreen_addmail_title}
                </Text>
                <TextInput
                  placeholder={
                    L.updateeemailstartscreen_textinput_emailplaceholder
                  }
                  accessibilityLabel={
                    'updateemailstartscreen_textinputmasked_email'
                  }
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  autoComplete={'off'}
                  blurOnSubmit
                  ref={ref => {
                    this.emailInput = ref;
                  }}
                  onEmptyState={this.onEmptyStateEmail}
                  onSubmitEditing={this.onSubmitEditingEmail}
                  returnKeyType={'done'}
                  style={styles.supplyCode}
                  containerStyle={styles.emailContainer}
                  onBlur={this.onBlurEmail}
                />
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'updateemailstartscreen_text_addrepeatamail_title'
                  }>
                  {L.updateemailstartscreen_repeatmail_title}
                </Text>
                <TextInput
                  placeholder={
                    L.updateemailstartscreen_textinput_repeatemailplaceholder
                  }
                  accessibilityLabel={
                    'updateemailstartscreen_textinputmasked_repeatemail'
                  }
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  blurOnSubmit
                  ref={ref => {
                    this.secondaryEmailInput = ref;
                  }}
                  onEmptyState={this.onEmptySecondaryStateEmail}
                  onSubmitEditing={this.onSubmitSecondaryEditingEmail}
                  returnKeyType={'done'}
                  style={styles.supplyCode}
                  containerStyle={styles.emailContainer}
                  onBlur={this.onSubmitSecondaryEditingEmail}
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'updateemailstartscreen_button_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  big
                  title={L.updateemailstartscreen_button_next}
                />
              </View>
            </Content>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Container>
    );
  }
}

export type UpdateEmailStartScreenType = UpdateEmailStartScreen;
export default withFocused<UpdateEmailStartScreen, Props>(
  UpdateEmailStartScreen,
);
