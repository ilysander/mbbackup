import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
  Text,
  View,
} from 'react-native';
import { L } from '../../resources/language';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
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
    fontSize: 22,
    lineHeight: 25,
    paddingVertical: 0,
    marginVertical: 10,
  } as TextStyle,
  cancelButton: {
    borderColor: Colors.primary,
    paddingVertical: 9,
    borderWidth: 1,
    backgroundColor: Colors.white,
    width: '100%',
  } as ViewStyle,
  cancelText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primary,
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
  lightText: {
    ...Font({ weight: 'Medium' }),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey5,
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

export interface OpenAccountModalProps extends ViewProps {
  visible: boolean;
  openAccount: () => void;
  closeModal: () => void;
}

export interface OpenAccountModalState {}

export default class OpenAccountModal extends React.Component<
  OpenAccountModalProps,
  OpenAccountModalState
> {
  openAccount = () => {
    const { openAccount } = this.props;
    if (typeof openAccount === 'function') {
      openAccount();
    }
  };

  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };

  render() {
    const { visible } = this.props;
    return (
      <AlertModal
        title={`${L.openaccountmodal_alertmodal_title_part1}${'\n'}${
          L.openaccountmodal_alertmodal_title_part2
        }`}
        bodyTextComponent={
          <>
            <Text style={styles.lightText}>
              {L.openaccountmodal_alertmodal_message_part1}
              <Text style={styles.boldText}>
                {L.openaccountmodal_alertmodal_message_part2}
              </Text>
              <Text style={styles.lightText}>
                {L.openaccountmodal_alertmodal_message_part3}
              </Text>
            </Text>
          </>
        }
        icon={require('../../assets/images/icon_baghand.png')}
        imgNeedTint={true}
        buttonsComponents={
          <View style={styles.buttons}>
            <Button
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
              allowOnPress
              accessibilityLabel={'openaccountmodal_alertmodal_actionbutton'}
              onPress={this.openAccount}
              title={L.openaccountmodal_alertmodal_openAccount}
            />

            <Button
              style={styles.cancelButton}
              textStyle={styles.cancelText}
              allowOnPress
              accessibilityLabel={'openaccountmodal_alertmodal_cancelbutton'}
              onPress={this.closeModal}
              title={L.openaccountmodal_alertmodal_cancelactionbutton}
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
