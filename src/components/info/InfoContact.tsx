import * as React from 'react';
import {
  StyleProp,
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
import { ButtonLink } from '../ui';
import Features from '../../resources/remote/Features';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primary,
    fontSize: 14,
  } as TextStyle,
  titleText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  note: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  button: {
    padding: 0,
  } as ViewStyle,
});

const TAG = '[InfoContact]';

export interface InfoContactProps extends ViewProps {
  navigate: any;
  linkStyle?: StyleProp<TextStyle>;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
}

export interface InfoContactState {}

export default class InfoContact extends React.Component<
  InfoContactProps,
  InfoContactState
> {
  goToContactScreenWithError = (e: any) => {
    Log.exception(TAG, 'goToContact', e);
    this.goToContactNavigate();
  };
  goToContactNavigate = () => {
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
      this.goToContactNavigate();
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
    const {
      style,
      linkStyle,
      title,
      subtitle,
      titleStyle,
      subtitleStyle,
      accessibilityLabel,
      ...props
    } = this.props;

    if (!Features.isAllowedTo('Contact')) {
      return null;
    }

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'infocontact'}
        style={[styles.container, style]}
        {...props}
      >
        <Text
          style={[styles.titleText, titleStyle]}
          accessibilityLabel={'infocontact_text_title'}
        >
          {title || L.infocontact_asks}
        </Text>

        {!!subtitle && (
          <Text
            style={[styles.text, subtitleStyle]}
            accessibilityLabel={'infocontact_text'}
          >
            {subtitle}
          </Text>
        )}
        {!subtitle && (
          <View style={styles.note} accessibilityLabel={'infocontact_note'}>
            <Text style={styles.text} accessibilityLabel={'infocontact_text'}>
              {L.infocontact_contact}{' '}
            </Text>
            <ButtonLink
              accent={'primary'}
              accessibilityLabel={'infocontact_buttonlink'}
              style={styles.button}
              titleStyle={[styles.text, linkStyle]}
              onPress={this.goToContact}
              hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
              onLongPress={this.toggleDebug}
              title={Config.settings.contactPhoneShow}
            />
          </View>
        )}
      </View>
    );
  }
}
