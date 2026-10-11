import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import { Font, Linking } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import Features from '../../resources/remote/Features';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
  } as ViewStyle,
  strong: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  accent: {
    color: Colors.accentDark,
  } as TextStyle,
  mainText: {
    textAlign: 'center',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    ...Font(),
  } as TextStyle,
  secondaryText: {
    color: Colors.grey6,
  } as TextStyle,
});

const TAG = '[InfoContactMaintenance]';

export interface InfoContactMaintenanceProps extends ViewProps {
  navigate: any;
  accessibilityLabel: string;
}

export interface InfoContactMaintenanceState {}

export default class InfoContactMaintenance extends React.Component<
  InfoContactMaintenanceProps,
  InfoContactMaintenanceState
> {
  goToContactScreenWithError = (e: any) => {
    Log.exception(TAG, 'goToContact', e);
    this.props.navigate('Contact');
  };

  goToContactScreenOrOpenPhone = async (supported: boolean, url: string) => {
    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (e) {
        Log.debug(TAG, 'goToContactScreenOrOpenPhone', e);
      }
    } else {
      this.props.navigate('Contact');
    }
  };

  goToContact = async () => {
    const url = `tel:${Config.settings.contactPhone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      await this.goToContactScreenOrOpenPhone(supported, url);
    } catch (e) {
      this.goToContactScreenWithError(e);
    }
  };

  toggleDebug = () => {
    Emitter.emit('onToggleDebug', true);
  };

  render() {
    const { style, accessibilityLabel, ...props } = this.props;

    if (!Features.isAllowedTo('Contact')) {
      return null;
    }

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'infocontactmaintenance'}
        style={[styles.container, style]}
        {...props}
      >
        <Text
          accessibilityLabel={'infocontactmaintenance_text'}
          style={styles.mainText}
        >
          <Text style={styles.secondaryText}>
            {L.infocontactmaintenance_main_text}{' '}
          </Text>
          <Text
            style={[
              styles.title,
              styles.strong,
              styles.accent,
              styles.secondaryText,
            ]}
            accessibilityLabel={'infocontactmaintenance_phonenumber'}
            onPress={this.goToContact}
            onLongPress={this.toggleDebug}
          >
            {Config.settings.contactPhoneShow}
          </Text>
        </Text>
      </View>
    );
  }
}
