import * as React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { L } from '../../resources/language';
import Alert from './Alert';
import { ModalProps } from './Modal';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  } as ViewStyle,
  cancelWarningTextStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
  } as TextStyle,
  cancelWarningStyle: {
    minHeight: 40,
    borderColor: Colors.grey4,
  } as ViewStyle,
  successWarningTextStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.danger,
  } as TextStyle,
  successWarningStyle: {
    minHeight: 40,
    borderColor: Colors.danger,
    backgroundColor: Colors.white,
  } as ViewStyle,
});

export interface ConfirmModalProps extends ModalProps {
  onSuccess?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  isWarningMode?: boolean;
  actionTitle?: string;
  cancelTitle?: string;
}

export interface ConfirmModalState {}

export default class ConfirmModal extends React.Component<
  ConfirmModalProps,
  ConfirmModalState
> {
  render() {
    const {
      children,
      onSuccess,
      isLoading,
      isDisabled,
      onCancel,
      isWarningMode,
      actionTitle,
      cancelTitle,
      ...props
    } = this.props;
    return (
      <Alert
        accessibilityLabel={'confirmmodal'}
        cancelButton={
          onCancel
            ? {
                accessibilityLabel: 'confirmmodal_button_cancel',
                title: cancelTitle || L.confirmmodal_cancel,
                preventClose: true,
                onPress: onCancel,
                style: isWarningMode ? styles.cancelWarningStyle : undefined,
                textStyle: isWarningMode
                  ? styles.cancelWarningTextStyle
                  : undefined,
              }
            : undefined
        }
        actionButton={
          onSuccess
            ? {
                accessibilityLabel: 'confirmmodal_button_success',
                onPress: onSuccess,
                loading: isLoading,
                preventClose: true,
                title: actionTitle || L.confirmmodal_accept,
                style: isWarningMode ? styles.successWarningStyle : undefined,
                textStyle: isWarningMode
                  ? styles.successWarningTextStyle
                  : undefined,
              }
            : undefined
        }
        message={<View style={styles.body}>{children}</View>}
        {...props}
      />
    );
  }
}
