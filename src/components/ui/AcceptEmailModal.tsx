import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
  Text,
  ImageStyle,
  View,
} from 'react-native';
import { L } from '../../resources/language';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
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
  actionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingVertical: 9,
    borderColor: Colors.danger,
  } as ViewStyle,
  messageText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  image: {
    width: 80,
    height: 80,
  } as ImageStyle,
  header: {
    marginBottom: 10,
  } as ViewStyle,
  headerTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 20,
  } as TextStyle,
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    elevation: 3,
  } as ViewStyle,
  textColumn: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  } as TextStyle,
});

export interface AcceptEmailModalProps extends ViewProps {
  isVisible: boolean;
  closeModal: () => void;
}

export interface AcceptEmailModalState {}

export default class AcceptEmailModal extends React.Component<
  AcceptEmailModalProps,
  AcceptEmailModalState
> {
  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };

  render() {
    const { isVisible } = this.props;

    return (
      <Modal
        visible={isVisible}
        accessibilityLabel={'acceptemailmodal_modal'}
        onClose={this.closeModal}
      >
        <View style={styles.container}>
          <View style={styles.textColumn}>
            <Header
              accessibilityLabel={'acceptemailmodal_header'}
              title={L.acceptemailmodal_modal_title}
              titleStyle={styles.headerTitle}
              style={styles.header}
            />
            <Text style={[styles.messageText]}>
              {L.acceptemailmodal_modal_body}
            </Text>
          </View>
          <Button
            onPress={this.closeModal}
            accessibilityLabel={'acceptemailmodal_button_accept'}
            title={L.acceptemailmodal_modal_addbutton}
          />
        </View>
      </Modal>
    );
  }
}
