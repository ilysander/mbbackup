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
  FormSteps,
  TextInputMasked,
  Button,
  ButtonLink,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font, Sanitizer } from '../../../resources/functions';
import { Colors, ErrorRequest } from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  InteractionManager,
  ImageStyle,
  Image,
  Linking,
} from 'react-native';
import { MaskObj } from '../../../resources/persistence/models';
import NetworkManager from '../../../components/network/NetworkManager';
import {
  AccountItemSavingsAll,
  PreferencesUserDataModifyPreResponse,
} from '../../../api/backend/response/Execute';
import Session from '../../../api/Session';
import { KeyboardUtil } from '../../../resources/util';
import ModalRedirectPage from '../../../components/newAccount/ModalRedirectPage';
import ModalInfoNewAccount from '../../../components/newAccount/ModalInfoNewAccount';
import Config from '../../../Config';
import ModalInfoChangeEmail from '../../../components/email/ModalInfoChangeEmail';
import CardEmailNotify from '../../../components/email/CardEmailNotify';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  nameContainerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  } as ViewStyle,
  containerButton: {
    marginBottom: 30,
  } as ViewStyle,
  textFree: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'left',
    paddingLeft: 5,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 14,
    bottom: -5,
    textAlign: 'center',
  } as TextStyle,
  textBannerHigh: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 22,
  } as TextStyle,
  listItem1: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  listItem: {
    justifyContent: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  listItemtext: {
    width: 266,
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  bannerContentRow: {
    height: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  textButton: {
    fontSize: 16,
    textAlign: 'center',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
  } as ViewStyle,
  bannerImageContainerLeft: {
    width: 14,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  } as ViewStyle,
  bannerImageContainerRight: {
    width: 14,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 5,
  } as ViewStyle,

  bannerImage: {
    width: 14,
    height: 18,
    tintColor: Colors.shine,
  } as ImageStyle,
  listImage: {
    width: 10,
    height: 10,
    tintColor: Colors.primary,
  } as ImageStyle,
  buttonLinkText: {
    textAlign: 'left',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 14,
  } as TextStyle,
  iconButton: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  textLinkView: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  imageBox: {
    paddingTop: 2,
    marginRight: 5,
  } as ViewStyle,
  overlay: {
    backgroundColor: Colors.modal,
    flex: 1,
    justifyContent: 'flex-end',
  } as ViewStyle,
  container: {
    minHeight: 370,
    backgroundColor: Colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  } as ViewStyle,
  containerInformation: {
    marginHorizontal: 20,
  } as ViewStyle,
  button: {
    minHeight: 50,
  } as ViewStyle,
  text: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  textBold: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  textHelp: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 30,
  } as ViewStyle,
  marginTop: {
    marginTop: 30,
  } as ViewStyle,
  marginTopEmail: {
    marginTop: 20,
  } as ViewStyle,
  titleStyle: {
    fontSize: 30,
    lineHeight: 34,
  } as TextStyle,
  marginExpandableView: {
    marginHorizontal: 20,
  } as ViewStyle,
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  containerHelpDetail: {
    marginVertical: 10,
  } as ViewStyle,
  card: {
    paddingVertical: 20,
    marginTop: 10,
  } as ViewStyle,
  principalImage: {
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  } as ViewStyle,
  bannerPrincipalImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 150,
  } as ImageStyle,
  editEmail: {
    marginTop: 2,
    marginBottom: 0,
  } as ViewStyle,
  textActionInfoDocument: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  viewActionInfoDocument: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    width: 280,
    padding: 0,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleModalText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 18,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  footerText: {
    marginBottom: 26,
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey5,
    fontSize: 12,
  } as TextStyle,
  infoButtonText: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  iconButtonText: {
    width: Size.getWidth() * 0.8,
    marginTop: 0,
    padding: 0,
    alignSelf: 'flex-start',
    fontSize: 14,
  } as ImageStyle,
});

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  accounts: AccountItemSavingsAll[];
  emailMasked?: MaskObj;
  user?: PreferencesUserDataModifyPreResponse;
  isValid: boolean;
  isShowModalCancel: boolean;
  isShowModalInfoCancel: boolean;
  isShowModalChangeEmail: boolean;
}
const TAG = '[NewAccountScreen]';
class NewAccountScreen extends React.Component<Props & FocusedProps, State> {
  static navigationOptions = {
    title: L.newaccountscreen_title,
  };
  state: State = {
    isLoading: false,
    accounts: [],
    isValid: false,
    isShowModalCancel: false,
    isShowModalInfoCancel: false,
    isShowModalChangeEmail: false,
  };
  interaction!: any;
  emailInput!: TextInputMasked | null;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    await this.loadProfile();
    const { user } = this.state;
    if (user && user._mail) {
      const masked = Sanitizer.maskEmail(user._mail);
      const emailMasked = MaskObj.init(user._mail, masked);
      this.setState({ emailMasked });

      this.isValid();
    }
  };

  loadProfile = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true });
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
    this.setState({ isLoading: false });
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value;
    }
    return this.emailInput ? this.emailInput.getValue() : '';
  };

  isValid = () => {
    this.setState({ isValid: true });
    return NetworkManager.isConnected;
  };

  linktoWeb = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
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
      const isValid = this.isValid();
      if (!isValid) {
        return;
      }
      this.setState({ isLoading: true });
      await this.submit();
      this.setState({ isLoading: false });
    });
  };

  submit = async () => {
    const { navigation } = this.props;
    const email = this.getEmail();
    try {
      const response = await API.NewAccount.newAccountPreview(email);
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
        navigation.navigate('NewAccountConfirm', {
          resume,
          email,
        });
        return;
      }

      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e: ErrorRequest.Default,
      });
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

  goToHomeBanking = async () => {
    this.setState({ isShowModalCancel: false });
    try {
      await Linking.openURL(Config.settings.loanInfoUrlNewAccount);
    } catch (e) {
      Log.debug(TAG, 'goToHomebanking', e);
    }
  };

  actionModalEmail = () => {
    this.setState({ isShowModalInfoCancel: !this.state.isShowModalInfoCancel });
  };

  toggleModalEmail = () => {
    this.setState({
      isShowModalChangeEmail: !this.state.isShowModalChangeEmail,
    });
  };

  render() {
    const { emailMasked, isValid, isLoading, user } = this.state;
    const { isFocused, navigation } = this.props;
    const {
      isShowModalCancel,
      isShowModalInfoCancel,
      isShowModalChangeEmail,
    } = this.state;
    return (
      <Container>
        {isShowModalCancel && (
          <ModalRedirectPage
            accessibilityLabel={'newaccount_redirectmodal'}
            onAction={this.goToHomeBanking}
            onClose={this.linktoWeb}
          />
        )}
        {isShowModalInfoCancel && (
          <ModalInfoNewAccount
            accessibilityLabel={'newaccount_informationmodal'}
            onClose={this.actionModalEmail}
          />
        )}
        {isShowModalChangeEmail && !!user && (
          <ModalInfoChangeEmail
            accessibilityLabel={'newaccount_changeemailmodal'}
            onClose={this.toggleModalEmail}
            navigation={navigation}
            user={user}
          />
        )}
        <FormSteps total={3} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <View style={styles.containerInformation}>
                <View style={styles.principalImage}>
                  <Image
                    accessibilityLabel={'banner_image_left'}
                    style={styles.bannerPrincipalImage}
                    source={require('../../../assets/images/promo-transfiere.png')}
                  />
                </View>
                <View>
                  <Text
                    style={styles.titleText}
                    accessibilityLabel={'newaccountscreen_text_title'}
                  >
                    {L.newaccountscreen}
                  </Text>
                </View>
                <View style={styles.bannerContentRow}>
                  <View style={styles.bannerImageContainerLeft}>
                    <Image
                      accessibilityLabel={'banner_image_left'}
                      style={styles.bannerImage}
                      source={require('../../../assets/images/highlight-linear-left.png')}
                    />
                  </View>
                  <Text
                    style={[styles.textBannerHigh]}
                    accessibilityLabel={'newaccount_list_title'}
                  >
                    {L.newaccountscreen_title_savings}
                  </Text>
                  <View style={styles.bannerImageContainerRight}>
                    <Image
                      accessibilityLabel={'banner_image_right'}
                      style={styles.bannerImage}
                      source={require('../../../assets/images/highlight-linear-right.png')}
                    />
                  </View>
                </View>
                <View style={styles.listItem1}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'newaccount_list_item1'}
                      style={styles.listImage}
                      source={require('../../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.newaccountscreen_item_list1}
                      <Text style={styles.textFree}>
                        {L.newaccountscreen_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'newaccount_list_item2'}
                      style={styles.listImage}
                      source={require('../../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.newaccountscreen_item_list2}
                      <Text style={styles.textFree}>
                        {L.newaccountscreen_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'newaccount_list_item3'}
                      style={styles.listImage}
                      source={require('../../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.newaccountscreen_item_list3}
                      <Text style={styles.textFree}>
                        {L.newaccountscreen_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.nameContainerButton}>
                  <ButtonLink
                    accent={'primaryLight'}
                    accessibilityLabel={'newaccount_textlink_title_know_more'}
                    style={styles.textLinkView}
                    titleStyle={styles.buttonLinkText}
                    onPress={this.linktoWeb}
                    title={L.newaccountscreen_text4}
                    imageSource={require('../../../assets/images/arrow-icon.png')}
                    imagePosition={'right'}
                    imageStyle={styles.iconButton}
                  />
                </View>
              </View>

              {!!emailMasked && (
                <CardEmailNotify
                  emailMasked={emailMasked}
                  actionModal={this.actionModalEmail}
                  toggleModalEmail={this.toggleModalEmail}
                  message={L.newaccountscreen_cardemail_message}
                  tooltipMessage={L.newaccountscreen_cardemail_tooltip}
                  accessibilityLabelBase={'newaccountscreen_cardemail'}
                />
              )}

              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'newaccount_btn_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.instantcashchoosescreen_button_continue}
                  big
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type NewAccountScreenType = NewAccountScreen;
export default withFocused<NewAccountScreen, Props>(NewAccountScreen);
