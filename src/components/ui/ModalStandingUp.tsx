import * as React from 'react';
import {
  Modal as BaseModal,
  ModalProps as BaseModalProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import KeyboardSpacing from './KeyboardSpacing';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.modal,
  } as ViewStyle,
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  } as ViewStyle,
});

export interface ModalProps extends BaseModalProps {
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export interface ModalState {}

export default class Modal extends React.Component<ModalProps, ModalState> {
  render() {
    const {
      visible,
      children,
      onClose,
      style,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <BaseModal
        visible={visible}
        animationType={'fade'}
        transparent
        onRequestClose={onClose}
        {...props}
      >
        <StatusBar
          backgroundColor={Colors.grey4}
          barStyle={'dark-content'}
          animated
        />
        <KeyboardSpacing style={[styles.container]}>
          <Touchable
            activeOpacity={1}
            style={styles.overlay}
            onPress={onClose}
            accessibilityLabel={'modal_overlay'}
          />
          {children}
        </KeyboardSpacing>
      </BaseModal>
    );
  }
}
