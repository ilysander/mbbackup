import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
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
import { Size } from '../../../../resources/dimensions';
import { Font, Linking } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import Log from '../../../../resources/log/Log';
import Config from '../../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  networkStatus: {
    marginTop: 10,
    marginBottom: 10,
  } as ViewStyle,
  button: {
    borderRadius: 25,
    marginBottom: 20,
    marginHorizontal: 10,
  } as ViewStyle,
  buttonSecondary: {
    padding: 7,
  } as ViewStyle,
  content: {
    paddingHorizontal: 40,
  } as ViewStyle,
  contentSubtitle: {
    paddingHorizontal: 20,
  } as ViewStyle,
  subtitleText: {
    ...Font({ weight: 'Medium' }),
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.grey5,
    marginVertical: 20,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 32,
    lineHeight: 35,
    textAlign: 'center',
    color: Colors.primary,
  } as TextStyle,
  textButton: {
    ...Font({ weight: 'SemiBold' }),
    lineHeight: 19,
    fontSize: 16,
    margin: 0,
    padding: 0,
  } as TextStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  loan?: any;
  currency?: any;
  fee?: any;
}

const TAG = '[EmptyLoansScreen]';
class EmptyLoansScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.emptyloansscreen_title,
  //   headerLeft: <View />,
  // };
  state: State = {
    loan: undefined,
  };
  goToLocation = () => {
    this.props.navigation.navigate('Location', {
      shouldGoBack: true,
    });
  };

  goToLoans = async () => {
    try {
      await Linking.openURL(Config.settings.loanListUrl);
    } catch (e) {
      Log.debug(TAG, 'goToLoans', e);
    }
  };

  goToKindOfLoans = async () => {
    try {
      await Linking.openURL(Config.settings.loanInfoUrl);
    } catch (e) {
      Log.debug(TAG, 'goToKindOfLoans', e);
    }
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
            <Content vertical>
              <NetworkStatusAlert style={styles.networkStatus} />
            </Content>
            <Content center={false}>
              <View style={styles.content}>
                <Text style={styles.titleText}>{L.emptyloanscreen_title}</Text>
              </View>
              <View style={styles.contentSubtitle}>
                <Text style={styles.subtitleText}>
                  {L.emptyloanscreen_subtitle}
                </Text>
              </View>
              <Button
                typeColor={'primary'}
                accessibilityLabel={'emptyloansscreen_button_map'}
                title={L.emptyloanscreen_button_go_to_location}
                onPress={this.goToLocation}
                style={styles.button}
                textStyle={styles.textButton}
              />
              <Button
                typeColor={'primary'}
                light
                accessibilityLabel={'emptyloansscreen_button_kind_of_loans'}
                title={L.emptyloanscreen_button_kind_loans}
                onPress={this.goToKindOfLoans}
                style={[styles.button, styles.buttonSecondary]}
                textStyle={styles.textButton}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type EmptyLoansScreenType = EmptyLoansScreen;
export default withFocused<EmptyLoansScreen, Props>(EmptyLoansScreen);
