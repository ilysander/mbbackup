import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import { Font, Linking } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import { ButtonLink } from '../ui';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 15,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    fontSize: 12,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 12,
  } as TextStyle,
  note: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
});

const TAG = '[InfoContactError]';

export interface InfoContactErrorProps extends ViewProps {
  title: string;
  accessibilityLabel: string;
  textStyleNumber?: StyleProp<TextStyle>;
  footerQuestionText?: StyleProp<TextStyle>;
}

export interface InfoContactErrorState {}

export default class InfoContactError extends React.Component<
  InfoContactErrorProps,
  InfoContactErrorState
> {
  goToContactScreenWithError = (e: any) => {
    Log.exception(TAG, 'goToContact', e);
  };

  goToContactScreenOrOpenPhone = async (supported: boolean, url: string) => {
    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (e) {
        Log.debug(TAG, 'goToContactScreenOrOpenPhone', e);
      }
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
      textStyleNumber,
      footerQuestionText,
      title,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'infocontactcrash'}
        style={[styles.container, style]}
        {...props}
      >
        <Text
          style={[styles.text, styles.titleText, footerQuestionText]}
          accessibilityLabel={'infocontactcrash_text_title'}
        >
          {title || L.infocontactcrash_asks}
        </Text>

        <View style={styles.note}>
          <Text
            style={[styles.text, textStyleNumber]}
            accessibilityLabel={'infocontact_text'}
          >
            {L.infocontactcrash_contact}{' '}
          </Text>
          <ButtonLink
            accessibilityLabel={'infocontactcrash_buttonlink'}
            style={[{ padding: 0 }]}
            onPress={this.goToContact}
            titleStyle={textStyleNumber}
            onLongPress={this.toggleDebug}
            title={Config.settings.contactPhoneShow}
          />
        </View>
      </View>
    );
  }
}
