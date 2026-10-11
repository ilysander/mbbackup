import * as React from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { KeyboardUtil } from '../../resources/util';
import NetworkManager from '../network/NetworkManager';
import {
  ConfirmModal,
  Loading,
  NetworkStatusAlert,
  TextInputCode,
} from '../ui';
import { ModalProps } from '../ui/Modal';

const styles = StyleSheet.create({
  descriptionText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  codeTitleText: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    marginTop: 10,
    fontSize: 14,
    marginBottom: 4,
  } as TextStyle,
  header: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accentDark,
    fontSize: 18,
    paddingBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  codeContainer: {
    marginTop: 2,
    maxWidth: 280,
    alignItems: 'center',
  } as ViewStyle,
  modalContainer: {
    paddingBottom: 0,
  } as ViewStyle,
  networkStatus: {
    margin: 4,
    marginBottom: 8,
    width: '100%',
  } as ViewStyle,
});

const TAG = '[ValidationModal]';

export interface ValidationModalProps extends ModalProps {
  onResend?: () => Promise<void>;
  onSuccess?: (code?: string) => void;
  type?: 'otp' | 'atm';
  errorCode?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  description?: string;
  placeholderText?: string;
  formatText?: any;
}

export interface ValidationModalState {
  isLoadingResend: boolean;
  isCompletedCode: boolean;
  isAllowedReadSMS: boolean;
}

export default class ValidationModal extends React.Component<
  ValidationModalProps,
  ValidationModalState
> {
  static defaultProps = {
    type: 'otp',
  };

  state: ValidationModalState = {
    isLoadingResend: false,
    isCompletedCode: false,
    isAllowedReadSMS: false,
  };

  input!: TextInputCode | null;
  modal!: ConfirmModal | null;
  interaction: any;

  isLoadingAny = () => {
    const { isLoading } = this.props;
    const { isLoadingResend } = this.state;
    return isLoading || isLoadingResend;
  };

  isValid = () => {
    if (!this.input) {
      return false;
    }
    return this.input.isValid();
  };

  getValue = () => {
    if (!this.input) {
      return;
    }
    return this.input.getValue();
  };

  setError = (message?: string) => {
    this.input && this.input.setError(message);
  };
  clearError = () => {
    this.setError(undefined);
  };

  onSuccess = () => {
    Log.debug(TAG, 'onSuccess');
    if (this.isLoadingAny()) {
      return;
    }
    if (!this.input) {
      return;
    }
    const codeIsValid = this.input.isValid();
    if (!codeIsValid || !NetworkManager.isConnected) {
      return;
    }

    const { onSuccess } = this.props;
    if (typeof onSuccess === 'function') {
      onSuccess(this.input.getValue());
    }
    this.blur();
  };

  onCancel = () => {
    Log.debug(TAG, 'onCancel');
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  onClose = () => {
    Log.debug(TAG, 'onClose');
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  onCompleteCode = () => {
    this.setState({ isCompletedCode: true });

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(() => {
      this.props.type === 'otp' && this.onSuccess();
    });
  };

  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.input && this.input.setValue(code);
  };

  onResend = async () => {
    this.setState({ isLoadingResend: true });

    try {
      const { onResend } = this.props;
      if (typeof onResend === 'function') {
        await onResend();
      }
    } catch (e) {
      Log.warn(TAG, 'onResend', e);
    }

    this.setState({ isLoadingResend: false }, () => {
      this.focusIfAllowed();
    });
  };

  componentDidUpdate(prevProps: ValidationModalProps) {
    if (prevProps.errorCode !== this.props.errorCode) {
      this.focusIfAllowed();
    }
  }

  focus = () => {
    Log.debug(TAG, 'focus');
    this.input && this.input.focus();
  };
  blur = () => {
    Log.debug(TAG, 'blur');
    KeyboardUtil.hide();
  };

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
  }

  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };

  onCheckPermissions = (isAllowedReadSMS: boolean) => {
    this.setState({ isAllowedReadSMS }, () => {
      this.focusIfAllowed();
    });
  };

  render() {
    const {
      title,
      description,
      placeholderText,
      children,
      formatText,
      type,
      /* NOSONAR */ onResend,
      isLoading,
      ...props
    } = this.props;
    const { isLoadingResend, isCompletedCode } = this.state;
    const isLoadingAny = this.isLoadingAny();
    return (
      <ConfirmModal
        accessibilityLabel={'validationmodal'}
        ref={ref => {
          this.modal = ref;
        }}
        {...props}
        isDisabled={!isCompletedCode}
        isLoading={isLoadingAny}
        onSuccess={this.onSuccess}
        onCancel={this.onCancel}
        onClose={this.onClose}
        containerStyle={styles.modalContainer}
      >
        <NetworkStatusAlert style={styles.networkStatus} />
        <Text style={styles.header}>{L.validationmodal_title}</Text>
        <Text style={styles.descriptionText}>
          {description || L.validationmodal_send_code_text}
        </Text>
        <Text style={styles.codeTitleText}>
          {placeholderText || L.validationmodal_write_code}
        </Text>

        <View style={styles.codeContainer}>
          {!isLoadingResend && (
            <TextInputCode
              accessibilityLabel={'validationmodal_textinput_otp'}
              ref={ref => {
                this.input = ref;
              }}
              editable={!isLoading}
              customKeyboardType={'numeric'}
              keyboardType={'numeric'}
              secureTextEntry={type === 'atm'}
              formatText={formatText}
              onSubmitEditing={this.onSuccess}
              onCompleteCode={this.onCompleteCode}
              blurOnSubmit
              autoCorrect={false}
            />
          )}
          {isLoadingResend && <Loading size={'large'} color={Colors.primary} />}
        </View>
        {children}
      </ConfirmModal>
    );
  }
}
