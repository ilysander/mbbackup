import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
  Text,
  ImageStyle,
  View,
  Image,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import Header from './Header';
import Button from './Button';
import Modal from './Modal';
import { L } from '../../resources/language';

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
    marginTop: 10,
    marginBottom: 5,
  } as ViewStyle,
  headerTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 20,
  } as TextStyle,
  buttonAddCel: {
    marginTop: 20,
    minWidth: 280,
    backgroundColor: Colors.primary,
    borderColor: Colors.white,
    minHeight: 41,
    borderWidth: 0,
  } as ViewStyle,
  buttonCelTitle: {
    fontSize: 16,
    color: Colors.white,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    elevation: 3,
  } as ViewStyle,
  buttonColumn: {
    flex: 1,
    marginBottom: '10%',
  } as ViewStyle,
  textColumn: {
    flex: 1,
    paddingHorizontal: 30,
  } as TextStyle,
  messageSelecc: {
    fontSize: 14,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  celphoneText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    marginVertical: 5,
  } as TextStyle,
  icon: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  } as ImageStyle,
  modalPopUp: {
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    height: '110%',
  } as ViewStyle,
  modalConPopUp: {
    borderRadius: 20,
  } as ViewStyle,
});

export interface PopUpCelConfirmModalProps extends ViewProps {
  isVisible: boolean;
  name?: string;
  mobilePhone?: string;
  closeModal: () => void;
}

export interface PopUpCelConfirmModalState {}

export default class PopUpCelConfirmModal extends React.Component<
  PopUpCelConfirmModalProps,
  PopUpCelConfirmModalState
> {
  closeModal = () => {
    const { closeModal } = this.props;
    if (typeof closeModal === 'function') {
      closeModal();
    }
  };

  render() {
    const { isVisible, name, mobilePhone } = this.props;

    return (
      <Modal
        visible={isVisible}
        accessibilityLabel={'popupcelconfirmmodal_modal'}
        onClose={this.closeModal}
        containerStyle={styles.modalPopUp}
        contentStyle={styles.modalConPopUp}
      >
        <View style={styles.container}>
          <Image
            accessibilityLabel={'popupcelconfirmmodal_header_icon'}
            style={styles.icon}
            source={require('../../assets/images/adn-man-adv.png')}
          />
          <Header
            accessibilityLabel={'popupcelconfirmmodal_header'}
            title={`${L.popupcelconfirmmodal_name} ${Sanitizer.titleCase(
              name
            )}`}
            titleStyle={styles.headerTitle}
            style={styles.header}
          />
          <View style={styles.textColumn}>
            <Text style={[styles.messageText]}>
              {L.popupcelconfirmmodal_title}
            </Text>
            {!!mobilePhone && (
              <Text style={[styles.celphoneText]}>
                {Sanitizer.maskPhone(mobilePhone)}
              </Text>
            )}
            <Text style={[styles.messageText]}>
              <Text style={[styles.messageSelecc]}>
                {L.popupcelconfirmmodal_text_part1}
              </Text>
              {L.popupcelconfirmmodal_text_part2}
            </Text>
          </View>
          <View style={styles.buttonColumn}>
            <Button
              onPress={this.closeModal}
              style={styles.buttonAddCel}
              textStyle={styles.buttonCelTitle}
              accessibilityLabel={'popupcelconfirmmodal_button_accept'}
              typeColor="primaryLight"
              title={L.popupcelconfirmmodal_modal_button}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
