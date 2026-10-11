import * as React from 'react';
import {
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import API from '../../../api';
import InfoContact from '../../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Alert,
  Button,
  ButtonExternal,
  SafeAreaView,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SectionHeader,
  SpacedView,
  TextInput,
  Header,
  Container,
  Content,
  CardView,
} from '../../../components/ui';
import Config from '../../../Config';
import { Colors, ErrorRequest } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Font, Validate } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { AlertEvent } from '../../../components/alert/AlertManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
  } as ViewStyle,
  delete: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  header: {
    marginBottom: 10,
  } as ViewStyle,
  currentText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  sectionHeader: {
    paddingTop: 20,
    marginBottom: 5,
  } as ViewStyle,
  textinput: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  deleteIcon: {
    width: 16,
    height: 16,
  } as ImageStyle,
});

const TAG = '[ChangeContactScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  current: string;
  isLoading: boolean;
  isLoadingResend: boolean;
  showDeletedModal: boolean;
  isLoadingDelete: boolean;
  showTryDeleteModal: boolean;
}

class ChangeContactScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.changecontactscreen_title,
  // };

  state: State = {
    current: '',
    isLoading: false,
    isLoadingResend: false,
    showDeletedModal: false,
    isLoadingDelete: false,
    showTryDeleteModal: false,
  };

  alias!: TextInput | null;

  goBack = () => {
    this.props.navigation.goBack();
  };

  saveContact = async () => {
    const alias = this.alias ? this.alias.getValue() : '';
    const isValid = this.isValid(alias);
    if (!isValid) {
      return;
    }

    this.setState({ isLoading: true });
    try {
      const { route } = this.props;

      const idFrequentContact = route.params && route.params.idFrequentContact;
      const accountNumber = route.params && route.params.accountNumber;
      // const idFrequentContact = navigation.getParam('idFrequentContact', '');
      // const accountNumber = navigation.getParam('accountNumber');
      const response = await API.Execute.transfersFrequentContactsEdit(
        idFrequentContact,
        alias,
        accountNumber
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'saveContact', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const { navigation } = this.props;
        navigation.navigate('ChangeContactSuccess', { response });
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'saveContact',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'saveContact', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'saveContact',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  isValid = (alias: string) => {
    if (alias.trim() === '') {
      this.alias &&
        this.alias.setError(
          L.changecontactscreen_textinput_new_alias_empty_error
        );
      return false;
    }
    return true;
  };
  deleteContact = () => {
    Log.debug(TAG, 'deleteContact');
  };
  finishDelete = () => {
    this.hideTryDelete();
    this.goBack();
  };

  delete = async () => {
    this.setState({ isLoadingDelete: true });
    try {
      const { route } = this.props;
      // const idFrequentContact = navigation.getParam('idFrequentContact', '');
      const idFrequentContact = route.params && route.params.idFrequentContact;
      const response = await API.Execute.transfersFrequentContactsDelete(
        idFrequentContact
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'delete', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        this.setState({
          showTryDeleteModal: false,
          showDeletedModal: true,
        });
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'delete',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'delete', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'delete',
        e,
      });
    }
    this.setState({ isLoadingDelete: false });
  };
  tryDelete = async () => {
    this.setState({ isLoadingDelete: true });
    try {
      const { route } = this.props;
      // const idFrequentContact = navigation.getParam('idFrequentContact', '');
      const idFrequentContact = route.params && route.params.idFrequentContact;
      const response = await API.Execute.transfersFrequentContactsDeletePre(
        idFrequentContact
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'tryDelete', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        this.setState({
          showTryDeleteModal: true,
          showDeletedModal: false,
        });
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'tryDelete',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'tryDelete', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'tryDelete',
        e,
      });
    }
    this.setState({ isLoadingDelete: false });
  };
  hideTryDelete = () => {
    this.setState({
      showTryDeleteModal: false,
      showDeletedModal: false,
    });
    Log.debug(TAG, 'hideTryDelete');
  };

  onChangeAlias = (value: string) => {
    if (value.trim() !== '') {
      this.alias && this.alias.clearError();
    }
  };
  trySubmitAlias = () => {
    if (!this.alias) {
      return;
    }
    const alias = this.alias.getValue();
    this.isValid(alias);
  };

  render() {
    const { isFocused, navigation, route } = this.props;
    // const accountNumber = navigation.getParam('accountNumber');
    // const alias = navigation.getParam('alias');
    const accountNumber = route.params && route.params.accountNumber;
    const alias = route.params && route.params.alias;
    const {
      showTryDeleteModal,
      isLoadingDelete,
      showDeletedModal,
    } = this.state;
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
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />

              {showTryDeleteModal && (
                <Alert
                  message={L.changecontactscreen_modal_trydelete_message}
                  onClose={this.hideTryDelete}
                  cancelButton={{
                    accessibilityLabel:
                      'changecontactscreen_button_modal_trydelete_close',
                    title: L.changecontactscreen_button_modal_trydelete_close,
                  }}
                  actionButton={{
                    accessibilityLabel:
                      'changecontactscreen_button_modal_trydelete_action',
                    title: L.changecontactscreen_button_modal_trydelete_action,
                    loading: isLoadingDelete,
                    onPress: this.delete,
                  }}
                />
              )}
              {showDeletedModal && (
                <Alert
                  message={L.changecontactscreen_modal_delete_message}
                  onClose={this.finishDelete}
                  actionButton={{
                    accessibilityLabel:
                      'changecontactscreen_button_modal_return',
                    title: L.changecontactscreen_button_modal_return,
                    onPress: this.finishDelete,
                  }}
                />
              )}
              <Header
                center
                style={styles.header}
                accessibilityLabel={'changecontactscreen_header_title'}
                title={L.changecontactscreen_header_title}
              />
              <CardView padding>
                <SectionHeader
                  style={[styles.sectionHeader, { paddingTop: 0 }]}
                  accessibilityLabel={
                    'changecontactscreen_sectionheader_current_alias'
                  }
                  title={L.changecontactscreen_sectionheader_current_alias}
                />
                <Text
                  style={styles.currentText}
                  accessibilityLabel={'changecontactscreen_text_current_alias'}
                >
                  {alias}
                </Text>
                <SectionHeader
                  style={[styles.sectionHeader]}
                  accessibilityLabel={
                    'changecontactscreen_sectionheader_new_alias'
                  }
                  title={L.changecontactscreen_sectionheader_new_alias}
                />
                <TextInput
                  blurOnSubmit
                  accessibilityLabel={'changecontactscreen_textinput_new_alias'}
                  ref={ref => {
                    this.alias = ref;
                  }}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  returnKeyType={'done'}
                  onChangeText={this.onChangeAlias}
                  onBlur={this.trySubmitAlias}
                  containerStyle={styles.textinput}
                  maxLength={Config.settings.maxLengthFrequentContact}
                />
                <SectionHeader
                  style={styles.sectionHeader}
                  accessibilityLabel={
                    'changecontactscreen_sectionheader_account_number'
                  }
                  title={L.changecontactscreen_sectionheader_account_number}
                />
                <Text
                  style={styles.currentText}
                  accessibilityLabel={'changecontactscreen_text_account_number'}
                >
                  {accountNumber}
                </Text>
              </CardView>
              <SpacedView style={styles.buttons}>
                <Button
                  light
                  accessibilityLabel={'changecontactscreen_button_back'}
                  onPress={this.goBack}
                  title={L.changecontactscreen_button_back}
                />
                <Button
                  accessibilityLabel={'changecontactscreen_button_save'}
                  onPress={this.saveContact}
                  title={L.changecontactscreen_button_save}
                />
              </SpacedView>
              <ButtonExternal
                underline
                accent
                imageSource={require('../../../assets/images/delete-accent-icon.png')}
                imageStyle={styles.deleteIcon}
                isLoading={isLoadingDelete}
                style={styles.delete}
                accessibilityLabel={'changecontactscreen_button_delete'}
                onPress={this.tryDelete}
                title={L.changecontactscreen_button_delete}
              />
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'changecontactscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ChangeContactScreenType = ChangeContactScreen;
export default withFocused<ChangeContactScreen, Props>(ChangeContactScreen);
