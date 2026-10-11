import * as React from 'react';
import {
  withFocused,
  FocusedProps,
} from '../../../components/screen/ScreenContainer';
import { View, StyleSheet, ViewStyle, TextStyle, Text } from 'react-native';
import { Button } from '../../../components/ui';
import { L } from '../../../resources/language';
import { Font, Validate } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  flashView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  flashSubView: {
    marginVertical: 40,
  } as ViewStyle,
  flashButton: {
    marginHorizontal: 40,
    minHeight: 50,
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
    fontSize: 32,
    lineHeight: 35,
    textAlign: 'center',
    color: Colors.primary,
  } as TextStyle,
});

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
}

class NewAccountLoanScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
  };

  goCreateAccount = () => {
    if (Validate.isAllowedNewAccount()) {
      this.props.navigation.navigate('NewAccount');
    } else {
      this.props.navigation.navigate('Location', {
        shouldGoBack: true,
      });
    }
  };

  render() {
    const isAllowedNewAccount = Validate.isAllowedNewAccount();
    return (
      <View style={styles.flashView}>
        <View style={styles.flashSubView}>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.title]}>{L.newaccountloanscreen_header}</Text>
            <Text style={styles.flashMovements}>
              {isAllowedNewAccount
                ? L.newaccountloanscreen_body_newaccount
                : L.newaccountloanscreen_body}
            </Text>
          </View>
          <Button
            title={
              isAllowedNewAccount
                ? L.newaccountloanscreen_btn_newaccount
                : L.newaccountloanscreen_btn
            }
            accessibilityLabel={'newaccount_flashmessage_button_close'}
            onPress={this.goCreateAccount}
            style={styles.flashButton}
            typeColor={'primary'}
            textStyle={styles.flashButtonText}
          />
        </View>
      </View>
    );
  }
}

export type NewAccountLoanScreenType = NewAccountLoanScreen;
export default withFocused<NewAccountLoanScreen, Props>(NewAccountLoanScreen);
