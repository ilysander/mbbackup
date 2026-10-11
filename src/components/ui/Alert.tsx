import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { AnalyticsLabelsType } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Button from './Button';
import SpacedView from './SpacedView';
import Modal, { ModalProps } from './Modal';
const styles = StyleSheet.create({
  buttonImage: {
    alignItems: 'flex-end',
  } as ViewStyle,
  container: {
    marginTop: 0,
    marginBottom: 30,
    marginHorizontal: 20,
  } as ViewStyle,
  modal: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    paddingBottom: 0,
    borderRadius: 6,
    paddingHorizontal: 0,
  } as ViewStyle,
  optionUniqueButton: {
    alignSelf: 'center',
  } as ViewStyle,
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.white,
  } as ViewStyle,
  buttons: {
    marginTop: 20,
    alignItems: 'center',
  } as ViewStyle,
  message: {
    color: Colors.grey5,
    lineHeight: 20,
    ...Font(),
    fontSize: 14,
  } as TextStyle,
  textButton: {
    fontSize: 16,
  } as ViewStyle,
  closeButtonImage: {
    marginBottom: 6,
    width: 15,
    height: 15,
    tintColor: Colors.grey4,
  } as ImageStyle,
});

export interface AlertButtonProps {
  onPress?: () => void;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
  loading?: boolean;
  preventClose?: boolean;
  light?: boolean;
  typeColor?:
    | 'primaryLight'
    | 'primary'
    | 'secondary'
    | 'accentDark'
    | 'accent'
    | 'danger'
    | 'neutral';
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  title: string;
}

export interface AlertProps extends ModalProps {
  message?: string | React.ReactNode[] | React.ReactChild;
  cancelButton?: AlertButtonProps;
  actionButton?: AlertButtonProps;
  withCloseButton?: boolean;
  onClose?: () => void;
  onReject?: () => void;
  buttonsComponents?: React.ReactNode;
}

export interface AlertState {}

export default class Alert extends React.Component<AlertProps, AlertState> {
  state: AlertState = {};

  onClose = () => {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  onCancel = () => {
    const { cancelButton } = this.props;
    if (!cancelButton) {
      return;
    }
    const { onPress, preventClose } = cancelButton;
    if (typeof onPress === 'function') {
      onPress();
    }
    /**
     * Eliminar en un futuro this.onClose();
     * porque no es necesario forzar una acción
     * preventClose debería ser el standart
     */
    !preventClose && this.onClose();
  };

  onSuccess = () => {
    const { actionButton } = this.props;
    if (!actionButton) {
      return;
    }
    const { onPress, preventClose } = actionButton;
    if (typeof onPress === 'function') {
      onPress();
    }
    /**
     * Eliminar en un futuro this.onClose();
     * porque no es necesario forzar una acción
     * preventClose debería ser el standart
     */
    !preventClose && this.onClose();
  };

  render() {
    const {
      message,
      style,
      onClose,
      onReject,
      cancelButton,
      actionButton,
      buttonsComponents,
      ...props
    } = this.props;
    return (
      <Modal onClose={() => this.onClose()} {...props} style={styles.modal}>
        <View style={styles.container}>
          <View style={[styles.content, style]}>
            {typeof message === 'string' ? (
              <Text style={styles.message}>{message}</Text>
            ) : (
              message
            )}
          </View>
          {!buttonsComponents && (
            <SpacedView style={styles.buttons}>
              {cancelButton && (
                <Button
                  light={cancelButton.light || true}
                  typeColor={cancelButton.typeColor || 'accentDark'}
                  textStyle={styles.textButton}
                  medium
                  {...cancelButton}
                  style={[
                    !actionButton && styles.optionUniqueButton,
                    cancelButton.style,
                  ]}
                  onPress={() => this.onCancel()}
                />
              )}
              {actionButton && (
                <Button
                  typeColor={actionButton.typeColor || 'accentDark'}
                  textStyle={styles.textButton}
                  medium
                  {...actionButton}
                  style={[
                    !cancelButton && styles.optionUniqueButton,
                    actionButton.style,
                  ]}
                  onPress={() => this.onSuccess()}
                />
              )}
            </SpacedView>
          )}
          {!!buttonsComponents && buttonsComponents}
        </View>
      </Modal>
    );
  }
}
