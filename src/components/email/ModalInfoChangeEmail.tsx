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
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';
import AnalyticsEvent from '../../resources/analytics/AnalyticsEvent';

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
  button: {
    minHeight: 40,
    width: '100%',
  } as ViewStyle,
});

export interface Params { }
export interface ModalInfoChangeEmailProps {
  onClose?: () => void;
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  user: PreferencesUserDataModifyPreResponse;
}

export interface ModalInfoChangeEmailState { }

export default class ModalInfoChangeEmail extends React.Component<
  ModalInfoChangeEmailProps,
  ModalInfoChangeEmailState
> {
  onAction = () => {
    const { navigation, user, accessibilityLabel } = this.props;
    AnalyticsEvent.track(accessibilityLabel, L.modalinfochangeemail_btn_action)
    navigation.navigate('UpdateEmailStart', { user });
  };
  render() {
    const { onClose } = this.props;
    return (
      <Alert
        withCloseButton
        message={
          <View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/images/adn-hombre-correo.png')}
              />
            </View>
            <Text style={styles.alertMessageType}>
              {L.modalinfochangeemail_title}
            </Text>
            <Text style={styles.alertMessageReminder1}>
              {L.modalinfochangeemail_messsage}
            </Text>
          </View>
        }
        actionButton={{
          accessibilityLabel: 'modalinfochangeemail_btn_action',
          title: L.modalinfochangeemail_btn_action,
          onPress: this.onAction,
          style: styles.button,
          typeColor: 'primary',
        }}
        onClose={onClose}
      />
    );
  }
}
