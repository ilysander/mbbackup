import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Linking from '../../resources/functions/Linking';
import { L } from '../../resources/language';
import Config from '../../Config';
import Log from '../../resources/log/Log';
import Alert, { AlertProps } from './Alert';

const TAG = '[MaintenanceModal]';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accentDark,
    fontSize: 26,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  } as TextStyle,
  text: {
    ...Font(),
    paddingBottom: 10,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  imageIcon: {
    tintColor: Colors.accentDark,
    width: 75,
    height: 75,
  } as ImageStyle,
});

export interface MaintenanceModalProps extends AlertProps {
  icon?: ImageSourcePropType;
  title?: string;
  message?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface MaintenanceModalState {}

export default class MaintenanceModal extends React.Component<
  MaintenanceModalProps,
  MaintenanceModalState
> {
  goToHomeBanking = async () => {
    const { onSuccess } = this.props;
    onSuccess && onSuccess();
    try {
      await Linking.openURL(Config.settings.frontendUrl);
    } catch (e) {
      Log.debug(TAG, 'goToHomeBanking', e);
    }
  };
  render() {
    const { onSuccess, ...props } = this.props;
    return (
      <Alert
        cancelButton={{
          accessibilityLabel: 'maintenancemodaloptions_button_success',
          light: false,
          title: L.maintenancemodaloptions_button_success,
          onPress: onSuccess,
        }}
        actionButton={{
          accessibilityLabel: 'maintenancemodaloptions_button_gotoweb',
          typeColor: 'primaryLight',
          title: L.maintenancemodaloptions_button_gotoweb,
          onPress: this.goToHomeBanking,
        }}
        {...props}
        message={
          <View
            style={styles.content}
            accessibilityLabel={'maintenancemessage_content'}
          >
            <Image
              style={styles.imageIcon}
              resizeMode={'stretch'}
              source={require('../../assets/images/error-icon.png')}
            />
            {
              <Text
                style={styles.titleText}
                accessibilityLabel={'maintenancemodal_text_title'}
              >
                {L.maintenancemodal_text_title}
              </Text>
            }
            {[
              <Text
                style={styles.text}
                key="description"
                accessibilityLabel={'maintenancemodal_text_description'}
              >
                {L.maintenancemodal_text_description}
              </Text>,
              <Text
                style={styles.text}
                key="message"
                accessibilityLabel={'maintenancemodal_text_message'}
              >
                {L.maintenancemodal_text_message}
              </Text>,
            ]}
          </View>
        }
      />
    );
  }
}
