import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { AccountItemAll } from '../../api/backend/response/Execute';
import { Colors, ErrorRequest } from '../../resources/constants';
import { Button, TextInput } from '../ui';
import Font from '../../resources/functions/Font';
import { Sanitizer, Validate } from '../../resources/functions';
import API from '../../api';
import Log from '../../resources/log/Log';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../alert/AlertManager';
import { L } from '../../resources/language';
import NetworkManager from '../network/NetworkManager';
import { DefaultErrorResponse } from '../../api/backend/response/Error';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
  } as ViewStyle,
  ButtonPadding: {
    paddingHorizontal: 10,
  } as ViewStyle,
  infoContainer: {
    flex: 1,
  } as ViewStyle,
  buttonContainer: {
    marginLeft: 10,
    marginTop: 4,
    minWidth: 26,
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
    lineHeight: 25,
    paddingTop: 2,
    color: Colors.grey6,
  } as TextStyle,
  input: {
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    lineHeight: 19,
    color: Colors.grey6,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
  } as TextStyle,
  subtitleText: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey4,
  } as TextStyle,
  buttonText: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
    color: Colors.primary,
  } as TextStyle,
  inputContainer: {
    marginTop: 0,
    marginBottom: 4,
  } as TextStyle,
  buttonIcon: {
    width: 15,
    height: 16,
    color: Colors.primary,
    tintColor: Colors.primary,
  } as ImageStyle,
});
const MaxLength = {
  Description: 50,
};
const TAG = '[RenameAccount]';
export interface RenameAccountProps extends ViewProps {
  account: AccountItemAll;
  accessibilityLabel: string;
}

export interface RenameAccountState {
  isRenaming: boolean;
  isLoading: boolean;
  alias: string;
  isValid: boolean;
}

export default class RenameAccount extends React.Component<
  RenameAccountProps,
  RenameAccountState
> {
  state = {
    isRenaming: false,
    isLoading: false,
    isValid: false,
    alias: '',
  };

  alias!: TextInput | null;

  onBlur = () => {
    this.setState({ isRenaming: false });
  };

  componentDidMount() {
    const { account } = this.props;
    this.setState({ alias: account.productAlias || '' });
  }
  showRenameForm = () => {
    const { alias } = this.state;
    this.setState({ isRenaming: true }, () => {
      if (this.alias) {
        this.alias.setValue(alias);
        this.alias.focus();
      }
    });
  };
  onChangeDescription = () => {
    this.isValid();
  };
  isValidAlias = (_showErrors = false) => {
    if (!this.alias) {
      return false;
    }
    this.alias.clearError();
    return true;
  };
  isValid = (showErrors = true) => {
    const isValid = [
      this.isValidAlias(showErrors),
      NetworkManager.isConnected,
    ].every(value => value);

    this.setState({ isValid });
    return isValid;
  };

  tryToSubmit = async () => {
    if (!this.isValid()) {
      return;
    }

    this.setState({ isLoading: true });
    await this.submit();
    this.setState({ isLoading: false });
  };
  submit = async () => {
    const { account } = this.props;
    try {
      const alias = this.alias ? this.alias.getValue() : '';
      const response = await API.Execute.coreProductChangeAlias(
        account.idProduct,
        alias
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
        this.setState({ alias: resume.alias }, () => {
          this.alias && this.alias.blur();
        });
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.alias) {
        this.alias && this.alias.setError(error.alias);
        hasError = true;
      }
      !hasError &&
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
  render() {
    const { account, style, accessibilityLabel, ...props } = this.props;
    const { isLoading, isRenaming, alias } = this.state;
    const label = account.label || account.shortLabel;

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'renameaccount'}
        style={[styles.container, style]}
        {...props}
      >
        <View style={styles.infoContainer}>
          {isRenaming && (
            <>
              <TextInput
                blurOnSubmit
                placeholder={L.renameaccount_example}
                onSubmitEditing={this.tryToSubmit}
                accessibilityLabel={'renameaccount_textinput_alias'}
                autoCapitalize={'none'}
                keyboardType={'default'}
                autoCorrect={false}
                maxLength={MaxLength.Description}
                multiline
                showClearButton={false}
                ref={ref => {
                  this.alias = ref;
                }}
                onBlur={this.onBlur}
                style={styles.input}
                onChangeText={this.onChangeDescription}
                containerStyle={styles.inputContainer}
              />
            </>
          )}
          {!isRenaming && (
            <>
              {!!alias && (
                <>
                  <Text style={styles.titleText}>{'‘' + alias + '’'}</Text>
                  <Text style={styles.subtitleText}>
                    {Sanitizer.cleanProductLabel(label, account)}
                  </Text>
                </>
              )}
              {!alias && (
                <Text style={styles.titleText}>
                  {Sanitizer.cleanProductLabel(label, account)}
                </Text>
              )}
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isRenaming && (
            <Button
              loading={isLoading}
              onPress={this.tryToSubmit}
              small
              typeColor={'primary'}
              title={isLoading ? undefined : L.renameaccount_button_save}
              accessibilityLabel={'renameaccount_button_save'}
            />
          )}
          {!isRenaming && (
            <Button
              onPress={this.showRenameForm}
              light
              small
              style={styles.ButtonPadding}
              typeColor={'primary'}
              title={L.renameaccount_button_edit}
              textStyle={styles.buttonText}
              accessibilityLabel={'renameaccount_button_edit'}
              imageSource={require('../../assets/images/icon-edit.png')}
              imageStyle={styles.buttonIcon}
            />
          )}
        </View>
      </View>
    );
  }
}
