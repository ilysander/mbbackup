import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { PreferencesUserDataModifyPreResponse } from '../../api/backend/response/Execute';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import Alert from '../ui/Alert';

const styles = StyleSheet.create({
  alertMessageType: {
    fontSize: 20,
    paddingHorizontal: 5,
    color: Colors.primary,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    marginBottom: 10,
  } as TextStyle,
  alertMessageReminder1: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  alertMessageReminder1Bold: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  button: {
    minHeight: 40,
    width: '100%',
  } as ViewStyle,
});

export interface Params { }
export interface ModalInfoNoEmailProps {
  onClose?: () => void;
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  user: PreferencesUserDataModifyPreResponse;
}

export interface ModalInfoNoEmailState { }

export default class ModalInfoNoEmail extends React.Component<
  ModalInfoNoEmailProps,
  ModalInfoNoEmailState
> {
  onAction = () => {
    const { navigation, user } = this.props;
    navigation.navigate('ChangeEmailStart', { user });
  };
  render() {
    const { onClose } = this.props;
    return (
      <Alert
        withCloseButton
        message={
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/images/adn-man-important.png')}
              />
            </View>
            <Text style={styles.alertMessageType}>
              {L.modalinfonoemail_title}
            </Text>
            <Text style={styles.alertMessageReminder1}>
              {L.modalinfonoemail_messsage1}
              <Text style={styles.alertMessageReminder1Bold}>
                {L.modalinfonoemail_messsage2}
              </Text>
              {L.modalinfonoemail_messsage3}
            </Text>
          </View>
        }
        actionButton={{
          accessibilityLabel: 'modalinfonoemail_btn_action',
          title: L.modalinfonoemail_btn_action,
          onPress: this.onAction,
          style: styles.button,
          typeColor: 'primary',
        }}
        onClose={onClose}
      />
    );
  }
}
