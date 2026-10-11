import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Image,
  View,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Header from './Header';
import Button from './Button';
import Modal from './Modal';

const styles = StyleSheet.create({
  message: {
    color: Colors.grey6,
    fontSize: 14,
    marginHorizontal: 16,
    textAlign: 'center',
    marginTop: 20,
    ...Font(),
  } as ViewStyle,
  title: {
    color: Colors.danger,
    fontSize: 18,
    lineHeight: 22,
    paddingVertical: 0,
  } as TextStyle,
  cancelButton: {
    borderColor: Colors.grey5,
    paddingVertical: 9,
  } as ViewStyle,
  cancelText: {
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
  actionButtonText: {
    color: Colors.danger,
    fontSize: 16,
  } as TextStyle,
  actionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingVertical: 9,
    borderColor: Colors.danger,
  } as ViewStyle,
  messageTextAccent: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
  } as TextStyle,
  messageText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
  } as TextStyle,
  image: {
    width: 80,
    height: 80,
  } as ImageStyle,
  header: {
    marginTop: 10,
    marginBottom: 5,
  } as ViewStyle,
  headerTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 20,
  } as TextStyle,
  buttonAddEmail: {
    marginTop: 20,
    minWidth: 280,
    backgroundColor: Colors.primary,
    borderColor: Colors.white,
    minHeight: 41,
    borderWidth: 0,
  } as ViewStyle,
  buttonAddEmailTitle: {
    fontSize: 14,
    color: Colors.white,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
    elevation: 3,
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonCancel: {
    marginTop: 20,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  } as ViewStyle,
  buttonCancelTitle: {
    fontSize: 14,
    color: Colors.primary,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  buttonColumn: {
    marginTop: 20,
  } as ViewStyle,
  textColumn: {
    flex: 1,
    paddingHorizontal: 10,
  } as TextStyle,
});

export interface EmailStatusModalProps extends ViewProps {
  isVisible: boolean;
  title: string;
  body: string | React.ReactNode;
  actionButtonTitle: string;
  cancelButtonTitle: string;
  goToChangeEmail: () => void;
  closeModal: () => void;
  closeAllModal: () => void;
}

export interface EmailStatusModalState { }

export default class EmailStatusModal extends React.Component<
  EmailStatusModalProps,
  EmailStatusModalState
> {
  goToChangeEmail = () => {
    const { goToChangeEmail } = this.props;
    if (typeof goToChangeEmail === 'function') {
      goToChangeEmail();
    }
  };

  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };

  closeAllModal = () => {
    const { closeAllModal } = this.props;
    if (typeof closeAllModal === 'function') {
      closeAllModal();
    }
  };

  render() {
    const {
      isVisible,
      title,
      body,
      cancelButtonTitle,
      actionButtonTitle,
    } = this.props;
    return (
      <Modal
        visible={isVisible}
        accessibilityLabel={'emailstatusmodal_modal'}
        onClose={this.closeAllModal}
      >
        <View style={styles.container}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/adn-hombre-correo.png')}
              resizeMode={'contain'}
              style={styles.image}
            />
            <Header
              accessibilityLabel={'emailstatusmodal_header'}
              title={title}
              titleStyle={styles.headerTitle}
              style={styles.header}
            />
          </View>
          {!!body && <View style={styles.textColumn}>{body}</View>}
          <View style={styles.buttonColumn}>
            <Button
              onPress={this.goToChangeEmail}
              // style={styles.buttonAddEmail}
              // textStyle={styles.buttonAddEmailTitle}
              accessibilityLabel={'emailstatusmodal_button_parcial_changemail'}
              // typeColor="primaryLight"
              title={actionButtonTitle}
              style={{ marginBottom: 20 }}
            />
            <Button
              onPress={this.closeModal}
              // style={styles.buttonCancel}
              // textStyle={styles.buttonCancelTitle}
              accessibilityLabel={'emailstatusmodal_button_parcial_close'}
              title={cancelButtonTitle}
              light
            />
          </View>
        </View>
      </Modal>
    );
  }
}
