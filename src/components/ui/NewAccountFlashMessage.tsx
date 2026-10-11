import * as React from 'react';
import Button from '../../components/ui/Button';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ViewProps,
  View,
  Text,
  StyleProp,
} from 'react-native';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';
import { L } from '../../resources/language';
import Validate from '../../resources/functions/Validate';
import ModalInfoNoEmail from '../email/ModalInfoNoEmail';
import { PreferencesUserDataModifyPreResponse } from '../../api/backend/response/Execute';
import { NavigationProp } from '@react-navigation/native';
const styles = StyleSheet.create({
  flashView: {
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 4, width: 0 },
    borderRadius: 8,
    overflow: 'visible',
    borderStyle: 'dashed',
    borderColor: Colors.grey4,
    borderWidth: 1,
    marginBottom: 30,
  } as ViewStyle,
  flashSubView: {
    marginVertical: 40,
  } as ViewStyle,
  flashButton: {
    marginHorizontal: 40,
    minHeight: 40,
  } as ViewStyle,
  flashButtonText: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
  } as TextStyle,
  flashMovements: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 30,
    ...Font({ weight: 'Medium' }),
    fontSize: 14,
    color: Colors.grey5,
    textAlign: 'center',
  } as TextStyle,
  title: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 22,
    lineHeight: 25,
    textAlign: 'center',
  } as TextStyle,
});

export interface NewAccountFlashMessageProps extends ViewProps {
  navigation: NavigationProp<any, any>;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  styleColor?: StyleProp<TextStyle>;
  typeColor?:
  | 'primaryLight'
  | 'primary'
  | 'secondary'
  | 'accentDark'
  | 'accent'
  | 'danger'
  | 'neutral';

  // hasEmail: boolean;
  user: PreferencesUserDataModifyPreResponse;
}
export interface NewAccountFlashMessageState {
  showModalEmail: boolean;
}
export default class NewAccountFlashMessage extends React.Component<
  NewAccountFlashMessageProps,
  NewAccountFlashMessageState
> {
  state: NewAccountFlashMessageState = {
    showModalEmail: false,
  };

  goCreateAccount = () => {
    const { user } = this.props;
    if (!user._mail) {
      this.setState({ showModalEmail: true });
      return;
    }
    if (Validate.isAllowedNewAccount()) {
      this.props.navigation.navigate('NewAccount');
    } else {
      this.props.navigation.navigate('Location', {
        shouldGoBack: true,
      });
    }
  };

  closeEmailModal = () => {
    this.setState({ showModalEmail: false });
  };

  render() {
    const {
      title,
      message,
      styleColor,
      typeColor,
      navigation,
      user,
    } = this.props;
    const { showModalEmail } = this.state;
    const isAllowedNewAccount = Validate.isAllowedNewAccount();

    return (
      <View style={styles.flashView}>
        {showModalEmail && (
          <ModalInfoNoEmail
            accessibilityLabel={'newaccount_flashmessage_modalinfo_noemail'}
            navigation={navigation}
            onClose={this.closeEmailModal}
            user={user}
          />
        )}
        <View style={styles.flashSubView}>
          <Text style={[styles.title, styleColor]}>{title}</Text>
          <Text style={styles.flashMovements}>{message}</Text>
          <Button
            title={
              isAllowedNewAccount
                ? L.queriesscreen_flashmessage_btn_account
                : L.queriesscreen_flashmessage_btn
            }
            accessibilityLabel={'newaccount_flashmessage_button_close'}
            onPress={this.goCreateAccount}
            style={styles.flashButton}
            typeColor={typeColor}
            textStyle={styles.flashButtonText}
          />
        </View>
      </View>
    );
  }
}
