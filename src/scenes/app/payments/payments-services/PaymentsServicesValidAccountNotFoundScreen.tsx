import * as React from 'react';
import { StyleSheet, ViewStyle, Text, TextStyle, View } from 'react-native';

import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Button,
} from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import { Font } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Size } from '../../../../resources/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    ...Font({ weight: 'Bold', style: 'Italic' }),
    marginBottom: 11,
    color: Colors.primary,
    fontSize: 32,
    lineHeight: 35,
  } as TextStyle,
  description: {
    ...Font({ weight: 'Medium' }),
    textAlign: 'center',
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
  } as TextStyle,
  content: {
    alignItems: 'center',
  } as ViewStyle,
  body: {
    paddingHorizontal: 20,
  } as ViewStyle,
  button: {
    height: 50,
    marginBottom: 40,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class PaymentsServicesValidAccountNotFoundScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsservicesvalidaccountnotfoundscreen_title,
  // };

  goToLocation = () => {
    this.props.navigation.navigate('Location', {
      shouldGoBack: true,
    });
  };
  render() {
    const { isFocused } = this.props;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <NetworkStatusAlert />
            <Content style={styles.content} center>
              <View>
                <View style={styles.body}>
                  <Text style={styles.title}>
                    {L.paymentsservicesvalidaccountnotfoundscreen_message_title}
                  </Text>
                  <Text style={styles.description}>
                    {
                      L.paymentsservicesvalidaccountnotfoundscreen_message_description
                    }
                  </Text>
                </View>
                <Button
                  typeColor={'primary'}
                  accessibilityLabel={
                    'paymentsservicesvalidaccountnotfoundscreen_button_map'
                  }
                  title={
                    L.paymentsservicesvalidaccountnotfoundscreen_button_title
                  }
                  onPress={() => this.goToLocation()}
                  style={styles.button}
                  textStyle={styles.buttonText}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesValidAccountNotFoundScreenType = PaymentsServicesValidAccountNotFoundScreen;
export default withFocused<PaymentsServicesValidAccountNotFoundScreen, Props>(
  PaymentsServicesValidAccountNotFoundScreen
);
