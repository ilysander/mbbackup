import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { AlertModal, Button } from '../ui';

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
    color: Colors.primary,
    fontSize: 20,
    lineHeight: 25,
    ...Font({ weight: 'Bold' }),
    paddingVertical: 0,
    marginVertical: 10,
  } as TextStyle,
  cancelButton: {
    borderColor: Colors.primary,
    paddingVertical: 9,
    borderWidth: 1,
    height: 40,
    backgroundColor: Colors.primary,
    width: '100%',
  } as ViewStyle,
  cancelText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    fontSize: 16,
  } as TextStyle,
  actionButtonText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    fontSize: 16,
  } as TextStyle,
  actionButton: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: 9,
    borderColor: Colors.primary,
    width: '100%',
    marginBottom: 20,
  } as ViewStyle,
  AdText: {
    ...Font({ weight: 'Regular' }),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey6,
    marginBottom: 30,
  } as TextStyle,
  boldText: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  buttons: {
    flex: 1,
  },
});

export interface LoginIncorrectInfoModalProps extends ViewProps {
  visible: boolean;
  title?: string;
  text?: string;
  closeModal: () => void;
}

export interface LoginIncorrectInfoModalState {}

export default class LoginIncorrectInfoModal extends React.Component<
  LoginIncorrectInfoModalProps,
  LoginIncorrectInfoModalState
> {
  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };

  render() {
    const { visible, title, text } = this.props;
    return (
      <AlertModal
        title={title}
        message={text}
        messageStyle={styles.AdText}
        icon={require('../../assets/images/adn-alerta.png')}
        iconStyle={{ width: 80, height: 80 }}
        imgNeedTint={true}
        buttonsComponents={
          <View style={styles.buttons}>
            <Button
              style={styles.cancelButton}
              textStyle={styles.cancelText}
              allowOnPress
              accessibilityLabel={'loginincorrectinfomodal_btn_ok'}
              onPress={this.closeModal}
              title={L.loginincorrectinfomodal_btn_ok}
            />
          </View>
        }
        notShowIcon={false}
        visible={visible}
        titleStyle={styles.title}
        onClose={this.closeModal}
      />
    );
  }
}
