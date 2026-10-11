import * as React from 'react';
import { StyleSheet, ViewProps, ViewStyle, TextStyle } from 'react-native';
import { L } from '../../resources/language';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { AlertModal } from '../ui';

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
});

export interface UnrollmentModalProps extends ViewProps {
  selectedPhoneName: string;
  thisPhone: boolean;
  visible: boolean;
  isUnrolling?: boolean;
  unrollDevice: () => void;
  closeModal: () => void;
}

export interface UnrollmentModalState {}

export default class UnrollmentModal extends React.Component<
  UnrollmentModalProps,
  UnrollmentModalState
> {
  unrollDevice = () => {
    const { unrollDevice } = this.props;
    if (typeof unrollDevice === 'function') {
      unrollDevice();
    }
  };

  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };
  render() {
    const { selectedPhoneName, thisPhone, visible, isUnrolling } = this.props;
    return (
      <AlertModal
        title={`${
          L.unrollment_alertmodal_title_part1
        }${' '}‘${selectedPhoneName}’${' '}${
          L.unrollment_alertmodal_title_part2
        }`}
        message={thisPhone ? '' : L.unrollment_alertmodal_message}
        imgNeedTint={false}
        notShowIcon={true}
        visible={visible}
        messageStyle={styles.message}
        titleStyle={styles.title}
        actionButton={{
          accessibilityLabel: 'unrollmentmodal_alertmodal_actionbutton',
          title: isUnrolling ? '' : L.unrollment_alertmodal_takeoutactionbutton,
          preventClose: true,
          onPress: this.unrollDevice,
          textStyle: styles.actionButtonText,
          style: styles.actionButton,
          loading: isUnrolling,
          light: true,
        }}
        cancelButton={{
          accessibilityLabel: 'unrollmentmodal_alertmodal_cancelbutton',
          title: L.unrollment_alertmodal_cancelactionbutton,
          preventClose: true,
          onPress: this.closeModal,
          textStyle: styles.cancelText,
          style: styles.cancelButton,
        }}
        onClose={this.closeModal}
      />
    );
  }
}
